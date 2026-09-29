import express from 'express';
import {
  loginAdmin,
  getDashboardStats,
  getMe,
} from '../controllers/adminController.js';
import {
  createState,
  updateState,
  deleteState,
} from '../controllers/stateController.js';
import {
  createCity,
  updateCity,
  deleteCity,
} from '../controllers/cityController.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import {
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth
router.post('/login', loginAdmin);

// Protected routes
router.use(protect);

router.get('/me', getMe);
router.get('/dashboard', getDashboardStats);

// State CRUD
router.post('/states', createState);
router.put('/states/:id', updateState);
router.delete('/states/:id', deleteState);

// City CRUD
router.post('/cities', createCity);
router.put('/cities/:id', updateCity);
router.delete('/cities/:id', deleteCity);

// Category CRUD
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Destination CRUD
router.post('/destinations', createDestination);
router.put('/destinations/:id', updateDestination);
router.delete('/destinations/:id', deleteDestination);

export default router;
