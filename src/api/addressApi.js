const GEOAPIFY_API_KEY = 'd0644b6aa4b34f09a380020e438d19c0';
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v1';

export const addressApi = {
  // Search for addresses with autocomplete
  searchAddresses: async (query, limit = 5) => {
    if (!query || query.length < 3) {
      return [];
    }

    try {
      const response = await fetch(
        `${GEOAPIFY_BASE_URL}/geocode/autocomplete?text=${encodeURIComponent(query)}&limit=${limit}&apiKey=${GEOAPIFY_API_KEY}&format=json`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return data.results?.map(result => ({
        id: result.place_id,
        formatted: result.formatted,
        address: result.address_line1 || result.formatted,
        city: result.city,
        state: result.state,
        country: result.country,
        lat: result.lat,
        lon: result.lon,
      })) || [];
    } catch (error) {
      console.error('Address search failed:', error);
      return [];
    }
  },

  // Get detailed address information
  getAddressDetails: async (placeId) => {
    try {
      const response = await fetch(
        `${GEOAPIFY_BASE_URL}/geocode/details?id=${placeId}&apiKey=${GEOAPIFY_API_KEY}&format=json`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results?.[0] || null;
    } catch (error) {
      console.error('Address details fetch failed:', error);
      return null;
    }
  },

  // Reverse geocoding - get address from coordinates
  reverseGeocode: async (lat, lon) => {
    try {
      const response = await fetch(
        `${GEOAPIFY_BASE_URL}/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}&format=json`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results?.[0] || null;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    }
  },
};