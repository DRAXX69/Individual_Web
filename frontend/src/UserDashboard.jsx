import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import apiService from './services/api';

function UserDashboard() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Sample hypercar data
  const hypercars = [
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
      description: "The Koenigsegg Jesko is a track-focused hypercar with revolutionary aerodynamics and unmatched performance."
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
      description: "The ultimate expression of Bugatti's engineering prowess, combining luxury with extreme performance."
    },
    {
      id: 3,
      name: "McLaren Speedtail",
      brand: "McLaren",
      price: 2250000,
      image: "/speedtail.jpg",
      specs: {
        engine: "4.0L Twin-Turbo V8 Hybrid",
        horsepower: 1035,
        topSpeed: "250 mph",
        acceleration: "0-60 mph in 2.5s",
        transmission: "7-speed Dual-clutch",
        drivetrain: "RWD"
      },
      description: "A hyper-GT that redefines automotive design with its teardrop silhouette and hybrid powertrain."
    },
    {
      id: 4,
      name: "Pagani Huayra BC",
      brand: "Pagani",
      price: 2800000,
      image: "/huayra.jpg",
      specs: {
        engine: "6.0L Twin-Turbo V12",
        horsepower: 789,
        topSpeed: "238 mph",
        acceleration: "0-60 mph in 2.8s",
        transmission: "7-speed Sequential",
        drivetrain: "RWD"
      },
      description: "Italian artistry meets extreme performance in this carbon fiber masterpiece."
    },
    {
      id: 5,
      name: "Rimac Nevera",
      brand: "Rimac",
      price: 2400000,
      image: "/nevera.jpg",
      specs: {
        engine: "Quad Electric Motors",
        horsepower: 1914,
        topSpeed: "258 mph",
        acceleration: "0-60 mph in 1.85s",
        transmission: "Single-speed",
        drivetrain: "AWD"
      },
      description: "The world's fastest electric hypercar, showcasing the future of automotive performance."
    },
    {
      id: 6,
      name: "Ferrari LaFerrari Aperta",
      brand: "Ferrari",
      price: 2200000,
      image: "/laferrari.jpg",
      specs: {
        engine: "6.3L V12 Hybrid",
        horsepower: 950,
        topSpeed: "217 mph",
        acceleration: "0-60 mph in 2.6s",
        transmission: "7-speed Dual-clutch",
        drivetrain: "RWD"
      },
      description: "The open-top version of Ferrari's flagship hypercar, combining F1 technology with pure emotion."
    }
  ];

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
        {showCheckout ? (
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
                    <button className="checkout-btn">Proceed to Checkout</button>
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
        ) : (
          <div className="hypercars-grid">
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
