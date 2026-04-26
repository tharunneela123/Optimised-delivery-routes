import express from 'express';
import { generateSummary } from '../controllers/summary.controller.js';

const router = express.Router();

// POST /api/summary/generate
router.post('/generate', generateSummary);

export default router;
