import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import apiService from './services/api';

function LoginPage() {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login({ email, password });
      
      // Store the token
      apiService.setAuthToken(response.token);
      
      // Navigate based on user role from backend response
      if (response.user.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/user');
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container redblack-bg">
      <div className="login-card desktop-card">
        <h2>VIP Motors Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="role-toggle">
            <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}>User</button>
            <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Admin</button>
          </div>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            disabled={loading}
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.register({
        name,
        email,
        password,
        role: 'user'
      });
      
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container redblack-bg">
      <div className="login-card desktop-card">
        <h2>User Registration</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSignup} className="login-form">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={e => setName(e.target.value)}
            required 
            disabled={loading}
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
            disabled={loading}
            minLength="6"
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="signup-link">
          <button onClick={() => navigate('/')} className="signup-btn">Back to Login</button>
        </div>
      </div>
    </div>
  );
}

function SignupAdminPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.register({
        name,
        email,
        password,
        role: 'admin'
      });
      
      setSuccess('Admin registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container redblack-bg">
      <div className="login-card desktop-card">
        <h2>Admin Registration</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSignup} className="login-form">
          <input 
            type="text" 
            placeholder="Admin Name" 
            value={name}
            onChange={e => setName(e.target.value)}
            required 
            disabled={loading}
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
            disabled={loading}
            minLength="6"
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
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
