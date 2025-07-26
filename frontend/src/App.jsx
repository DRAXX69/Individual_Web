import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

function LoginPage() {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'user') navigate('/dashboard/user');
    else navigate('/dashboard/admin');
  };

  return (
    <div className="login-container redblack-bg">
      <div className="login-card desktop-card">
        <h2>VIP Motors Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="role-toggle">
            <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}>User</button>
            <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Admin</button>
          </div>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="signup-link">
          <span>Don't have an account?</span>
          <button onClick={() => navigate(role === 'user' ? '/signup/user' : '/signup/admin')} className="signup-btn">Sign up</button>
        </div>
      </div>
    </div>
  );
}

function SignupUserPage() {
  const navigate = useNavigate();
  return (
    <div className="login-container redblack-bg">
      <div className="login-card desktop-card">
        <h2>User Registration</h2>
        <form className="login-form">
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="login-btn">Register</button>
        </form>
        <div className="signup-link">
          <button onClick={() => navigate('/')} className="signup-btn">Back to Login</button>
        </div>
      </div>
    </div>
  );
}

function SignupAdminPage() {
  const navigate = useNavigate();
  return (
    <div className="login-container redblack-bg">
      <div className="login-card desktop-card">
        <h2>Admin Registration</h2>
        <form className="login-form">
          <input type="text" placeholder="Admin Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="login-btn">Register</button>
        </form>
        <div className="signup-link">
          <button onClick={() => navigate('/')} className="signup-btn">Back to Login</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup/user" element={<SignupUserPage />} />
      <Route path="/signup/admin" element={<SignupAdminPage />} />
      <Route path="/dashboard/user" element={<UserDashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
