import { getCoordinates } from '../services/geocoding.service.js';

export const geocodeAddress = async (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ success: false, message: 'Address is required' });
    }

    const coordinates = await getCoordinates(address);

    res.status(200).json({
      success: true,
      data: coordinates
    });
  } catch (error) {
    next(error);
  }
};
