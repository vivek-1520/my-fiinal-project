import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Swords, Trophy, List, LogOut, User, Zap } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <Zap size={22} style={{ fill: 'url(#grad)', stroke: 'url(#grad)' }} />
        <svg width="0" height="0">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d9a6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        Clash of DSA
      </Link>

      <div className="nav-links">
        <button className={`nav-link ${isActive('/problems') ? 'active' : ''}`} onClick={() => navigate('/problems')}>
          <List size={15} />
          Problems
        </button>
        <button className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`} onClick={() => navigate('/leaderboard')}>
          <Trophy size={15} />
          Leaderboard
        </button>
        <button className={`nav-link ${isActive('/clash') ? 'active' : ''}`} onClick={() => navigate('/clash')}>
          <Swords size={15} />
          Clash
        </button>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <div className="nav-user" onClick={() => navigate('/profile')}>
              <div className="avatar avatar-sm">{user.username?.[0]?.toUpperCase()}</div>
              <div className="nav-user-info">
                <span className="nav-username">{user.username}</span>
                <span className="nav-rating">⚡ {user.rating}</span>
              </div>
            </div>
            <button className="btn btn-outline btn-sm btn-icon" onClick={handleLogout} title="Logout">
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}
