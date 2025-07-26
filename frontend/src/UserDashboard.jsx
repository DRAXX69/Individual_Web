import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import apiService from './services/api';

function UserDashboard() {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch cars from backend on component mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
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
    fetchCars();
  }, []);

  const handleLogout = () => {
    apiService.removeAuthToken();
    navigate('/');
  };

  const addToCart = (car) => {
    const existingItem = cart.find(item => item._id === car._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === car._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...car, quantity: 1 }]);
    }
  };

  const removeFromCart = (carId) => {
    setCart(cart.filter(item => item._id !== carId));
  };

  const updateQuantity = (carId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(carId);
    } else {
      setCart(cart.map(item => 
        item._id === carId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    alert('Checkout functionality will be implemented soon!');
    setShowCheckout(false);
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="dashboard-header">
          <h1>VIP Motors - Premium Hypercars</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
        <div className="loading-message">Loading hypercars...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-dashboard">
        <div className="dashboard-header">
          <h1>VIP Motors - Premium Hypercars</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>VIP Motors - Premium Hypercars</h1>
        <div className="header-actions">
          <button 
            onClick={() => setShowCheckout(true)} 
            className="cart-btn"
            disabled={cart.length === 0}
          >
            Cart ({cart.length})
          </button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="hypercars-showcase">
        <h2>Exclusive Hypercar Collection</h2>
        <div className="hypercars-grid">
          {cars.filter(car => car.availability).map(car => (
            <div key={car._id} className="hypercar-card" onClick={() => setSelectedCar(car)}>
              <div className="card-image">
                <img src={car.image} alt={car.name} />
                {car.featured && <span className="featured-badge">Featured</span>}
              </div>
              <div className="card-content">
                <h3>{car.name}</h3>
                <p className="brand">{car.brand}</p>
                <p className="price">{formatPrice(car.price)}</p>
                <div className="specs-preview">
                  <span>{car.specs.horsepower} HP</span>
                  <span>{car.specs.topSpeed}</span>
                  <span>{car.specs.acceleration}</span>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(car);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {cars.filter(car => car.availability).length === 0 && (
          <div className="no-cars-message">
            <p>No cars available at the moment. Please check back later.</p>
          </div>
        )}
      </div>

      {/* Car Detail Modal */}
      {selectedCar && (
        <div className="modal-overlay" onClick={() => setSelectedCar(null)}>
          <div className="car-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedCar(null)}>×</button>
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedCar.image} alt={selectedCar.name} />
              </div>
              <div className="modal-details">
                <h2>{selectedCar.name}</h2>
                <p className="modal-brand">{selectedCar.brand}</p>
                <p className="modal-price">{formatPrice(selectedCar.price)}</p>
                <p className="modal-description">{selectedCar.description}</p>
                
                <div className="detailed-specs">
                  <h3>Specifications</h3>
                  <div className="specs-grid">
                    <div className="spec-item">
                      <span className="spec-label">Engine:</span>
                      <span className="spec-value">{selectedCar.specs.engine}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Horsepower:</span>
                      <span className="spec-value">{selectedCar.specs.horsepower} HP</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Top Speed:</span>
                      <span className="spec-value">{selectedCar.specs.topSpeed}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Acceleration:</span>
                      <span className="spec-value">{selectedCar.specs.acceleration}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Transmission:</span>
                      <span className="spec-value">{selectedCar.specs.transmission}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Drivetrain:</span>
                      <span className="spec-value">{selectedCar.specs.drivetrain}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="modal-add-to-cart"
                  onClick={() => {
                    addToCart(selectedCar);
                    setSelectedCar(null);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowCheckout(false)}>×</button>
            <div className="checkout-content">
              <h2>Shopping Cart</h2>
              
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item._id} className="cart-item">
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-details">
                          <h4>{item.name}</h4>
                          <p>{formatPrice(item.price)}</p>
                        </div>
                        <div className="cart-item-controls">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                          <button onClick={() => removeFromCart(item._id)} className="remove-btn">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-total">
                    <h3>Total: {formatPrice(getTotalPrice())}</h3>
                  </div>
                  
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
