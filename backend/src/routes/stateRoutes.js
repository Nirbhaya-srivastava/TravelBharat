import express from 'express';
import {
  getStates,
  getStateBySlug,
} from '../controllers/stateController.js';

const router = express.Router();

router.route('/')
  .get(getStates);

router.route('/:slug')
  .get(getStateBySlug);

export default router;
