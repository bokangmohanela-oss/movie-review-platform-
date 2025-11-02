const express = require('express');
const router = express.Router();

// Mock restaurants data for development
const mockRestaurants = [
  {
    id: 'g9e0D-x0VJj0s3x7p5TQnw',
    name: 'Joe\'s Pizza',
    image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/7YJg_BAY-k6g6wR-aR6y7g/o.jpg',
    review_count: 4582,
    rating: 4.5,
    price: '$',
    phone: '+12123330000',
    display_phone: '(212) 333-0000',
    distance: 1200.5,
    is_closed: false,
    coordinates: { latitude: 40.73061, longitude: -73.935242 },
    location: {
      address1: '7 Carmine St',
      city: 'New York',
      state: 'NY',
      zip_code: '10014',
      country: 'US'
    },
    categories: [
      { alias: 'pizza', title: 'Pizza' }
    ]
  },
  {
    id: 'WavvLdfdP6g8aZTtbBQHTw',
    name: 'Momofuku Noodle Bar',
    image_url: 'https://s3-media1.fl.yelpcdn.com/bphoto/I4j_Xq-7N4VROvE6OgTq5A/o.jpg',
    review_count: 3215,
    rating: 4.0,
    price: '$$',
    phone: '+12125332100',
    display_phone: '(212) 533-2100',
    distance: 850.2,
    is_closed: false,
    coordinates: { latitude: 40.7315, longitude: -73.9958 },
    location: {
      address1: '171 1st Ave',
      city: 'New York',
      state: 'NY',
      zip_code: '10003',
      country: 'US'
    },
    categories: [
      { alias: 'noodles', title: 'Noodles' },
      { alias: 'ramen', title: 'Ramen' }
    ]
  },
  {
    id: 'DkYS3gLOeAghmHl-7p0MKw',
    name: 'Shake Shack',
    image_url: 'https://s3-media3.fl.yelpcdn.com/bphoto/B7bB7-2Q0bB7bB7-2Q0bB7/bphoto.jpg',
    review_count: 8921,
    rating: 4.2,
    price: '$$',
    phone: '+12125550000',
    display_phone: '(212) 555-0000',
    distance: 650.8,
    is_closed: false,
    coordinates: { latitude: 40.7415, longitude: -73.9856 },
    location: {
      address1: 'Madison Square Park',
      city: 'New York',
      state: 'NY',
      zip_code: '10010',
      country: 'US'
    },
    categories: [
      { alias: 'burgers', title: 'Burgers' },
      { alias: 'hotdogs', title: 'Fast Food' }
    ]
  }
];

// GET restaurants search
router.get('/search', async (req, res) => {
  try {
    const { location = 'New York', term = 'restaurants', limit = 20 } = req.query;
    
    console.log(`🍽️ Searching restaurants: ${term} in ${location}`);
    
    // Filter mock data based on search
    let filteredRestaurants = mockRestaurants;
    
    if (term && term !== 'restaurants') {
      filteredRestaurants = mockRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(term.toLowerCase()) ||
        restaurant.categories.some(cat => 
          cat.title.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    
    res.json({
      businesses: filteredRestaurants.slice(0, limit),
      total: filteredRestaurants.length,
      region: { center: { longitude: -73.935242, latitude: 40.73061 } }
    });

  } catch (error) {
    console.error('Restaurant search error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch restaurants',
      details: error.message
    });
  }
});

// GET restaurant details by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🍽️ Fetching restaurant details for ID: ${id}`);
    
    const restaurant = mockRestaurants.find(r => r.id === id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    res.json(restaurant);

  } catch (error) {
    console.error('Restaurant details error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch restaurant details',
      details: error.message
    });
  }
});

// GET restaurant reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🍽️ Fetching reviews for restaurant: ${id}`);
    
    // Mock reviews
    const mockYelpReviews = {
      reviews: [
        {
          id: 'xAG4O7l-t1ubbwVAlPnDKg',
          rating: 5,
          text: 'Amazing food and great service! Will definitely be back.',
          time_created: '2024-01-15 13:22:11',
          user: { name: 'Sarah M.' }
        },
        {
          id: 'yBG4O7l-t1ubbwVAlPnDKh',
          rating: 4,
          text: 'Good food but a bit pricey. Great atmosphere though.',
          time_created: '2024-01-10 10:15:33',
          user: { name: 'Mike T.' }
        }
      ]
    };
    
    res.json(mockYelpReviews);

  } catch (error) {
    console.error('Restaurant reviews error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch restaurant reviews',
      details: error.message
    });
  }
});

module.exports = router;