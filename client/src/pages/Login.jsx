import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (token) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      const tokenPayload = data.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(tokenPayload));
      const user = { ...data.user, role: payload.role || data.user.role };
      if (user.role === 'admin') navigate('/admin-dashboard');
      else if (user.role === 'school') navigate('/school-dashboard');
      else navigate('/student-dashboard');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) setError('Invalid email or password');
      else if (status === 403) setError('Account suspended');
      else if (status === 500) setError('Server error, please try again');
      else setError('Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="card auth-card">
        <p className="logo-text">School Connect Rwanda</p>
        <h2>Login</h2>
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        <div className="password-wrap">
          <input className="input" placeholder="Password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          <button type="button" className="ghost-btn" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Hide' : 'Show'}</button>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-primary full" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
        <p className="muted">Do not have an account? <Link to="/register">Register</Link></p>
        <p className="muted"><Link to="/register">Register your school</Link></p>
      </form>
    </div>
  );
}

export default Login;
