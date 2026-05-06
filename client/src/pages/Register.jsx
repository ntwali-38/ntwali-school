import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const districts = ['Kigali', 'Gasabo', 'Kicukiro', 'Nyarugenge', 'Bugesera', 'Rulindo', 'Gakenke', 'Musanze', 'Burera', 'Gicumbi', 'Rwamagana', 'Nyagatare', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Rubavu', 'Rutsiro', 'Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rusizi', 'Muhanga', 'Huye', 'Nyanza', 'Ruhango', 'Kamonyi', 'Rwamiko', 'Nyaruguru'];

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', school_name: '', location: '', description: '', min_fee: '', max_fee: '', programs: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name.trim()) {
      setError('Full name is required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      const registerPayload = { name: form.name, email: form.email, password: form.password, role };
      const { data } = await api.post('/auth/register', registerPayload);
      if (role === 'school') {
        await api.post('/school/profile', {
          school_name: form.school_name,
          location: form.location,
          description: form.description,
          min_fee: Number(form.min_fee || 0),
          max_fee: Number(form.max_fee || 0),
          programs: form.programs,
          contact_email: form.email,
          contact_phone: '+250',
          website: ''
        }, { headers: { Authorization: `Bearer ${data.token}` } });
      }
      setSuccess('Registration successful. Please login.');
      setTimeout(() => navigate('/login'), 700);
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="card auth-card">
        <h2>Create Account</h2>
        <div className="role-cards">
          <button type="button" className={`role-card ${role === 'user' ? 'selected' : ''}`} onClick={() => setRole('user')}>Student</button>
          <button type="button" className={`role-card ${role === 'school' ? 'selected' : ''}`} onClick={() => setRole('school')}>School</button>
        </div>
        <input className="input" placeholder="Full Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <input type="email" className="input" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        <input type="password" className="input" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
        <input type="password" className="input" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} required />
        {role === 'school' && (
          <>
            <input className="input" placeholder="School Name" value={form.school_name} onChange={(e) => setForm((p) => ({ ...p, school_name: e.target.value }))} required />
            <select className="input" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} required>
              <option value="">Select Location</option>
              {districts.map((district) => <option key={district} value={district}>{district}</option>)}
            </select>
            <textarea className="input textarea" rows="4" placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
            <input className="input" type="number" placeholder="Min Fee" value={form.min_fee} onChange={(e) => setForm((p) => ({ ...p, min_fee: e.target.value }))} />
            <input className="input" type="number" placeholder="Max Fee" value={form.max_fee} onChange={(e) => setForm((p) => ({ ...p, max_fee: e.target.value }))} />
            <input className="input" placeholder="Programs" value={form.programs} onChange={(e) => setForm((p) => ({ ...p, programs: e.target.value }))} />
          </>
        )}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button className="btn-primary" type="submit">Register</button>
        <p className="muted">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Register;
