const express = require('express');
const router = express.Router();

// In-memory storage for development
let mockReviews = [
  {
    id: 'mock-1',
    title: 'Amazing Movie Experience',
    content: 'This movie blew my mind! The acting was superb and the storyline was engaging from start to finish.',
    rating: 5,
    type: 'movie',
    itemId: '278',
    itemName: 'The Shawshank Redemption',
    userId: 'user1',
    userName: 'John Doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-2',
    title: 'Great Food, Average Service',
    content: 'The food was delicious but the service could be improved. Will definitely come back for the pasta!',
    rating: 3,
    type: 'restaurant',
    itemId: 'g9e0D-x0VJj0s3x7p5TQnw',
    itemName: 'Joe\'s Pizza',
    userId: 'user2',
    userName: 'Jane Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-3',
    title: 'Must Watch Masterpiece',
    content: 'One of the best movies I have ever seen. The cinematography and acting were outstanding.',
    rating: 5,
    type: 'movie',
    itemId: '238',
    itemName: 'The Godfather',
    userId: 'user3',
    userName: 'Mike Johnson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET all reviews
router.get('/', async (req, res) => {
  try {
    console.log('📝 Fetching all reviews');
    const sortedReviews = [...mockReviews].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(sortedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.json(mockReviews);
  }
});

// GET reviews by type (movie/restaurant)
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    console.log(`📝 Fetching ${type} reviews`);
    
    const filteredReviews = mockReviews.filter(review => review.type === type)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(filteredReviews);
  } catch (error) {
    console.error('Error fetching reviews by type:', error);
    res.json([]);
  }
});

// GET reviews by item ID
router.get('/item/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log(`📝 Fetching reviews for item ${itemId}`);
    
    const filteredReviews = mockReviews.filter(review => review.itemId === itemId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(filteredReviews);
  } catch (error) {
    console.error('Error fetching reviews by item:', error);
    res.json([]);
  }
});

// POST new review
router.post('/', async (req, res) => {
  try {
    const { title, content, rating, type, itemId, itemName, userId, userName } = req.body;
    
    console.log('📝 Creating review:', { title, type, itemName });

    // Validate required fields
    if (!title || !content || !rating || !type || !itemId || !itemName) {
      return res.status(400).json({ 
        error: 'Title, content, rating, type, itemId, and itemName are required'
      });
    }

    const newReview = {
      id: 'mock-' + Date.now(),
      title,
      content,
      rating: parseInt(rating),
      type,
      itemId,
      itemName,
      userId: userId || 'user-' + Date.now(),
      userName: userName || 'Anonymous User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockReviews.unshift(newReview);
    
    console.log('✅ Review created successfully:', newReview.id);
    res.status(201).json(newReview);
    
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// PUT update review
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, rating } = req.body;
    
    console.log(`📝 Updating review ${id}`);
    
    if (!title || !content || !rating) {
      return res.status(400).json({ error: 'Title, content, and rating are required' });
    }

    const reviewIndex = mockReviews.findIndex(review => review.id === id);
    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    mockReviews[reviewIndex] = {
      ...mockReviews[reviewIndex],
      title,
      content,
      rating: parseInt(rating),
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Review updated successfully:', id);
    res.json({ message: 'Review updated successfully', review: mockReviews[reviewIndex] });
    
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 Deleting review ${id}`);

    const reviewIndex = mockReviews.findIndex(review => review.id === id);
    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    const deletedReview = mockReviews.splice(reviewIndex, 1)[0];
    console.log('✅ Review deleted successfully:', id);
    res.json({ message: 'Review deleted successfully', review: deletedReview });
    
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// GET single review by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 Fetching review ${id}`);
    
    const review = mockReviews.find(review => review.id === id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

module.exports = router;