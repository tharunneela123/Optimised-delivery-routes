import { getCoordinates } from '../services/geocoding.service.js';
import { getDistanceMatrix } from '../services/distance.service.js';
import { calculateOptimalRoute } from '../services/optimizer.service.js';
import { calculateFuelCost } from '../services/fuel.service.js';
import { getClaudeSummary } from '../services/summary.service.js';

export const fullRouteOptimization = async (req, res, next) => {
  try {
    const { startLocation, stops, vehicleType = 'standard' } = req.body;

    if (!startLocation || !stops || !Array.isArray(stops) || stops.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'startLocation and a stops array are required'
      });
    }

    // 1. Geocode all locations sequentially to respect Nominatim API rate limits (max 1 req/sec)
    const allAddresses = [
      { address: startLocation, isPriority: true }, // Start is always high priority
      ...stops.map(s => typeof s === 'string' ? { address: s, isPriority: false } : s)
    ];
    const geocodedLocations = [];
    
    for (const item of allAddresses) {
      try {
        const coords = await getCoordinates(item.address);
        geocodedLocations.push({ 
          ...coords, 
          originalAddress: item.address,
          isPriority: item.isPriority 
        });
        
        // Wait 1 second between requests to avoid getting blocked by OpenStreetMap
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Failed to geocode address: ${item.address}`
        });
      }
    }

    // 2. Build Distance Matrix using OSRM
    const distanceMatrix = await getDistanceMatrix(geocodedLocations);

    // 3. Run TSP Optimization (Nearest Neighbour + 2-opt)
    const optimizationResult = await calculateOptimalRoute(geocodedLocations, distanceMatrix);

    // 4. Calculate Fuel Estimation
    const fuelEstimate = await calculateFuelCost(optimizationResult.totalDistance, vehicleType);

    // 5. Generate AI Briefing
    const aiBriefing = await getClaudeSummary(
      optimizationResult.optimizedLocations, 
      optimizationResult.totalDistance, 
      optimizationResult.totalDuration
    );

    // 6. Return full unified result
    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalDistanceKm: optimizationResult.totalDistance,
          totalDurationMinutes: optimizationResult.totalDuration,
          vehicleType: vehicleType,
          aiBriefing: aiBriefing.summary,
          aiProvider: aiBriefing.provider
        },
        fuel: fuelEstimate,
        optimizedOrder: optimizationResult.optimizedLocations,
        routeIndices: optimizationResult.routeIndices,
        originalLocations: geocodedLocations
      }
    });

  } catch (error) {
    next(error);
  }
};
