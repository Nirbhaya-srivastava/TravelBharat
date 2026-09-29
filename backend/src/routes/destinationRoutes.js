import express from 'express';
import {
  getDestinations,
  getDestinationBySlug,
  searchAll,
} from '../controllers/destinationController.js';

const router = express.Router();

router.route('/search')
  .get(searchAll);

router.route('/')
  .get(getDestinations);

router.route('/:slug')
  .get(getDestinationBySlug);

export default router;
