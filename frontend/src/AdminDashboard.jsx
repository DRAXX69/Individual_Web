import { useNavigate } from 'react-router-dom';
import './App.css';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container redblack-bg">
      <div className="dashboard-header">
        <h1>VIP Motors - Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card desktop-card">
          <h2>Admin Control Panel</h2>
          <div className="dashboard-grid">
            <div className="dashboard-item">
              <h3>Manage Vehicles</h3>
              <p>Add, edit, or remove vehicles from inventory</p>
              <button className="dashboard-btn">Manage Inventory</button>
            </div>
            
            <div className="dashboard-item">
              <h3>User Management</h3>
              <p>View and manage user accounts</p>
              <button className="dashboard-btn">Manage Users</button>
            </div>
            
            <div className="dashboard-item">
              <h3>Bookings Overview</h3>
              <p>Monitor all vehicle bookings and reservations</p>
              <button className="dashboard-btn">View All Bookings</button>
            </div>
            
            <div className="dashboard-item">
              <h3>Analytics</h3>
              <p>View business metrics and reports</p>
              <button className="dashboard-btn">View Analytics</button>
            </div>
            
            <div className="dashboard-item">
              <h3>System Settings</h3>
              <p>Configure application settings</p>
              <button className="dashboard-btn">Settings</button>
            </div>
            
            <div className="dashboard-item">
              <h3>Support Tickets</h3>
              <p>Manage customer support requests</p>
              <button className="dashboard-btn">View Tickets</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
