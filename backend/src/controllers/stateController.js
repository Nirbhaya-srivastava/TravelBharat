import { db } from '../models/dataStore.js';

// @desc    Get all states with dynamic destination count
// @route   GET /api/states
// @access  Public
export const getStates = async (req, res, next) => {
  try {
    const states = await db.state.find({ isActive: true });
    const destinations = await db.destination.find({ isActive: true, status: { $ne: 'draft' } });

    // Calculate destination counts per state dynamically
    const countMap = {};
    destinations.forEach((d) => {
      countMap[d.state] = (countMap[d.state] || 0) + 1;
    });

    const enrichedStates = states.map((s) => ({
      ...s,
      destinationCount: countMap[s.slug] || 0,
    }));

    // Sort states alphabetically by name
    enrichedStates.sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      count: enrichedStates.length,
      data: enrichedStates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single state by slug with cities and destinations
// @route   GET /api/states/:slug
// @access  Public
export const getStateBySlug = async (req, res, next) => {
  try {
    const state = await db.state.findOne({ slug: req.params.slug.toLowerCase() });
    if (!state) {
      return res.status(404).json({
        success: false,
        error: `State with slug '${req.params.slug}' not found`,
      });
    }

    const cities = await db.city.find({ stateSlug: state.slug, isActive: true });
    const destinations = await db.destination.find({
      state: state.slug,
      isActive: true,
      status: { $ne: 'draft' },
    });

    // Categories in this state
    const categorySlugs = [...new Set(destinations.map((d) => d.category))];
    const categories = await db.category.find({ slug: { $in: categorySlugs } });

    res.json({
      success: true,
      data: {
        ...state,
        destinationCount: destinations.length,
        cities,
        destinations,
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new state
// @route   POST /api/admin/states
// @access  Private (Admin)
export const createState = async (req, res, next) => {
  try {
    const { name, capital, description, image, culture, cuisine, festivals, geography, type } = req.body;
    if (!name || !capital) {
      return res.status(400).json({
        success: false,
        error: 'State name and capital are required',
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await db.state.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'A state with this name or slug already exists',
      });
    }

    const newState = await db.state.create({
      name,
      slug,
      capital,
      type: type || 'State',
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
      culture: culture || '',
      cuisine: cuisine || '',
      festivals: Array.isArray(festivals) ? festivals : festivals ? festivals.split(',').map((f) => f.trim()) : [],
      geography: geography || '',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: newState,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update state
// @route   PUT /api/admin/states/:id
// @access  Private (Admin)
export const updateState = async (req, res, next) => {
  try {
    const state = await db.state.findById(req.params.id);
    if (!state) {
      return res.status(404).json({
        success: false,
        error: 'State not found',
      });
    }

    const updates = { ...req.body };
    if (typeof updates.festivals === 'string') {
      updates.festivals = updates.festivals.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const updatedState = await db.state.findByIdAndUpdate(req.params.id, updates);

    res.json({
      success: true,
      data: updatedState,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete state
// @route   DELETE /api/admin/states/:id
// @access  Private (Admin)
export const deleteState = async (req, res, next) => {
  try {
    const state = await db.state.findById(req.params.id);
    if (!state) {
      return res.status(404).json({
        success: false,
        error: 'State not found',
      });
    }

    await db.state.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: { message: `State '${state.name}' removed successfully` },
    });
  } catch (error) {
    next(error);
  }
};
