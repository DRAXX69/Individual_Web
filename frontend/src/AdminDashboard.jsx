import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import apiService from './services/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCar, setNewCar] = useState({
    name: '',
    brand: '',
    price: '',
    image: '',
    specs: {
      engine: '',
      horsepower: '',
      topSpeed: '',
      acceleration: '',
      transmission: '',
      drivetrain: ''
    },
    description: '',
    featured: false,
    availability: true
  });

  // Fetch cars from backend on component mount
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const carsData = await apiService.getCars();
      setCars(carsData);
      setError('');
    } catch (error) {
      setError('Failed to fetch cars: ' + error.message);
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.removeAuthToken();
    navigate('/');
  };

  const handleAddCar = async () => {
    try {
      setLoading(true);
      const carToAdd = {
        ...newCar,
        price: parseFloat(newCar.price),
        specs: {
          ...newCar.specs,
          horsepower: parseInt(newCar.specs.horsepower)
        }
      };
      
      await apiService.addCar(carToAdd);
      await fetchCars(); // Refresh the cars list
      
      setNewCar({
        name: '',
        brand: '',
        price: '',
        image: '',
        specs: {
          engine: '',
          horsepower: '',
          topSpeed: '',
          acceleration: '',
          transmission: '',
          drivetrain: ''
        },
        description: '',
        featured: false,
        availability: true
      });
      setShowAddForm(false);
      setError('');
    } catch (error) {
      setError('Failed to add car: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCar = (car) => {
    setEditingCar({ ...car });
  };

  const handleUpdateCar = async () => {
    try {
      setLoading(true);
      const carToUpdate = {
        ...editingCar,
        price: parseFloat(editingCar.price),
        specs: {
          ...editingCar.specs,
          horsepower: parseInt(editingCar.specs.horsepower)
        }
      };
      
      await apiService.updateCar(editingCar._id, carToUpdate);
      await fetchCars(); // Refresh the cars list
      setEditingCar(null);
      setError('');
    } catch (error) {
      setError('Failed to update car: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        setLoading(true);
        await apiService.deleteCar(carId);
        await fetchCars(); // Refresh the cars list
        setError('');
      } catch (error) {
        setError('Failed to delete car: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleCarAvailability = async (carId) => {
    try {
      const car = cars.find(c => c._id === carId);
      const updatedCar = { ...car, availability: !car.availability };
      await apiService.updateCar(carId, updatedCar);
      await fetchCars(); // Refresh the cars list
      setError('');
    } catch (error) {
      setError('Failed to update car availability: ' + error.message);
    }
  };

  const toggleCarFeatured = async (carId) => {
    try {
      const car = cars.find(c => c._id === carId);
      const updatedCar = { ...car, featured: !car.featured };
      await apiService.updateCar(carId, updatedCar);
      await fetchCars(); // Refresh the cars list
      setError('');
    } catch (error) {
      setError('Failed to update car featured status: ' + error.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>VIP Motors Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Cars
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h3>Dashboard Overview</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Cars</h4>
                <p className="stat-number">{cars.length}</p>
              </div>
              <div className="stat-card">
                <h4>Available Cars</h4>
                <p className="stat-number">{cars.filter(car => car.availability).length}</p>
              </div>
              <div className="stat-card">
                <h4>Featured Cars</h4>
                <p className="stat-number">{cars.filter(car => car.featured).length}</p>
              </div>
              <div className="stat-card">
                <h4>Total Value</h4>
                <p className="stat-number">{formatPrice(cars.reduce((sum, car) => sum + car.price, 0))}</p>
              </div>
            </div>
            
            <div className="recent-activity">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={() => setActiveTab('manage')} className="action-btn">
                  Manage Cars
                </button>
                <button onClick={() => setShowAddForm(true)} className="action-btn">
                  Add New Car
                </button>
                <button onClick={() => setActiveTab('users')} className="action-btn">
                  View Users
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'manage' && (
          <div className="car-management">
            <div className="management-header">
              <h3>Car Inventory Management</h3>
              <button onClick={() => setShowAddForm(true)} className="add-car-btn">
                + Add New Car
              </button>
            </div>
            
            <div className="cars-table">
              {cars.map(car => (
                <div key={car._id} className="car-row">
                  <img src={car.image} alt={car.name} className="car-thumbnail" />
                  <div className="car-details">
                    <h4>{car.name}</h4>
                    <p>{car.brand} • {formatPrice(car.price)}</p>
                    <p>{car.specs.horsepower} HP • {car.specs.topSpeed}</p>
                  </div>
                  <div className="car-status">
                    <span className={`status-badge ${car.availability ? 'available' : 'unavailable'}`}>
                      {car.availability ? 'Available' : 'Unavailable'}
                    </span>
                    {car.featured && <span className="featured-badge">Featured</span>}
                  </div>
                  <div className="car-actions">
                    <button onClick={() => handleEditCar(car)} className="edit-btn">
                      Edit
                    </button>
                    <button 
                      onClick={() => toggleCarAvailability(car._id)} 
                      className={`toggle-btn ${car.availability ? 'disable' : 'enable'}`}
                    >
                      {car.availability ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      onClick={() => toggleCarFeatured(car._id)} 
                      className={`feature-btn ${car.featured ? 'unfeature' : 'feature'}`}
                    >
                      {car.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button onClick={() => handleDeleteCar(car._id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="users-section">
            <h3>User Management</h3>
            <p>User management features coming soon...</p>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h3>Analytics</h3>
            <p>Analytics dashboard coming soon...</p>
          </div>
        )}
      </div>
      
      {/* Add Car Form */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="add-car-modal">
            <h3>Add New Car</h3>
            <div className="car-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Car Name"
                  value={newCar.name}
                  onChange={(e) => setNewCar({...newCar, name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Brand"
                  value={newCar.brand}
                  onChange={(e) => setNewCar({...newCar, brand: e.target.value})}
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Price"
                  value={newCar.price}
                  onChange={(e) => setNewCar({...newCar, price: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newCar.image}
                  onChange={(e) => setNewCar({...newCar, image: e.target.value})}
                />
              </div>
              <textarea
                placeholder="Description"
                value={newCar.description}
                onChange={(e) => setNewCar({...newCar, description: e.target.value})}
              />
              
              <h4>Specifications</h4>
              <div className="specs-grid">
                <input
                  type="text"
                  placeholder="Engine"
                  value={newCar.specs.engine}
                  onChange={(e) => setNewCar({...newCar, specs: {...newCar.specs, engine: e.target.value}})}
                />
                <input
                  type="number"
                  placeholder="Horsepower"
                  value={newCar.specs.horsepower}
                  onChange={(e) => setNewCar({...newCar, specs: {...newCar.specs, horsepower: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Top Speed"
                  value={newCar.specs.topSpeed}
                  onChange={(e) => setNewCar({...newCar, specs: {...newCar.specs, topSpeed: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="0-60 mph"
                  value={newCar.specs.acceleration}
                  onChange={(e) => setNewCar({...newCar, specs: {...newCar.specs, acceleration: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Transmission"
                  value={newCar.specs.transmission}
                  onChange={(e) => setNewCar({...newCar, specs: {...newCar.specs, transmission: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Drivetrain"
                  value={newCar.specs.drivetrain}
                  onChange={(e) => setNewCar({...newCar, specs: {...newCar.specs, drivetrain: e.target.value}})}
                />
              </div>
              
              <div className="form-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={newCar.featured}
                    onChange={(e) => setNewCar({...newCar, featured: e.target.checked})}
                  />
                  Featured Car
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={newCar.availability}
                    onChange={(e) => setNewCar({...newCar, availability: e.target.checked})}
                  />
                  Available
                </label>
              </div>
              
              <div className="form-actions">
                <button onClick={handleAddCar} className="save-btn">Add Car</button>
                <button onClick={() => setShowAddForm(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Car Form */}
      {editingCar && (
        <div className="modal-overlay">
          <div className="edit-car-modal">
            <h3>Edit Car</h3>
            <div className="car-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Car Name"
                  value={editingCar.name}
                  onChange={(e) => setEditingCar({...editingCar, name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Brand"
                  value={editingCar.brand}
                  onChange={(e) => setEditingCar({...editingCar, brand: e.target.value})}
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Price"
                  value={editingCar.price}
                  onChange={(e) => setEditingCar({...editingCar, price: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={editingCar.image}
                  onChange={(e) => setEditingCar({...editingCar, image: e.target.value})}
                />
              </div>
              <textarea
                placeholder="Description"
                value={editingCar.description}
                onChange={(e) => setEditingCar({...editingCar, description: e.target.value})}
              />
              
              <h4>Specifications</h4>
              <div className="specs-grid">
                <input
                  type="text"
                  placeholder="Engine"
                  value={editingCar.specs.engine}
                  onChange={(e) => setEditingCar({...editingCar, specs: {...editingCar.specs, engine: e.target.value}})}
                />
                <input
                  type="number"
                  placeholder="Horsepower"
                  value={editingCar.specs.horsepower}
                  onChange={(e) => setEditingCar({...editingCar, specs: {...editingCar.specs, horsepower: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Top Speed"
                  value={editingCar.specs.topSpeed}
                  onChange={(e) => setEditingCar({...editingCar, specs: {...editingCar.specs, topSpeed: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="0-60 mph"
                  value={editingCar.specs.acceleration}
                  onChange={(e) => setEditingCar({...editingCar, specs: {...editingCar.specs, acceleration: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Transmission"
                  value={editingCar.specs.transmission}
                  onChange={(e) => setEditingCar({...editingCar, specs: {...editingCar.specs, transmission: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Drivetrain"
                  value={editingCar.specs.drivetrain}
                  onChange={(e) => setEditingCar({...editingCar, specs: {...editingCar.specs, drivetrain: e.target.value}})}
                />
              </div>
              
              <div className="form-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={editingCar.featured}
                    onChange={(e) => setEditingCar({...editingCar, featured: e.target.checked})}
                  />
                  Featured Car
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={editingCar.availability}
                    onChange={(e) => setEditingCar({...editingCar, availability: e.target.checked})}
                  />
                  Available
                </label>
              </div>
              
              <div className="form-actions">
                <button onClick={handleUpdateCar} className="save-btn">Update Car</button>
                <button onClick={() => setEditingCar(null)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
