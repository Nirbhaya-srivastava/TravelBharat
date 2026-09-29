import express from 'express';
import {
  getCities,
  getCityBySlug,
} from '../controllers/cityController.js';

const router = express.Router();

router.route('/')
  .get(getCities);

router.route('/:slug')
  .get(getCityBySlug);

export default router;
