import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import geocodingRoutes from './routes/geocoding.routes.js';
import distanceRoutes from './routes/distance.routes.js';
import optimizerRoutes from './routes/optimizer.routes.js';
import fuelRoutes from './routes/fuel.routes.js';
import summaryRoutes from './routes/summary.routes.js';
import mainRoutes from './routes/main.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/geocoding', geocodingRoutes);
app.use('/api/distance', distanceRoutes);
app.use('/api/optimizer', optimizerRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/route', mainRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SmartRoute AI Backend is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
