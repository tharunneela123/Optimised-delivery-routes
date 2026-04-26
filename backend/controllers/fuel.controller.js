import { calculateFuelCost } from '../services/fuel.service.js';

export const estimateFuel = async (req, res, next) => {
  try {
    const { totalDistance, vehicleType = 'standard' } = req.body;

    if (totalDistance === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Total distance is required for fuel estimation' 
      });
    }

    const fuelEstimate = await calculateFuelCost(totalDistance, vehicleType);

    res.status(200).json({
      success: true,
      data: fuelEstimate
    });
  } catch (error) {
    next(error);
  }
};
