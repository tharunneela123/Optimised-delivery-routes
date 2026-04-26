import express from 'express';
import { calculateDistanceMatrix } from '../controllers/distance.controller.js';

const router = express.Router();

// POST /api/distance/matrix
router.post('/matrix', calculateDistanceMatrix);

export default router;
