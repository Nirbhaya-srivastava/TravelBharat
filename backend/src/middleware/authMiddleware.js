import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { db } from '../models/dataStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no bearer token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const admin = await db.admin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Admin account not found or deactivated',
      });
    }

    req.admin = {
      id: admin._id || admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authorization token',
    });
  }
};
