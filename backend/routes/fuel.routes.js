import express from 'express';
import { estimateFuel } from '../controllers/fuel.controller.js';

const router = express.Router();

// POST /api/fuel/estimate
router.post('/estimate', estimateFuel);

export default router;
