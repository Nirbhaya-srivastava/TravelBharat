import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
} from '../controllers/categoryController.js';

const router = express.Router();

router.route('/')
  .get(getCategories);

router.route('/:slug')
  .get(getCategoryBySlug);

export default router;
