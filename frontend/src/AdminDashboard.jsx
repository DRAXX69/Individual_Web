import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import apiService from './services/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({ totalUsers: 0, recentUsers: 0 });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [cars, setCars] = useState([
    {
      id: 1,
      name: "Koenigsegg Jesko",
      brand: "Koenigsegg",
      price: 3000000,
      image: "/jesko.jpg",
      specs: {
        engine: "5.0L Twin-Turbo V8",
        horsepower: 1600,
        topSpeed: "330 mph",
        acceleration: "0-60 mph in 2.5s",
        transmission: "9-speed Multi-clutch",
        drivetrain: "RWD"
      },
      description: "The Koenigsegg Jesko is a track-focused hypercar with revolutionary aerodynamics and unmatched performance.",
      featured: true,
      availability: true
    },
    {
      id: 2,
      name: "Bugatti Chiron Super Sport",
      brand: "Bugatti",
      price: 3900000,
      image: "/chiron.jpg",
      specs: {
        engine: "8.0L Quad-Turbo W16",
        horsepower: 1577,
        topSpeed: "304 mph",
        acceleration: "0-60 mph in 2.4s",
        transmission: "7-speed Dual-clutch",
        drivetrain: "AWD"
      },
      description: "The ultimate expression of Bugatti's engineering prowess, combining luxury with extreme performance.",
      featured: true,
      availability: true
    }
  ]);
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

  const handleLogout = () => {
    apiService.removeAuthToken();
    navigate('/');
  };

  // Fetch users when Users tab is selected
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const [usersData, statsData] = await Promise.all([
        apiService.getAllUsers(),
        apiService.getUserStats()
      ]);
      setUsers(usersData);
      setUserStats(statsData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch users when users tab is activated
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') {
      fetchUsers();
    }
  };

  const handleAddCar = () => {
    const carToAdd = {
      ...newCar,
      id: Date.now(),
      price: parseFloat(newCar.price),
      specs: {
        ...newCar.specs,
        horsepower: parseInt(newCar.specs.horsepower)
      }
    };
    setCars([...cars, carToAdd]);
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
  };

  const handleEditCar = (car) => {
    setEditingCar({ ...car });
  };

  const handleUpdateCar = () => {
    setCars(cars.map(car => 
      car.id === editingCar.id 
        ? {
            ...editingCar,
            price: parseFloat(editingCar.price),
            specs: {
              ...editingCar.specs,
              horsepower: parseInt(editingCar.specs.horsepower)
            }
          }
        : car
    ));
    setEditingCar(null);
  };

  const handleDeleteCar = (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      setCars(cars.filter(car => car.id !== carId));
    }
  };

  const toggleCarAvailability = (carId) => {
    setCars(cars.map(car => 
      car.id === carId 
        ? { ...car, availability: !car.availability }
        : car
    ));
  };

  const toggleCarFeatured = (carId) => {
    setCars(cars.map(car => 
      car.id === carId 
        ? { ...car, featured: !car.featured }
        : car
    ));
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
          <h3>Total Users</h3>
          <p className="stat-number">{userStats.totalUsers}</p>
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

  const renderUserManagement = () => (
    <div className="users-section">
      <div className="users-header">
        <h3>User Management</h3>
        <div className="user-stats">
          <div className="user-stat">
            <span className="stat-label">Total Users:</span>
            <span className="stat-value">{userStats.totalUsers}</span>
          </div>
          <div className="user-stat">
            <span className="stat-label">New Users (30 days):</span>
            <span className="stat-value">{userStats.recentUsers}</span>
          </div>
        </div>
      </div>
      
      {loadingUsers ? (
        <div className="loading-users">
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registration Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-users">
                    No users registered yet
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id}>
                    <td className="user-name">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td className="user-phone">{user.phone || 'N/A'}</td>
                    <td className="user-date">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="user-status">
                      <span className="status-badge active">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderCarManagement = () => (
    <div className="car-management">
      <div className="management-header">
        <h3>Car Inventory Management</h3>
        <button onClick={() => setShowAddForm(true)} className="add-car-btn">
          + Add New Car
        </button>
      </div>
      
      <div className="cars-table">
        {cars.map(car => (
          <div key={car.id} className="car-row">
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
                onClick={() => toggleCarAvailability(car.id)} 
                className={`toggle-btn ${car.availability ? 'disable' : 'enable'}`}
              >
                {car.availability ? 'Disable' : 'Enable'}
              </button>
              <button 
                onClick={() => toggleCarFeatured(car.id)} 
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
          onClick={() => handleTabChange('overview')} 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Overview
        </button>
        <button 
          onClick={() => handleTabChange('manage')} 
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
        >
          Manage Cars
        </button>
        <button 
          onClick={() => handleTabChange('users')} 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          Users
        </button>
        <button 
          onClick={() => handleTabChange('analytics')} 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          Analytics
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="admin-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'manage' && renderCarManagement()}
          {activeTab === 'users' && renderUserManagement()}
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
