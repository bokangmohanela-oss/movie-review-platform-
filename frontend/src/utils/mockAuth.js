// Mock authentication service for development
class MockAuth {
  constructor() {
    this.currentUser = null;
    this.users = new Map(); // Simple in-memory user storage
    this.authCallback = null;
  }

  onAuthStateChanged(callback) {
    this.authCallback = callback;
    // Initial call with null user
    callback(this.currentUser);
    return () => {}; // unsubscribe function
  }

  async signInWithEmailAndPassword(email, password) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    // Check if user exists
    const user = this.users.get(email);
    if (user && user.password === password) {
      this.currentUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.name,
        getIdToken: async () => 'mock-token-' + Date.now()
      };
      if (this.authCallback) this.authCallback(this.currentUser);
      return { user: this.currentUser };
    } else {
      throw new Error('Invalid email or password');
    }
  }

  async createUserWithEmailAndPassword(email, password, name) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    // Check if user already exists
    if (this.users.has(email)) {
      throw new Error('Email already exists');
    }

    // Create new user
    const user = {
      uid: 'mock-user-' + Date.now(),
      email,
      password, // In real app, never store passwords like this!
      name: name || email.split('@')[0]
    };

    this.users.set(email, user);
    
    this.currentUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.name,
      getIdToken: async () => 'mock-token-' + Date.now()
    };
    
    if (this.authCallback) this.authCallback(this.currentUser);
    return { user: this.currentUser };
  }

  async signOut() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentUser = null;
    if (this.authCallback) this.authCallback(null);
    return Promise.resolve();
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }
}

export const mockAuth = new MockAuth();