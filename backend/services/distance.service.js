import axios from 'axios';

/**
 * Calculate a distance matrix for an array of locations using OSRM
 * @param {Array<Object>} locations - Array of {lat, lng} objects
 * @returns {Promise<Array<Array<Object>>>} - 2D array of { distance, duration }
 */
export const getDistanceMatrix = async (locations) => {
  try {
    // OSRM format requires lon,lat separated by semicolons
    const coordinatesString = locations.map(loc => `${loc.lng},${loc.lat}`).join(';');
    
    // Call the public OSRM router
    const response = await axios.get(`http://router.project-osrm.org/table/v1/driving/${coordinatesString}`, {
      params: {
        annotations: 'distance,duration'
      }
    });

    if (response.data.code !== 'Ok') {
      throw new Error(`OSRM API error: ${response.data.code}`);
    }

    const { distances, durations } = response.data;

    // Convert OSRM response to our required format: 2D array of { distance, duration }
    const matrix = [];
    for (let i = 0; i < locations.length; i++) {
      const row = [];
      for (let j = 0; j < locations.length; j++) {
        row.push({
          distance: distances[i][j] / 1000, // OSRM returns meters, convert to kilometers
          duration: durations[i][j] / 60    // OSRM returns seconds, convert to minutes
        });
      }
      matrix.push(row);
    }
    
    return matrix;
  } catch (error) {
    console.error('Distance Matrix calculation error:', error.message);
    throw error;
  }
};
