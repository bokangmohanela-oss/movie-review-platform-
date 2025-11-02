import api from './apiService';

// Review service - NO authentication required
export const reviewService = {
  getAllReviews: async () => {
    try {
      const response = await api.get('/reviews');
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Return mock data if API fails
      return [
        {
          id: 'mock-1',
          title: 'Sample Movie Review',
          content: 'This is a sample review for development.',
          rating: 5,
          type: 'movie',
          itemId: '123',
          itemName: 'Sample Movie',
          userId: 'user1',
          userName: 'Demo User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  },

  getReviewsByType: async (type) => {
    try {
      const response = await api.get(`/reviews/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews by type:', error);
      return [];
    }
  },

  getReviewsByItem: async (itemId) => {
    try {
      const response = await api.get(`/reviews/item/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews by item:', error);
      return [];
    }
  },

  createReview: async (reviewData) => {
    try {
      console.log('Creating review:', reviewData);
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw new Error(error.response?.data?.error || 'Failed to create review');
    }
  },

  updateReview: async (id, reviewData) => {
    try {
      const response = await api.put(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw new Error(error.response?.data?.error || 'Failed to update review');
    }
  },

  deleteReview: async (id) => {
    try {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete review');
    }
  }
};

export default reviewService;