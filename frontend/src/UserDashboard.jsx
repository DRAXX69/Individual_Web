import { useNavigate } from 'react-router-dom';
import './App.css';

function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container redblack-bg">
      <div className="dashboard-header">
        <h1>VIP Motors - User Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card desktop-card">
          <h2>Welcome to Your Dashboard</h2>
          <div className="dashboard-grid">
            <div className="dashboard-item">
              <h3>Browse Vehicles</h3>
              <p>Explore our premium collection of vehicles</p>
              <button className="dashboard-btn">View Inventory</button>
            </div>
            
            <div className="dashboard-item">
              <h3>My Bookings</h3>
              <p>View and manage your vehicle bookings</p>
              <button className="dashboard-btn">View Bookings</button>
            </div>
            
            <div className="dashboard-item">
              <h3>Profile Settings</h3>
              <p>Update your personal information</p>
              <button className="dashboard-btn">Edit Profile</button>
            </div>
            
            <div className="dashboard-item">
              <h3>Support</h3>
              <p>Get help with your account or bookings</p>
              <button className="dashboard-btn">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
