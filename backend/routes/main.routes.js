import express from 'express';
import { fullRouteOptimization } from '../controllers/orchestrator.controller.js';

const router = express.Router();

// POST /api/route/optimize
router.post('/optimize', fullRouteOptimization);

export default router;
