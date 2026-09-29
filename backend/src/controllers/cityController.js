import { db } from '../models/dataStore.js';

// @desc    Get cities (optional ?state=)
// @route   GET /api/cities
// @access  Public
export const getCities = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.state) {
      filter.stateSlug = req.query.state.toLowerCase();
    }

    const cities = await db.city.find(filter);
    res.json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get city by slug
// @route   GET /api/cities/:slug
// @access  Public
export const getCityBySlug = async (req, res, next) => {
  try {
    const city = await db.city.findOne({ slug: req.params.slug.toLowerCase() });
    if (!city) {
      return res.status(404).json({
        success: false,
        error: `City '${req.params.slug}' not found`,
      });
    }

    const destinations = await db.destination.find({
      city: city.slug,
      isActive: true,
      status: { $ne: 'draft' },
    });

    res.json({
      success: true,
      data: {
        ...city,
        destinations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create city
// @route   POST /api/admin/cities
// @access  Private (Admin)
export const createCity = async (req, res, next) => {
  try {
    const { name, stateSlug, description, image } = req.body;
    if (!name || !stateSlug) {
      return res.status(400).json({
        success: false,
        error: 'City name and state are required',
      });
    }

    const state = await db.state.findOne({ slug: stateSlug.toLowerCase() });
    if (!state) {
      return res.status(400).json({
        success: false,
        error: `State '${stateSlug}' does not exist`,
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCity = await db.city.create({
      name,
      slug,
      stateSlug: state.slug,
      stateName: state.name,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: newCity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update city
// @route   PUT /api/admin/cities/:id
// @access  Private (Admin)
export const updateCity = async (req, res, next) => {
  try {
    const city = await db.city.findById(req.params.id);
    if (!city) {
      return res.status(404).json({
        success: false,
        error: 'City not found',
      });
    }

    const updated = await db.city.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete city
// @route   DELETE /api/admin/cities/:id
// @access  Private (Admin)
export const deleteCity = async (req, res, next) => {
  try {
    const city = await db.city.findById(req.params.id);
    if (!city) {
      return res.status(404).json({
        success: false,
        error: 'City not found',
      });
    }

    await db.city.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      data: { message: `City '${city.name}' removed` },
    });
  } catch (error) {
    next(error);
  }
};
