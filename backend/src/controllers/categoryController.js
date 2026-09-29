import { db } from '../models/dataStore.js';

// @desc    Get all categories with destination count
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await db.category.find({ isActive: true });
    const destinations = await db.destination.find({ isActive: true, status: { $ne: 'draft' } });

    const countMap = {};
    destinations.forEach((d) => {
      countMap[d.category] = (countMap[d.category] || 0) + 1;
    });

    const enrichedCategories = categories.map((cat) => ({
      ...cat,
      destinationCount: countMap[cat.slug] || 0,
    }));

    res.json({
      success: true,
      count: enrichedCategories.length,
      data: enrichedCategories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug with destinations
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await db.category.findOne({ slug: req.params.slug.toLowerCase() });
    if (!category) {
      return res.status(404).json({
        success: false,
        error: `Category '${req.params.slug}' not found`,
      });
    }

    const destinations = await db.destination.find({
      category: category.slug,
      isActive: true,
      status: { $ne: 'draft' },
    });

    res.json({
      success: true,
      data: {
        ...category,
        destinationCount: destinations.length,
        destinations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required',
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await db.category.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Category already exists',
      });
    }

    const newCat = await db.category.create({
      name,
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: newCat,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const category = await db.category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    const updated = await db.category.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await db.category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    await db.category.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      data: { message: `Category '${category.name}' removed` },
    });
  } catch (error) {
    next(error);
  }
};
