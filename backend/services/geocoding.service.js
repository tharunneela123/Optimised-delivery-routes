import axios from 'axios';

/**
 * Geocode an address to latitude and longitude using Nominatim (OpenStreetMap)
 * @param {string} address - The address to geocode
 * @returns {Promise<Object>} - Object containing lat and lng
 */
export const getCoordinates = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1
      },
      headers: {
        // Nominatim requires a valid user agent
        'User-Agent': 'SmartRouteAI/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formattedAddress: result.display_name
      };
    } else {
      throw new Error(`Address not found: ${address}`);
    }
  } catch (error) {
    console.error(`Geocoding error for address "${address}":`, error.message);
    throw error;
  }
};
