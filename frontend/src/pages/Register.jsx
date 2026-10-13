import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome, ${res.data.user.username}! Let's code! ⚡`);
      navigate('/problems');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page page">
      <div className="auth-bg-orb auth-orb-1" />
      <div className="auth-bg-orb auth-orb-2" />

      <div className="auth-card card card-glass animate-fade">
        <div className="auth-logo">
          <Zap size={28} style={{ color: 'var(--accent-green)' }} />
          <span>Clash of DSA</span>
        </div>
        <h2 className="auth-title">Join the Arena</h2>
        <p className="text-secondary auth-sub">Create your account and start competing</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <div className="input-icon-wrap">
              <User size={16} className="input-icon" />
              <input
                className="input"
                type="text"
                placeholder="YourUsername"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                minLength={3}
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>
          <div className="input-group">
            <label>Email</label>
            <div className="input-icon-wrap">
              <Mail size={16} className="input-icon" />
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input
                className="input"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingLeft: 40, paddingRight: 40 }}
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="password-strength">
            {['Length 6+', 'Letters', 'Numbers'].map((req, i) => (
              <span key={i} className={`req-tag ${(i === 0 && form.password.length >= 6) || (i === 1 && /[a-zA-Z]/.test(form.password)) || (i === 2 && /\d/.test(form.password)) ? 'req-met' : ''}`}>
                {req}
              </span>
            ))}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? <span className="spinner" /> : <Zap size={16} />}
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
