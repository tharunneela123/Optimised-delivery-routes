import express from 'express';
import { geocodeAddress } from '../controllers/geocoding.controller.js';

const router = express.Router();

// POST /api/geocoding/geocode
router.post('/geocode', geocodeAddress);

export default router;
