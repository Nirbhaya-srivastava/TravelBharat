import { db } from '../models/dataStore.js';

// @desc    Get destinations with multi-criteria filtering, sorting, and pagination
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res, next) => {
  try {
    const {
      state,
      city,
      category,
      verified,
      search,
      sort,
      page = 1,
      limit = 12,
      includeDrafts,
    } = req.query;

    const filter = { isActive: true };

    // Public users only see published or verified destinations unless admin requests includeDrafts
    if (includeDrafts !== 'true') {
      filter.status = { $ne: 'draft' };
    }

    if (state && state !== 'all') {
      filter.state = state.toLowerCase();
    }

    if (city && city !== 'all') {
      filter.city = city.toLowerCase();
    }

    if (category && category !== 'all') {
      filter.category = category.toLowerCase();
    }

    if (verified === 'true') {
      filter.verified = true;
    }

    let destinations = await db.destination.find(filter);

    // Text search filter if provided
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      destinations = destinations.filter((item) => {
        return (
          item.name.toLowerCase().includes(q) ||
          (item.stateName && item.stateName.toLowerCase().includes(q)) ||
          (item.cityName && item.cityName.toLowerCase().includes(q)) ||
          (item.categoryName && item.categoryName.toLowerCase().includes(q)) ||
          (item.shortDescription && item.shortDescription.toLowerCase().includes(q))
        );
      });
    }

    // Sort
    if (sort === 'name-asc') {
      destinations.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      destinations.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'oldest') {
      destinations.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      // Default: newest or featured
      destinations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = destinations.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = destinations.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      count: paginated.length,
      data: paginated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single destination by slug with full details, nearby attractions, and related
// @route   GET /api/destinations/:slug
// @access  Public
export const getDestinationBySlug = async (req, res, next) => {
  try {
    const destination = await db.destination.findOne({
      slug: req.params.slug.toLowerCase(),
      isActive: true,
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: `Destination '${req.params.slug}' not found`,
      });
    }

    // Lookup nearby attractions details
    let nearbyItems = [];
    if (destination.nearbyAttractions && destination.nearbyAttractions.length > 0) {
      const allDestinations = await db.destination.find({ isActive: true });
      nearbyItems = allDestinations.filter((d) => {
        if (d.slug === destination.slug) return false;
        return (
          destination.nearbyAttractions.some(
            (att) => d.name.toLowerCase().includes(att.toLowerCase()) || att.toLowerCase().includes(d.name.toLowerCase())
          ) || (d.city === destination.city)
        );
      }).slice(0, 4);
    }

    // If fewer than 2 nearby matches found, supplement with same state or same category
    if (nearbyItems.length < 3) {
      const stateSiblings = await db.destination.find({
        state: destination.state,
        isActive: true,
        slug: { $ne: destination.slug },
      });
      nearbyItems = [...nearbyItems, ...stateSiblings.filter((s) => !nearbyItems.some((n) => n.slug === s.slug))].slice(0, 4);
    }

    // Related destinations in same category
    const relatedDestinations = (
      await db.destination.find({
        category: destination.category,
        isActive: true,
        slug: { $ne: destination.slug },
      })
    ).slice(0, 4);

    res.json({
      success: true,
      data: {
        ...destination,
        nearbyPlaces: nearbyItems,
        relatedDestinations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Global search across destinations, states, cities, categories
// @route   GET /api/destinations/search?q=
// @access  Public
export const searchAll = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    if (!q) {
      return res.json({
        success: true,
        query: '',
        data: {
          destinations: [],
          states: [],
          cities: [],
          categories: [],
        },
      });
    }

    const [destinations, states, cities, categories] = await Promise.all([
      db.destination.find({ isActive: true, status: { $ne: 'draft' } }),
      db.state.find({ isActive: true }),
      db.city.find({ isActive: true }),
      db.category.find({ isActive: true }),
    ]);

    const matchedDestinations = destinations.filter((d) =>
      d.name.toLowerCase().includes(q) ||
      d.stateName.toLowerCase().includes(q) ||
      d.cityName.toLowerCase().includes(q) ||
      d.categoryName.toLowerCase().includes(q) ||
      (d.shortDescription && d.shortDescription.toLowerCase().includes(q))
    );

    const matchedStates = states.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.capital.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
    );

    const matchedCities = cities.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.stateName.toLowerCase().includes(q)
    );

    const matchedCategories = categories.filter((cat) =>
      cat.name.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );

    res.json({
      success: true,
      query: q,
      totalMatches: matchedDestinations.length + matchedStates.length + matchedCities.length + matchedCategories.length,
      data: {
        destinations: matchedDestinations,
        states: matchedStates,
        cities: matchedCities,
        categories: matchedCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create destination
// @route   POST /api/admin/destinations
// @access  Private (Admin)
export const createDestination = async (req, res, next) => {
  try {
    const {
      name,
      state,
      city,
      category,
      shortDescription,
      description,
      historicalSignificance,
      culturalSignificance,
      bestTimeToVisit,
      recommendedDuration,
      openingHours,
      entryFee,
      location,
      mapUrl,
      images,
      nearbyAttractions,
      travelTips,
      howToReach,
      verified,
      status,
    } = req.body;

    if (!name || !state || !city || !category || !shortDescription || !description || !location) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields (name, state, city, category, shortDescription, description, location)',
      });
    }

    const stateObj = await db.state.findOne({ slug: state.toLowerCase() });
    const cityObj = await db.city.findOne({ slug: city.toLowerCase() });
    const categoryObj = await db.category.findOne({ slug: category.toLowerCase() });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await db.destination.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'A destination with this name or slug already exists',
      });
    }

    // Default map URL if not provided
    const computedMapUrl = mapUrl || `https://maps.google.com/?q=${encodeURIComponent(name + ', ' + (cityObj ? cityObj.name : city) + ', ' + (stateObj ? stateObj.name : state))}`;

    const newDest = await db.destination.create({
      name,
      slug,
      state: state.toLowerCase(),
      stateName: stateObj ? stateObj.name : state,
      city: city.toLowerCase(),
      cityName: cityObj ? cityObj.name : city,
      category: category.toLowerCase(),
      categoryName: categoryObj ? categoryObj.name : category,
      shortDescription,
      description,
      historicalSignificance: historicalSignificance || '',
      culturalSignificance: culturalSignificance || '',
      bestTimeToVisit: bestTimeToVisit || 'October - March',
      recommendedDuration: recommendedDuration || '2-3 hours',
      openingHours: openingHours || 'Sunrise to Sunset',
      entryFee: entryFee || 'Free entry',
      location,
      mapUrl: computedMapUrl,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'],
      nearbyAttractions: Array.isArray(nearbyAttractions) ? nearbyAttractions : nearbyAttractions ? nearbyAttractions.split(',').map((s) => s.trim()) : [],
      travelTips: Array.isArray(travelTips) ? travelTips : travelTips ? travelTips.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      howToReach: typeof howToReach === 'object' && howToReach !== null ? howToReach : { air: '', train: '', road: '' },
      verified: Boolean(verified),
      status: status || (verified ? 'verified' : 'published'),
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: newDest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update destination
// @route   PUT /api/admin/destinations/:id
// @access  Private (Admin)
export const updateDestination = async (req, res, next) => {
  try {
    const destination = await db.destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found',
      });
    }

    const updates = { ...req.body };

    // Format arrays if string sent
    if (typeof updates.nearbyAttractions === 'string') {
      updates.nearbyAttractions = updates.nearbyAttractions.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (typeof updates.travelTips === 'string') {
      updates.travelTips = updates.travelTips.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    if (typeof updates.images === 'string') {
      updates.images = updates.images.split('\n').map((s) => s.trim()).filter(Boolean);
    }

    if (updates.state) {
      const s = await db.state.findOne({ slug: updates.state.toLowerCase() });
      if (s) updates.stateName = s.name;
    }
    if (updates.city) {
      const c = await db.city.findOne({ slug: updates.city.toLowerCase() });
      if (c) updates.cityName = c.name;
    }
    if (updates.category) {
      const cat = await db.category.findOne({ slug: updates.category.toLowerCase() });
      if (cat) updates.categoryName = cat.name;
    }

    const updated = await db.destination.findByIdAndUpdate(req.params.id, updates);

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete destination
// @route   DELETE /api/admin/destinations/:id
// @access  Private (Admin)
export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await db.destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found',
      });
    }

    await db.destination.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: { message: `Destination '${destination.name}' removed` },
    });
  } catch (error) {
    next(error);
  }
};
