import api from './apiService';

// Real Yelp API service - NO MOCK DATA
export const restaurantService = {
  // Search restaurants with real Yelp data
  searchRestaurants: async (params) => {
    try {
      const response = await api.get('/restaurants/search', { params });
      return response.data;
    } catch (error) {
      console.error('Restaurant search error:', error);
      throw new Error(error.response?.data?.error || 'Failed to search restaurants');
    }
  },

  // Get restaurant details by ID
  getRestaurant: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Restaurant details error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch restaurant details');
    }
  },

  // Get restaurant reviews from Yelp
  getRestaurantReviews: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Restaurant reviews error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch restaurant reviews');
    }
  },

  // Get autocomplete suggestions
  getAutocomplete: async (text, latitude, longitude) => {
    try {
      const params = { text };
      if (latitude && longitude) {
        params.latitude = latitude;
        params.longitude = longitude;
      }
      const response = await api.get('/restaurants/search/autocomplete', { params });
      return response.data;
    } catch (error) {
      console.error('Autocomplete error:', error);
      return { terms: [], businesses: [], categories: [] };
    }
  },

  // Get all categories from Yelp
  getAllCategories: async () => {
    try {
      const response = await api.get('/restaurants/categories/all');
      return response.data;
    } catch (error) {
      console.error('Categories error:', error);
      return { categories: [] };
    }
  },

  // Popular categories for quick filtering
  popularCategories: [
    { alias: 'all', title: 'All Restaurants', icon: '🍽️' },
    { alias: 'italian', title: 'Italian', icon: '🍝' },
    { alias: 'mexican', title: 'Mexican', icon: '🌮' },
    { alias: 'chinese', title: 'Chinese', icon: '🥡' },
    { alias: 'japanese', title: 'Japanese', icon: '🍣' },
    { alias: 'indian', title: 'Indian', icon: '🍛' },
    { alias: 'thai', title: 'Thai', icon: '🍜' },
    { alias: 'korean', title: 'Korean', icon: '🥘' },
    { alias: 'vietnamese', title: 'Vietnamese', icon: '🍲' },
    { alias: 'mediterranean', title: 'Mediterranean', icon: '🥙' },
    { alias: 'french', title: 'French', icon: '🥐' },
    { alias: 'pizza', title: 'Pizza', icon: '🍕' },
    { alias: 'burgers', title: 'Burgers', icon: '🍔' },
    { alias: 'sushi', title: 'Sushi', icon: '🍣' },
    { alias: 'seafood', title: 'Seafood', icon: '🐟' },
    { alias: 'steak', title: 'Steakhouse', icon: '🥩' },
    { alias: 'bbq', title: 'BBQ', icon: '🍖' },
    { alias: 'vegetarian', title: 'Vegetarian', icon: '🥗' },
    { alias: 'vegan', title: 'Vegan', icon: '🌱' },
    { alias: 'breakfast', title: 'Breakfast', icon: '🍳' },
    { alias: 'cafe', title: 'Cafe', icon: '☕' },
    { alias: 'desserts', title: 'Desserts', icon: '🍰' }
  ],

  // Price filters
  priceFilters: [
    { value: '1', label: '$', description: 'Inexpensive' },
    { value: '2', label: '$$', description: 'Moderate' },
    { value: '3', label: '$$$', description: 'Pricey' },
    { value: '4', label: '$$$$', description: 'Ultra High-End' }
  ],

  // Sort options
  sortOptions: [
    { value: 'best_match', label: 'Best Match' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'review_count', label: 'Most Reviewed' },
    { value: 'distance', label: 'Closest' }
  ],

  // Helper functions
  getCategoryIcon: (alias) => {
    const category = restaurantService.popularCategories.find(cat => cat.alias === alias);
    return category ? category.icon : '🍽️';
  },

  getCategoryTitle: (alias) => {
    const category = restaurantService.popularCategories.find(cat => cat.alias === alias);
    return category ? category.title : alias;
  },

  formatPhoneNumber: (phone) => {
    if (!phone) return 'Phone not available';
    // Format: (123) 456-7890
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  },

  formatDistance: (meters) => {
    if (!meters) return '';
    const miles = (meters * 0.000621371).toFixed(1);
    return `${miles} mi`;
  }
};

export default restaurantService;