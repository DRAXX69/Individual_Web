const API_BASE_URL = 'http://localhost:5001/api';

// API service for authentication and data management
class ApiService {
  // Helper method to make API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.makeRequest('/auth/me');
  }

  // Car methods
  async getCars() {
    return this.makeRequest('/cars');
  }

  async getCarById(id) {
    return this.makeRequest(`/cars/${id}`);
  }

  async addCar(carData) {
    return this.makeRequest('/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  }

  async updateCar(id, carData) {
    return this.makeRequest(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  }

  async deleteCar(id) {
    return this.makeRequest(`/cars/${id}`, {
      method: 'DELETE',
    });
  }

  // User methods
  async getUserProfile() {
    return this.makeRequest('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async addToCart(carId, quantity = 1) {
    return this.makeRequest('/users/cart', {
      method: 'POST',
      body: JSON.stringify({ carId, quantity }),
    });
  }

  async getCart() {
    return this.makeRequest('/users/cart');
  }

  async removeFromCart(carId) {
    return this.makeRequest(`/users/cart/${carId}`, {
      method: 'DELETE',
    });
  }

  // Auth helper methods
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  isAuthenticated() {
    return !!this.getAuthToken();
  }
}

export default new ApiService();
