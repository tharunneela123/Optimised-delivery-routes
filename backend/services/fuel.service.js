/**
 * Calculate estimated fuel usage and cost
 * @param {number} totalDistance - Total distance in km or miles
 * @param {string} vehicleType - Type of vehicle
 * @returns {Promise<Object>} - Estimated fuel metrics
 */
export const calculateFuelCost = async (totalDistance, vehicleType = 'standard') => {
  // Mock average fuel price and consumption based on vehicle type
  const fuelPrices = {
    standard: 1.5, // $1.50 per liter/gallon
    truck: 1.8,
    electric: 0.2 // Electricity cost equivalent
  };

  const consumptionRates = {
    standard: 0.08, // 8L per 100km -> 0.08L per km
    truck: 0.25,
    electric: 0.15 // kWh per km
  };

  const pricePerUnit = fuelPrices[vehicleType] || fuelPrices['standard'];
  const consumptionRate = consumptionRates[vehicleType] || consumptionRates['standard'];

  const fuelUsed = totalDistance * consumptionRate;
  const totalCost = fuelUsed * pricePerUnit;

  return {
    totalDistance,
    vehicleType,
    fuelUsed: parseFloat(fuelUsed.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    currency: 'USD',
    unit: vehicleType === 'electric' ? 'kWh' : 'Liters'
  };
};
