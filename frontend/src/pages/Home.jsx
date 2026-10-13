import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Swords, Trophy, Code2, ArrowRight, Users, Target, Clock, Star } from 'lucide-react';
import './Home.css';

const stats = [
  { label: 'Problems', value: '8+', icon: <Code2 size={20} />, color: 'green' },
  { label: 'Topics', value: '12+', icon: <Target size={20} />, color: 'purple' },
  { label: 'Clash Mode', value: '1v1', icon: <Swords size={20} />, color: 'blue' },
  { label: 'Avg Time', value: '15min', icon: <Clock size={20} />, color: 'orange' },
];

const features = [
  {
    icon: <Code2 size={28} />,
    title: 'Code Editor',
    description: 'Professional Monaco editor with syntax highlighting for C++, Python, Java, and JavaScript.',
    color: 'green',
    link: '/problems',
  },
  {
    icon: <Swords size={28} />,
    title: 'Clash Rooms',
    description: 'Challenge a friend to a 1v1 coding duel. Fastest solver wins and earns rating points.',
    color: 'purple',
    link: '/clash',
  },
  {
    icon: <Trophy size={28} />,
    title: 'Leaderboard',
    description: 'Compete globally. Earn rating via ELO system and climb to the top of the ranks.',
    color: 'orange',
    link: '/leaderboard',
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home page">
      {/* Hero Section */}
      <section className="hero">
        <div className="glow-orb" style={{ width: 600, height: 600, background: '#7c3aed', top: -200, left: -100 }} />
        <div className="glow-orb" style={{ width: 400, height: 400, background: '#00d9a6', bottom: -100, right: -50 }} />

        <div className="hero-content animate-fade">
          <div className="hero-badge">
            <Zap size={14} />
            Competitive DSA Platform
          </div>
          <h1 className="hero-title">
            Clash with Friends.<br />
            <span className="text-gradient">Master DSA.</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate 1v1 coding battle arena. Solve algorithmic challenges, compete live,
            earn rating, and climb the leaderboard.
          </p>
          <div className="hero-actions">
            {user ? (
              <>
                <button className="btn btn-success btn-lg" onClick={() => navigate('/problems')}>
                  <Code2 size={20} /> Start Solving
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => navigate('/clash')}>
                  <Swords size={20} /> Create Clash <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                  Get Started Free <ArrowRight size={18} />
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {stats.map((s, i) => (
            <div className={`stat-card stat-${s.color}`} key={i}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features container">
        <div className="section-header">
          <h2>Everything you need to <span className="text-gradient">level up</span></h2>
          <p>Built for competitive programmers who want more than just practice</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className={`feature-card feature-${f.color}`} key={i} onClick={() => navigate(f.link)}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
              <div className="feature-cta">
                Explore <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works container">
        <div className="section-header">
          <h2>How <span className="text-gradient-purple">Clash</span> Works</h2>
          <p>3 simple steps to battle your friends</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Create a Room</h3>
            <p>Pick a difficulty and generate a unique room code to share with your opponent.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>Solve Together</h3>
            <p>Both players race to solve the same DSA problem in 15 minutes. Code in any language.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Earn Rating</h3>
            <p>The winner earns ELO rating points. Climb the global leaderboard and earn badges.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section container">
          <div className="cta-card">
            <div className="glow-orb" style={{ width: 300, height: 300, background: '#7c3aed', top: -50, right: 50 }} />
            <h2>Ready to Clash?</h2>
            <p>Join and start competing. It's completely free.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              <Zap size={18} /> Create Account
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
