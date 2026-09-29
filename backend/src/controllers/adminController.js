import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { db } from '../models/dataStore.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    const admin = await db.admin.findOne({ email: email.toLowerCase() });

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const token = generateToken(admin._id || admin.id);

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id || admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & counters
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const [states, cities, categories, destinations] = await Promise.all([
      db.state.find(),
      db.city.find(),
      db.category.find(),
      db.destination.find(),
    ]);

    const totalStates = states.length;
    const totalCities = cities.length;
    const totalCategories = categories.length;
    const totalDestinations = destinations.length;

    const verifiedCount = destinations.filter((d) => d.verified).length;
    const publishedCount = destinations.filter((d) => d.status === 'published' || d.status === 'verified').length;
    const draftCount = destinations.filter((d) => d.status === 'draft').length;

    // Recent 5 destinations
    const sorted = [...destinations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentDestinations = sorted.slice(0, 5);

    res.json({
      success: true,
      data: {
        totalStates,
        totalCities,
        totalCategories,
        totalDestinations,
        verifiedCount,
        publishedCount,
        draftCount,
        recentDestinations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/admin/me
// @access  Private (Admin)
export const getMe = async (req, res, next) => {
  try {
    const admin = await db.admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    res.json({
      success: true,
      data: {
        id: admin._id || admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
