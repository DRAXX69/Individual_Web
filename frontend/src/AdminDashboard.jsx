import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import apiService from './services/api';
import carDataService from './services/carData';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Load car data on component mount
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const allCars = await carDataService.getCars();
        setCars(allCars);
      } catch (error) {
        console.error('Error loading cars:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCars();

    // Subscribe to car data changes
    const unsubscribe = carDataService.subscribe((updatedCars) => {
      setCars(updatedCars);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    apiService.removeAuthToken();
    navigate('/');
  };

  const handleAddCar = async () => {
    try {
      const carData = {
        ...newCar,
        price: parseFloat(newCar.price)
      };
      await carDataService.addCar(carData);
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
    } catch (error) {
      console.error('Error adding car:', error);
      alert('Failed to add car. Please try again.');
    }
  };

  const handleEditCar = (car) => {
    setEditingCar({ ...car });
  };

  const handleUpdateCar = async () => {
    try {
      await carDataService.updateCar(editingCar);
      setCars(cars.map(car => 
        car.id === editingCar.id 
          ? editingCar
          : car
      ));
      setEditingCar(null);
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Failed to update car. Please try again.');
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      await carDataService.deleteCar(carId);
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Failed to delete car. Please try again.');
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      await carDataService.toggleAvailability(carId);
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update car availability. Please try again.');
    }
  };

  const toggleFeatured = async (carId) => {
    try {
      await carDataService.toggleFeatured(carId);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Failed to update car featured status. Please try again.');
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

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Cars</h3>
          <p className="stat-number">{cars.length}</p>
        </div>
        <div className="stat-card">
          <h3>Available Cars</h3>
          <p className="stat-number">{cars.filter(car => car.availability).length}</p>
        </div>
        <div className="stat-card">
          <h3>Featured Cars</h3>
          <p className="stat-number">{cars.filter(car => car.featured).length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Value</h3>
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
  );

  const renderManageCars = () => (
    <div className="manage-cars-section">
      <div className="section-header">
        <h2>Manage Cars</h2>
        <button onClick={() => setShowAddForm(true)} className="add-car-btn">
          Add New Car
        </button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading cars...</p>
        </div>
      ) : (
        <div className="cars-grid">
          {cars.map(car => (
          <div key={car.id} className="car-row">
            <img src={car.image} alt={car.name} className="car-thumbnail" />
            <div className="car-details">
              <h4>{car.name}</h4>
              <p>{car.brand} • {formatPrice(car.price)}</p>
              <p>{car.specs.horsepower} HP • {car.specs.topSpeed}</p>
            </div>
            <div className="car-status">
              <span className={`status-badge ${car.available ? 'available' : 'unavailable'}`}>
                {car.available ? 'Available' : 'Unavailable'}
              </span>
              {car.featured && <span className="featured-badge">Featured</span>}
            </div>
            <div className="car-actions">
              <button onClick={() => handleEditCar(car)} className="edit-btn">
                Edit
              </button>
              <button 
                onClick={() => toggleAvailability(car.id)} 
                className={`toggle-btn ${car.available ? 'disable' : 'enable'}`}
              >
                {car.available ? 'Disable' : 'Enable'}
              </button>
              <button 
                onClick={() => toggleFeatured(car.id)} 
                className={`feature-btn ${car.featured ? 'unfeature' : 'feature'}`}
              >
                {car.featured ? 'Unfeature' : 'Feature'}
              </button>
              <button onClick={() => handleDeleteCar(car.id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );

  const renderCarForm = (car, isEdit = false) => (
    <div className="car-form">
      <h3>{isEdit ? 'Edit Car' : 'Add New Car'}</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Car Name</label>
          <input
            type="text"
            value={car.name}
            onChange={(e) => isEdit 
              ? setEditingCar({...car, name: e.target.value})
              : setNewCar({...car, name: e.target.value})
            }
            placeholder="Enter car name"
          />
        </div>
        
        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            value={car.brand}
            onChange={(e) => isEdit 
              ? setEditingCar({...car, brand: e.target.value})
              : setNewCar({...car, brand: e.target.value})
            }
            placeholder="Enter brand"
          />
        </div>
        
        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            value={car.price}
            onChange={(e) => isEdit 
              ? setEditingCar({...car, price: e.target.value})
              : setNewCar({...car, price: e.target.value})
            }
            placeholder="Enter price"
          />
        </div>
        
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            value={car.image}
            onChange={(e) => isEdit 
              ? setEditingCar({...car, image: e.target.value})
              : setNewCar({...car, image: e.target.value})
            }
            placeholder="Enter image URL"
          />
        </div>
        
        <div className="form-group">
          <label>Engine</label>
          <input
            type="text"
            value={car.specs.engine}
            onChange={(e) => isEdit 
              ? setEditingCar({...car, specs: {...car.specs, engine: e.target.value}})
              : setNewCar({...car, specs: {...car.specs, engine: e.target.value}})
            }
            placeholder="Enter engine specs"
          />
        </div>
        
        <div className="form-group">
          <label>Horsepower</label>
          <input
            type="number"
            value={car.specs.horsepower}
            onChange={(e) => isEdit 
              ? setEditingCar({...car, specs: {...car.specs, horsepower: e.target.value}})
              : setNewCar({...car, specs: {...car.specs, horsepower: e.target.value}})
            }
            placeholder="Enter horsepower"
          />
        </div>
        
        <div className="form-group">
          <label>Top Speed</label>
          <input
            type="text"
            value={car.specs.topSpeed}
            onChange={(e) => isEdit 
              ? setEditingCar({...car, specs: {...car.specs, topSpeed: e.target.value}})
              : setNewCar({...car, specs: {...car.specs, topSpeed: e.target.value}})
            }
            placeholder="Enter top speed"
          />
        </div>
        
        <div className="form-group">
          <label>Acceleration</label>
          <input
            type="text"
            value={car.specs.acceleration}
            onChange={(e) => isEdit 
              ? setEditingCar({...car, specs: {...car.specs, acceleration: e.target.value}})
              : setNewCar({...car, specs: {...car.specs, acceleration: e.target.value}})
            }
            placeholder="Enter acceleration"
          />
        </div>
        
        <div className="form-group">
          <label>Transmission</label>
          <input
            type="text"
            value={car.specs.transmission}
            onChange={(e) => isEdit 
              ? setEditingCar({...car, specs: {...car.specs, transmission: e.target.value}})
              : setNewCar({...car, specs: {...car.specs, transmission: e.target.value}})
            }
            placeholder="Enter transmission"
          />
        </div>
        
        <div className="form-group">
          <label>Drivetrain</label>
          <input
            type="text"
            value={car.specs.drivetrain}
            onChange={(e) => isEdit 
              ? setEditingCar({...car, specs: {...car.specs, drivetrain: e.target.value}})
              : setNewCar({...car, specs: {...car.specs, drivetrain: e.target.value}})
            }
            placeholder="Enter drivetrain"
          />
        </div>
        
        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            value={car.description}
            onChange={(e) => isEdit 
              ? setEditingCar({...car, description: e.target.value})
              : setNewCar({...car, description: e.target.value})
            }
            placeholder="Enter car description"
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={car.featured}
              onChange={(e) => isEdit 
                ? setEditingCar({...car, featured: e.target.checked})
                : setNewCar({...car, featured: e.target.checked})
              }
            />
            Featured Car
          </label>
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={car.availability}
              onChange={(e) => isEdit 
                ? setEditingCar({...car, availability: e.target.checked})
                : setNewCar({...car, availability: e.target.checked})
              }
            />
            Available
          </label>
        </div>
      </div>
      
      <div className="form-actions">
        <button 
          onClick={isEdit ? handleUpdateCar : handleAddCar} 
          className="save-btn"
        >
          {isEdit ? 'Update Car' : 'Add Car'}
        </button>
        <button 
          onClick={() => isEdit ? setEditingCar(null) : setShowAddForm(false)} 
          className="cancel-btn"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container redblack-bg">
      <div className="dashboard-header">
        <h1>VIP Motors - Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="admin-tabs">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('manage')} 
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
        >
          Manage Cars
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('analytics')} 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          Analytics
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="admin-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'manage' && renderCarManagement()}
          {activeTab === 'users' && (
            <div className="users-section">
              <h3>User Management</h3>
              <p>User management functionality will be implemented here.</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <h3>Analytics Dashboard</h3>
              <p>Analytics and reporting functionality will be implemented here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Car Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content admin-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowAddForm(false)}
            >
              ×
            </button>
            {renderCarForm(newCar, false)}
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {editingCar && (
        <div className="modal-overlay" onClick={() => setEditingCar(null)}>
          <div className="modal-content admin-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setEditingCar(null)}
            >
              ×
            </button>
            {renderCarForm(editingCar, true)}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
