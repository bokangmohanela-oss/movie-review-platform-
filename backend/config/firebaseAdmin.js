const admin = require('firebase-admin');

console.log('🔧 Using MOCK Firebase Admin - NO AUTHENTICATION');

// Mock Firestore for development - NO real Firebase
const mockFirestore = () => ({
  collection: (name) => ({
    add: (data) => {
      console.log('📝 Mock Firestore - Adding document:', data);
      return Promise.resolve({ id: 'mock-' + Date.now() });
    },
    doc: (id) => ({
      get: () => Promise.resolve({
        exists: true,
        data: () => ({ 
          id, 
          title: 'Mock Review', 
          type: 'movie', 
          rating: 5,
          createdAt: new Date().toISOString()
        })
      }),
      update: (data) => {
        console.log('📝 Mock Firestore - Updating document:', id, data);
        return Promise.resolve(data);
      },
      delete: () => {
        console.log('📝 Mock Firestore - Deleting document:', id);
        return Promise.resolve();
      }
    }),
    get: () => {
      console.log('📝 Mock Firestore - Getting all documents');
      return Promise.resolve({
        docs: []
      });
    },
    where: () => ({
      orderBy: () => ({
        get: () => Promise.resolve({ docs: [] })
      }),
      get: () => Promise.resolve({ docs: [] })
    }),
    orderBy: () => ({
      get: () => Promise.resolve({ docs: [] })
    })
  })
});

const mockAdmin = {
  auth: () => ({
    verifyIdToken: (token) => {
      console.log('🔐 Mock Auth - Token verification disabled');
      // Always succeed with mock user
      return Promise.resolve({ 
        uid: 'mock-user-' + Date.now(), 
        email: 'user@example.com',
        name: 'Mock User'
      });
    }
  }),
  firestore: mockFirestore
};

module.exports = { 
  admin: mockAdmin, 
  db: mockFirestore() 
};