import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import apiService from './services/api';
import carDataService from './services/carData';

function UserDashboard() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [hypercars, setHypercars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load car data on component mount
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const availableCars = await carDataService.getAvailableCars();
        setHypercars(availableCars);
      } catch (error) {
        console.error('Error loading cars:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCars();

    // Subscribe to car data changes
    const unsubscribe = carDataService.subscribe((updatedCars) => {
      const availableCars = updatedCars.filter(car => car.available);
      setHypercars(availableCars);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    apiService.removeAuthToken();
    navigate('/');
  };

  const addToCart = (car) => {
    const existingItem = cart.find(item => item.id === car.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === car.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...car, quantity: 1 }]);
    }
  };

  const removeFromCart = (carId) => {
    setCart(cart.filter(item => item.id !== carId));
  };

  const updateQuantity = (carId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(carId);
    } else {
      setCart(cart.map(item => 
        item.id === carId 
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

  // Payment handler functions
  const handleConnectIPSPayment = () => {
    // Redirect to ConnectIPS payment gateway
    const connectIPSUrl = 'https://connectips.com/';
    window.open(connectIPSUrl, '_blank');
  };

  const handleESewaPayment = () => {
    // Redirect to eSewa payment gateway
    const eSewaUrl = 'https://esewa.com.np/#/home';
    window.open(eSewaUrl, '_blank');
  };

  const renderPaymentOptions = () => (
    <div className="payment-section">
      <div className="payment-card">
        <h2>Choose Payment Method</h2>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <strong>Total: {formatPrice(getTotalPrice())}</strong>
          </div>
        </div>
        
        <div className="payment-methods">
          <h3>Select Payment Gateway</h3>
          <div className="payment-options">
            <button 
              onClick={handleConnectIPSPayment}
              className="payment-btn connectips-btn"
            >
              <div className="payment-logo connectips-logo">
                <span className="payment-logo-text">CIP</span>
              </div>
              <div className="payment-info">
                <h4>ConnectIPS</h4>
                <p>Pay securely with your bank account</p>
              </div>
            </button>
            
            <button 
              onClick={handleESewaPayment}
              className="payment-btn esewa-btn"
            >
              <div className="payment-logo esewa-logo">
                <span className="payment-logo-text">eSewa</span>
              </div>
              <div className="payment-info">
                <h4>eSewa</h4>
                <p>Digital wallet payment solution</p>
              </div>
            </button>
          </div>
        </div>
        
        <div className="payment-actions">
          <button 
            onClick={() => setShowPayment(false)}
            className="back-to-cart-btn"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container redblack-bg">
      <div className="dashboard-header">
        <h1>VIP Motors - Hypercar Collection</h1>
        <div className="header-actions">
          <button 
            onClick={() => setShowCheckout(!showCheckout)} 
            className="cart-btn"
          >
            Cart ({cart.length})
          </button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
      
      <div className="dashboard-content">
        {showPayment ? (
          renderPaymentOptions()
        ) : showCheckout ? (
          <div className="checkout-section">
            <div className="checkout-card">
              <h2>Shopping Cart</h2>
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-details">
                          <h3>{item.name}</h3>
                          <p className="cart-item-price">{formatPrice(item.price)}</p>
                          <div className="quantity-controls">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total">
                    <h3>Total: {formatPrice(getTotalPrice())}</h3>
                    <button 
                      onClick={() => setShowPayment(true)}
                      className="checkout-btn"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
              <button 
                onClick={() => setShowCheckout(false)}
                className="back-btn"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading hypercars...</p>
          </div>
        ) : (
          <div className="hypercar-grid">
            {hypercars.map(car => (
              <div key={car.id} className="hypercar-card">
                <div className="car-image-container">
                  <img src={car.image} alt={car.name} className="car-image" />
                  <div className="car-overlay">
                    <button 
                      onClick={() => setSelectedCar(car)}
                      className="view-details-btn"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div className="car-info">
                  <h3 className="car-name">{car.name}</h3>
                  <p className="car-brand">{car.brand}</p>
                  <p className="car-price">{formatPrice(car.price)}</p>
                  <div className="car-quick-specs">
                    <span>{car.specs.horsepower} HP</span>
                    <span>{car.specs.topSpeed}</span>
                    <span>{car.specs.acceleration}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(car)}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Car Details Modal */}
      {selectedCar && (
        <div className="modal-overlay" onClick={() => setSelectedCar(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedCar(null)}
            >
              ×
            </button>
            <div className="modal-body">
              <img src={selectedCar.image} alt={selectedCar.name} className="modal-image" />
              <div className="modal-details">
                <h2>{selectedCar.name}</h2>
                <p className="modal-brand">{selectedCar.brand}</p>
                <p className="modal-price">{formatPrice(selectedCar.price)}</p>
                <p className="modal-description">{selectedCar.description}</p>
                <div className="modal-specs">
                  <h3>Specifications</h3>
                  <div className="specs-grid">
                    <div className="spec-item">
                      <strong>Engine:</strong> {selectedCar.specs.engine}
                    </div>
                    <div className="spec-item">
                      <strong>Horsepower:</strong> {selectedCar.specs.horsepower} HP
                    </div>
                    <div className="spec-item">
                      <strong>Top Speed:</strong> {selectedCar.specs.topSpeed}
                    </div>
                    <div className="spec-item">
                      <strong>Acceleration:</strong> {selectedCar.specs.acceleration}
                    </div>
                    <div className="spec-item">
                      <strong>Transmission:</strong> {selectedCar.specs.transmission}
                    </div>
                    <div className="spec-item">
                      <strong>Drivetrain:</strong> {selectedCar.specs.drivetrain}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    addToCart(selectedCar);
                    setSelectedCar(null);
                  }}
                  className="modal-add-to-cart"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
