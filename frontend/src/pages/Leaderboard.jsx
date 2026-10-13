import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Zap, Target, Swords, Crown, Medal, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Leaderboard.css';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('rating');
  const { user } = useAuth();

  useEffect(() => { fetchLeaderboard(); }, [type]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/leaderboard?type=${type}&limit=50`);
      setUsers(res.data);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={20} style={{ color: '#FFD700' }} />;
    if (rank === 2) return <Medal size={20} style={{ color: '#C0C0C0' }} />;
    if (rank === 3) return <Medal size={20} style={{ color: '#CD7F32' }} />;
    return <span className="rank-num">#{rank}</span>;
  };

  const getRatingClass = (rating) => {
    if (rating >= 2000) return 'rating-legend';
    if (rating >= 1700) return 'rating-expert';
    if (rating >= 1400) return 'rating-specialist';
    return 'rating-newbie';
  };

  const myRank = users.findIndex((u) => u.username === user?.username) + 1;

  return (
    <div className="leaderboard-page page">
      <div className="container">
        <div className="lb-header">
          <div>
            <h1><Trophy size={28} style={{ color: '#FFD700', verticalAlign: 'middle', marginRight: 10 }} />Leaderboard</h1>
            <p className="text-secondary">Top coders ranked by {type === 'rating' ? 'ELO rating' : 'problems solved'}</p>
          </div>
          {user && myRank > 0 && (
            <div className="my-rank-card">
              <span className="text-secondary">Your Rank</span>
              <span className="my-rank">#{myRank}</span>
            </div>
          )}
        </div>

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div className="podium">
            {/* 2nd */}
            <div className="podium-slot podium-2">
              <div className="avatar avatar-lg">{users[1].username[0].toUpperCase()}</div>
              <div className="podium-name">{users[1].username}</div>
              <div className="podium-val">
                {type === 'rating' ? `⚡ ${users[1].rating}` : `✅ ${users[1].totalSolved}`}
              </div>
              <div className="podium-bar bar-2">2nd</div>
            </div>
            {/* 1st */}
            <div className="podium-slot podium-1">
              <Crown size={28} style={{ color: '#FFD700', marginBottom: 8 }} />
              <div className="avatar avatar-lg" style={{ border: '2px solid #FFD700' }}>{users[0].username[0].toUpperCase()}</div>
              <div className="podium-name">{users[0].username}</div>
              <div className="podium-val">
                {type === 'rating' ? `⚡ ${users[0].rating}` : `✅ ${users[0].totalSolved}`}
              </div>
              <div className="podium-bar bar-1">1st</div>
            </div>
            {/* 3rd */}
            <div className="podium-slot podium-3">
              <div className="avatar avatar-lg">{users[2].username[0].toUpperCase()}</div>
              <div className="podium-name">{users[2].username}</div>
              <div className="podium-val">
                {type === 'rating' ? `⚡ ${users[2].rating}` : `✅ ${users[2].totalSolved}`}
              </div>
              <div className="podium-bar bar-3">3rd</div>
            </div>
          </div>
        )}

        {/* Toggle */}
        <div className="lb-tabs">
          <button className={`tab ${type === 'rating' ? 'active' : ''}`} onClick={() => setType('rating')}>
            <Zap size={15} /> Rating
          </button>
          <button className={`tab ${type === 'solved' ? 'active' : ''}`} onClick={() => setType('solved')}>
            <Target size={15} /> Problems Solved
          </button>
        </div>

        {/* Table */}
        <div className="lb-table card">
          <div className="lb-table-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Rating</span>
            <span>Solved</span>
            <span>Clashes</span>
            <span>Win Rate</span>
          </div>

          {loading ? (
            <div className="loading-state">{[...Array(8)].map((_, i) => <div key={i} className="skeleton-row" />)}</div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <Trophy size={48} className="text-muted" />
              <p>No users yet. Register to be #1!</p>
            </div>
          ) : (
            users.map((u, i) => {
              const isMe = u.username === user?.username;
              const winRate = u.clashesPlayed > 0 ? Math.round((u.clashesWon / u.clashesPlayed) * 100) : 0;
              return (
                <div key={u._id} className={`lb-row ${isMe ? 'lb-row-me' : ''}`}>
                  <span className="lb-rank">{getRankIcon(i + 1)}</span>
                  <span className="lb-player">
                    <div className={`avatar avatar-sm ${isMe ? 'avatar-me' : ''}`}>{u.username[0].toUpperCase()}</div>
                    <div className="lb-player-info">
                      <span className="lb-username">{u.username} {isMe && <span className="you-tag">You</span>}</span>
                      <span className={`lb-rating-label ${getRatingClass(u.rating)}`}>
                        {getRatingLabel(u.rating)}
                      </span>
                    </div>
                  </span>
                  <span className="lb-val"><Zap size={13} style={{ color: '#f59e0b' }} /> {u.rating}</span>
                  <span className="lb-val text-green">{u.totalSolved}</span>
                  <span className="lb-val text-secondary">{u.clashesPlayed}</span>
                  <span className="lb-val">
                    <div className="winrate-bar">
                      <div className="winrate-fill" style={{ width: `${winRate}%` }} />
                    </div>
                    <span className="text-secondary" style={{ fontSize: 12 }}>{winRate}%</span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function getRatingLabel(rating) {
  if (rating >= 2000) return '🔴 Legendary';
  if (rating >= 1700) return '🟣 Expert';
  if (rating >= 1400) return '🔵 Specialist';
  return '⚫ Newbie';
}
