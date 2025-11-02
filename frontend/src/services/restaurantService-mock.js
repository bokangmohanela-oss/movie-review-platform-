// Temporary mock service until you get Yelp API key
const mockRestaurants = [
  {
    id: 'g9e0D-x0VJj0s3x7p5TQnw',
    name: 'Joe\'s Pizza',
    image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/7YJg_BAY-k6g6wR-aR6y7g/o.jpg',
    url: 'https://www.yelp.com/biz/joes-pizza-new-york',
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
  // Add more mock restaurants as needed...
];

export const restaurantService = {
  searchRestaurants: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return {
      businesses: mockRestaurants,
      total: mockRestaurants.length,
      region: { center: { longitude: -73.935242, latitude: 40.73061 } }
    };
  },
  // ... include other methods from the real service
};

export default restaurantService;