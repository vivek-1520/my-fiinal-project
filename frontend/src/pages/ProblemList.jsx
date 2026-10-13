import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, ChevronRight, CheckCircle2, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProblemList.css';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const TAGS = ['All', 'Array', 'Hash Table', 'Linked List', 'Dynamic Programming', 'Binary Search', 'Graph', 'BFS', 'DFS', 'String', 'Recursion', 'Two Pointers', 'Stack', 'Heap'];

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [tag, setTag] = useState('All');
  const [solvedIds, setSolvedIds] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
    if (user) fetchUserSolved();
  }, [search, difficulty, tag]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (tag !== 'All') params.tag = tag;
      const res = await axios.get('http://localhost:5000/api/problems', { params });
      setProblems(res.data.problems);
    } catch (err) {
      // Use fallback data if backend not running
      setProblems([]);
    }
    setLoading(false);
  };

  const fetchUserSolved = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      setSolvedIds(res.data.solvedProblems?.map((p) => p._id || p) || []);
    } catch {}
  };

  const difficultyClass = (d) => d === 'Easy' ? 'badge-easy' : d === 'Medium' ? 'badge-medium' : 'badge-hard';

  return (
    <div className="problems-page page">
      <div className="container">
        {/* Header */}
        <div className="problems-header">
          <div>
            <h1>Problem List</h1>
            <p className="text-secondary">Practice DSA with curated problems</p>
          </div>
          <div className="problems-stats">
            <span className="badge badge-easy">{problems.filter(p => p.difficulty === 'Easy').length} Easy</span>
            <span className="badge badge-medium">{problems.filter(p => p.difficulty === 'Medium').length} Medium</span>
            <span className="badge badge-hard">{problems.filter(p => p.difficulty === 'Hard').length} Hard</span>
          </div>
        </div>

        {/* Filters */}
        <div className="problems-filters">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              className="input"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
          </div>
          <div className="filter-group">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                className={`filter-btn ${difficulty === d ? 'active-' + d.toLowerCase() : ''}`}
                onClick={() => setDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <select className="input select-tag" value={tag} onChange={(e) => setTag(e.target.value)} style={{ width: 'auto' }}>
            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Problem Table */}
        <div className="problems-table card">
          <div className="table-header">
            <span>Status</span>
            <span>Title</span>
            <span>Difficulty</span>
            <span>Tags</span>
            <span>Acceptance</span>
          </div>

          {loading ? (
            <div className="loading-state">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-row" />)}
            </div>
          ) : problems.length === 0 ? (
            <div className="empty-state">
              <Code2 size={48} className="text-muted" />
              <p>No problems found. Make sure the backend is running and seeded.</p>
              <code className="text-secondary" style={{ fontSize: 13 }}>cd backend && npm run seed</code>
            </div>
          ) : (
            problems.map((p, i) => {
              const isSolved = solvedIds.includes(p._id);
              return (
                <div key={p._id} className="problem-row" onClick={() => navigate(`/problems/${p.slug}`)}>
                  <span className="problem-status">
                    {isSolved ? <CheckCircle2 size={18} className="text-green" /> : <div className="unsolved-dot" />}
                  </span>
                  <span className="problem-title">
                    <span className="problem-num">{i + 1}.</span>
                    {p.title}
                  </span>
                  <span>
                    <span className={`badge ${difficultyClass(p.difficulty)}`}>{p.difficulty}</span>
                  </span>
                  <span className="problem-tags">
                    {p.tags?.slice(0, 2).map((t) => (
                      <span key={t} className="badge badge-tag">{t}</span>
                    ))}
                  </span>
                  <span className="problem-acceptance">
                    {p.acceptanceRate > 0 ? `${p.acceptanceRate}%` : '--'}
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
