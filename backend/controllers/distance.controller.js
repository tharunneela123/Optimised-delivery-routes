import { getDistanceMatrix } from '../services/distance.service.js';

export const calculateDistanceMatrix = async (req, res, next) => {
  try {
    const { locations } = req.body;

    if (!locations || !Array.isArray(locations) || locations.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least two locations are required to calculate a distance matrix' 
      });
    }

    const matrix = await getDistanceMatrix(locations);

    res.status(200).json({
      success: true,
      data: matrix
    });
  } catch (error) {
    next(error);
  }
};
