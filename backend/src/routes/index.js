import express from 'express';
import stateRoutes from './stateRoutes.js';
import cityRoutes from './cityRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import destinationRoutes from './destinationRoutes.js';
import adminRoutes from './adminRoutes.js';
import { db } from '../models/dataStore.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    name: 'TravelBharat - Digital Tourism Encyclopedia API',
    tagline: 'Discover India. Explore Bharat.',
    timestamp: new Date().toISOString(),
    database: db.isMongo ? 'MongoDB Atlas (Connected)' : 'Resilient In-Memory Data Store (Active)',
  });
});

router.use('/states', stateRoutes);
router.use('/cities', cityRoutes);
router.use('/categories', categoryRoutes);
router.use('/destinations', destinationRoutes);
router.use('/admin', adminRoutes);

export default router;
