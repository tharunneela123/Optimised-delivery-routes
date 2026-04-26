import express from 'express';
import { optimizeRoute } from '../controllers/optimizer.controller.js';

const router = express.Router();

// POST /api/optimizer/route
router.post('/route', optimizeRoute);

export default router;
