import { getClaudeSummary } from '../services/summary.service.js';

export const generateSummary = async (req, res, next) => {
  try {
    const { routeData } = req.body;

    if (!routeData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Route data is required to generate a summary' 
      });
    }

    const summary = await getClaudeSummary(
      routeData.optimizedLocations, 
      routeData.totalDistance, 
      routeData.totalDuration
    );

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};
