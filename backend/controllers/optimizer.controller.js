import { calculateOptimalRoute } from '../services/optimizer.service.js';

export const optimizeRoute = async (req, res, next) => {
  try {
    const { locations, distanceMatrix } = req.body;

    if (!locations || !Array.isArray(locations) || locations.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least two locations are required for route optimization' 
      });
    }

    if (!distanceMatrix || !Array.isArray(distanceMatrix)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Distance matrix is required for optimization' 
      });
    }

    const optimizedRoute = await calculateOptimalRoute(locations, distanceMatrix);

    res.status(200).json({
      success: true,
      data: optimizedRoute
    });
  } catch (error) {
    next(error);
  }
};
