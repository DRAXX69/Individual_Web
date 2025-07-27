// Shared car data service for both user and admin dashboards
import apiService from './api';

// Initial hypercar data (fallback if backend is unavailable)
const defaultHypercars = [
  {
    id: 1,
    name: "Bugatti Chiron",
    price: 3000000,
    image: "https://images.unsplash.com/photo-1544829099-b9a0c5303bea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    specs: {
      engine: "8.0L Quad-Turbo W16",
      horsepower: "1,479 HP",
      torque: "1,180 lb-ft",
      topSpeed: "261 mph",
      acceleration: "0-60 mph in 2.3s",
      transmission: "7-Speed DSG",
      drivetrain: "AWD"
    },
    featured: true,
    available: true
  },
  {
    id: 2,
    name: "McLaren P1",
    price: 1150000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    specs: {
      engine: "3.8L Twin-Turbo V8 + Electric",
      horsepower: "903 HP",
      torque: "664 lb-ft",
      topSpeed: "217 mph",
      acceleration: "0-60 mph in 2.8s",
      transmission: "7-Speed DCT",
      drivetrain: "RWD"
    },
    featured: true,
    available: true
  },
  {
    id: 3,
    name: "Koenigsegg Regera",
    price: 1900000,
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    specs: {
      engine: "5.0L Twin-Turbo V8 + Electric",
      horsepower: "1,500 HP",
      torque: "1,280 lb-ft",
      topSpeed: "251 mph",
      acceleration: "0-60 mph in 2.8s",
      transmission: "Direct Drive",
      drivetrain: "RWD"
    },
    featured: true,
    available: true
  },
  {
    id: 4,
    name: "Pagani Huayra",
    price: 2800000,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    specs: {
      engine: "6.0L Twin-Turbo V12",
      horsepower: "730 HP",
      torque: "738 lb-ft",
      topSpeed: "238 mph",
      acceleration: "0-60 mph in 3.2s",
      transmission: "7-Speed AMT",
      drivetrain: "RWD"
    },
    featured: true,
    available: true
  },
  {
    id: 5,
    name: "Ferrari LaFerrari",
    price: 1400000,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    specs: {
      engine: "6.3L V12 + Electric",
      horsepower: "950 HP",
      torque: "664 lb-ft",
      topSpeed: "217 mph",
      acceleration: "0-60 mph in 2.4s",
      transmission: "7-Speed DCT",
      drivetrain: "RWD"
    },
    featured: true,
    available: true
  },
  {
    id: 6,
    name: "Lamborghini Revuelto",
    price: 500000,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    specs: {
      engine: "6.5L V12 + Electric",
      horsepower: "1,001 HP",
      torque: "535 lb-ft",
      topSpeed: "217 mph",
      acceleration: "0-60 mph in 2.5s",
      transmission: "8-Speed DCT",
      drivetrain: "AWD"
    },
    featured: true,
    available: true
  }
];

class CarDataService {
  constructor() {
    this.cars = [...defaultHypercars];
    this.listeners = [];
  }

  // Subscribe to car data changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners of changes
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.cars));
  }

  // Get all cars
  async getCars() {
    try {
      const response = await apiService.getCars();
      if (response && response.length > 0) {
        this.cars = response;
      }
    } catch (error) {
      console.log('Using default car data - backend unavailable');
      // Use default data if backend is unavailable
    }
    return [...this.cars];
  }

  // Get available cars for user dashboard
  async getAvailableCars() {
    const allCars = await this.getCars();
    return allCars.filter(car => car.available);
  }

  // Add new car (admin only)
  async addCar(carData) {
    try {
      const newCar = await apiService.addCar(carData);
      this.cars.push(newCar);
      this.notifyListeners();
      return newCar;
    } catch (error) {
      // Fallback: add to local data with generated ID
      const newCar = {
        ...carData,
        id: Math.max(...this.cars.map(c => c.id)) + 1,
        available: true,
        featured: false
      };
      this.cars.push(newCar);
      this.notifyListeners();
      return newCar;
    }
  }

  // Update car (admin only)
  async updateCar(carId, carData) {
    try {
      const updatedCar = await apiService.updateCar(carId, carData);
      const index = this.cars.findIndex(car => car.id === carId);
      if (index !== -1) {
        this.cars[index] = updatedCar;
        this.notifyListeners();
      }
      return updatedCar;
    } catch (error) {
      // Fallback: update local data
      const index = this.cars.findIndex(car => car.id === carId);
      if (index !== -1) {
        this.cars[index] = { ...this.cars[index], ...carData };
        this.notifyListeners();
        return this.cars[index];
      }
      throw error;
    }
  }

  // Delete car (admin only)
  async deleteCar(carId) {
    try {
      await apiService.deleteCar(carId);
      this.cars = this.cars.filter(car => car.id !== carId);
      this.notifyListeners();
    } catch (error) {
      // Fallback: remove from local data
      this.cars = this.cars.filter(car => car.id !== carId);
      this.notifyListeners();
    }
  }

  // Toggle car availability
  async toggleAvailability(carId) {
    const car = this.cars.find(c => c.id === carId);
    if (car) {
      return await this.updateCar(carId, { available: !car.available });
    }
  }

  // Toggle featured status
  async toggleFeatured(carId) {
    const car = this.cars.find(c => c.id === carId);
    if (car) {
      return await this.updateCar(carId, { featured: !car.featured });
    }
  }
}

// Create singleton instance
const carDataService = new CarDataService();

export default carDataService;
