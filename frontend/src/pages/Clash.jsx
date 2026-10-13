import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { Swords, Copy, Users, Clock, Trophy, Zap, Play, Send, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Clash.css';

const LANGUAGES = [
  { id: 'cpp', label: 'C++' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
];

const DEFAULT_CODE = {
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}',
  python: '# Write your solution here\n',
  javascript: '// Write your solution here\n',
};

let socket = null;

export default function Clash() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('lobby'); // lobby | waiting | playing | finished
  const [roomId, setRoomId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [players, setPlayers] = useState([]);
  const [clashProblem, setClashProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE['python']);
  const [timeLeft, setTimeLeft] = useState(900); // 15 min
  const [submitting, setSubmitting] = useState(false);
  const [scores, setScores] = useState({});
  const [winner, setWinner] = useState(null);
  const [mySolved, setMySolved] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    socket = io('http://localhost:5000', { withCredentials: true });

    socket.on('room_update', ({ players, started }) => {
      setPlayers(players);
    });

    socket.on('clash_started', ({ problemId, startTime, duration }) => {
      setPhase('playing');
      // Start timer
      const end = startTime + duration;
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.floor((end - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) clearInterval(timerRef.current);
      }, 1000);
    });

    socket.on('player_update', ({ username, solved, timeTaken, score, scores }) => {
      setScores(scores);
      if (username !== user.username) {
        toast(`🏃 ${username} just solved it!`, { icon: '⚡' });
      }
    });

    socket.on('clash_ended', ({ scores, reason }) => {
      clearInterval(timerRef.current);
      setScores(scores);
      setPhase('finished');
      const winnerName = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
      setWinner(winnerName);
      if (winnerName === user.username) toast.success('🏆 You won the clash!', { duration: 5000 });
      else toast.error(`😞 ${winnerName} won this round.`);
    });

    return () => {
      socket?.disconnect();
      clearInterval(timerRef.current);
    };
  }, [user]);

  const createRoom = async () => {
    if (!user) { toast.error('Please login first'); return navigate('/login'); }
    try {
      const res = await axios.post('http://localhost:5000/api/clash/create', { difficulty });
      const { roomId: id, problem } = res.data;
      setRoomId(id);
      setClashProblem(problem);
      socket.emit('join_room', { roomId: id, username: user.username });
      setPhase('waiting');
      toast.success(`Room created! Share code: ${id}`);
    } catch {
      toast.error('Failed to create room');
    }
  };

  const joinRoom = () => {
    if (!user) { toast.error('Please login first'); return navigate('/login'); }
    if (!joinCode.trim()) return toast.error('Enter a room code');
    const id = joinCode.trim().toUpperCase();
    setRoomId(id);
    socket.emit('join_room', { roomId: id, username: user.username });
    setPhase('waiting');
    toast.success('Joined room!');
  };

  const startClash = () => {
    if (players.length < 2) return toast.error('Need at least 2 players');
    socket.emit('start_clash', { roomId, problemId: clashProblem?._id });
  };

  const handleSubmit = async () => {
    if (!clashProblem || mySolved) return;
    setSubmitting(true);
    try {
      const timeTaken = 900 - timeLeft;
      const res = await axios.post(`http://localhost:5000/api/submit/${clashProblem.slug}`, {
        code, language, clashRoom: roomId, timeTaken,
      });
      if (res.data.submission.status === 'Accepted') {
        setMySolved(true);
        const score = res.data.submission.score;
        socket.emit('player_solved', { roomId, username: user.username, timeTaken, score });
        toast.success('🎉 Solved! Great job!');
      } else {
        toast.error(`❌ ${res.data.submission.status}`);
      }
    } catch { toast.error('Submit failed'); }
    setSubmitting(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room code copied!');
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (!user) return (
    <div className="clash-page page">
      <div className="container clash-auth-prompt">
        <Swords size={64} style={{ color: 'var(--accent-purple)' }} />
        <h2>Login to Enter the Arena</h2>
        <p className="text-secondary">You need an account to create or join clash rooms</p>
        <div className="flex gap-16 justify-center" style={{ marginTop: 20 }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="clash-page page">
      <div className="container">
        {/* Lobby */}
        {phase === 'lobby' && (
          <div className="clash-lobby animate-fade">
            <div className="clash-hero">
              <div className="clash-hero-icon"><Swords size={48} /></div>
              <h1>Clash Arena</h1>
              <p className="text-secondary">Challenge a friend to a 1v1 DSA coding battle</p>
            </div>

            <div className="clash-options">
              {/* Create Room */}
              <div className="card clash-card">
                <h3><Zap size={18} style={{ color: 'var(--accent-green)' }} /> Create Room</h3>
                <p className="text-secondary">Start a new clash and invite a friend with a code</p>
                <div className="clash-form">
                  <label className="form-label">Difficulty</label>
                  <div className="diff-selector">
                    {['Easy', 'Medium', 'Hard'].map((d) => (
                      <button
                        key={d}
                        className={`diff-btn diff-${d.toLowerCase()} ${difficulty === d ? 'active' : ''}`}
                        onClick={() => setDifficulty(d)}
                      >{d}</button>
                    ))}
                  </div>
                  <button className="btn btn-success" style={{ width: '100%', marginTop: 8 }} onClick={createRoom}>
                    <Swords size={16} /> Create Room
                  </button>
                </div>
              </div>

              <div className="clash-divider">OR</div>

              {/* Join Room */}
              <div className="card clash-card">
                <h3><Users size={18} style={{ color: 'var(--accent-blue)' }} /> Join Room</h3>
                <p className="text-secondary">Enter a room code to join your friend's clash</p>
                <div className="clash-form">
                  <label className="form-label">Room Code</label>
                  <input
                    className="input font-mono"
                    placeholder="Enter 6-digit code..."
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    style={{ textAlign: 'center', fontSize: 22, letterSpacing: 6, fontWeight: 700 }}
                    onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                  />
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={joinRoom}>
                    <Users size={16} /> Join Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Waiting room */}
        {phase === 'waiting' && (
          <div className="clash-waiting animate-fade">
            <div className="room-code-display">
              <span className="text-secondary" style={{ fontSize: 13 }}>Room Code</span>
              <div className="room-code-big">{roomId}</div>
              <button className="btn btn-outline btn-sm" onClick={copyCode}>
                <Copy size={14} /> Copy Code
              </button>
            </div>

            <div className="waiting-players">
              <h3>Players ({players.length}/2)</h3>
              <div className="players-list">
                {players.map((p) => (
                  <div key={p.username} className="player-slot player-joined">
                    <div className="avatar">{p.username[0].toUpperCase()}</div>
                    <span className="font-weight-600">{p.username}</span>
                    {p.username === user.username && <span className="you-tag">You</span>}
                    <CheckCircle size={16} className="text-green" />
                  </div>
                ))}
                {players.length < 2 && (
                  <div className="player-slot player-empty">
                    <div className="avatar" style={{ background: 'var(--bg-secondary)', border: '2px dashed var(--border)' }}>?</div>
                    <span className="text-muted">Waiting for opponent...</span>
                    <div className="spinner" />
                  </div>
                )}
              </div>

              {clashProblem && (
                <div className="clash-problem-preview card">
                  <span className="text-muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Problem</span>
                  <div className="flex items-center gap-8" style={{ marginTop: 8 }}>
                    <span className={`badge badge-${clashProblem.difficulty?.toLowerCase()}`}>{clashProblem.difficulty}</span>
                    <span style={{ fontWeight: 600 }}>{clashProblem.title}</span>
                  </div>
                </div>
              )}

              {players.length >= 1 && players[0]?.username === user.username && (
                <button
                  className="btn btn-success btn-lg"
                  style={{ width: '100%' }}
                  onClick={startClash}
                  disabled={players.length < 2}
                >
                  <Swords size={18} /> {players.length < 2 ? 'Waiting for opponent...' : 'Start Clash!'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Playing */}
        {phase === 'playing' && clashProblem && (
          <div className="clash-playing">
            {/* Timer bar */}
            <div className="clash-timer-bar">
              <div className="clash-players-mini">
                {players.map((p) => (
                  <div key={p.username} className={`mini-player ${scores[p.username] ? 'solved' : ''}`}>
                    <div className="avatar avatar-sm">{p.username[0].toUpperCase()}</div>
                    <span>{p.username}</span>
                    {scores[p.username] ? <CheckCircle size={14} className="text-green" /> : null}
                    <span className="mini-score">{scores[p.username] || 0} pts</span>
                  </div>
                ))}
              </div>
              <div className={`clash-timer ${timeLeft < 120 ? 'timer-warning' : ''}`}>
                <Clock size={16} />
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="clash-editor-layout">
              {/* Problem panel */}
              <div className="clash-problem-panel">
                <div className={`badge badge-${clashProblem.difficulty?.toLowerCase()}`} style={{ marginBottom: 12 }}>{clashProblem.difficulty}</div>
                <h2>{clashProblem.title}</h2>
                <div className="tags-row flex gap-8 flex-wrap" style={{ margin: '12px 0' }}>
                  {clashProblem.tags?.map((t) => <span key={t} className="badge badge-tag">{t}</span>)}
                </div>
                <a href={`/problems/${clashProblem.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ marginBottom: 16 }}>
                  View Full Problem ↗
                </a>
                {mySolved && (
                  <div className="solved-banner">
                    <CheckCircle size={20} />
                    You solved it! Waiting for opponent...
                  </div>
                )}
              </div>

              {/* Editor */}
              <div className="clash-editor">
                <div className="editor-toolbar">
                  <div className="lang-selector">
                    {LANGUAGES.map((l) => (
                      <button key={l.id} className={`lang-btn ${language === l.id ? 'active' : ''}`}
                        onClick={() => { setLanguage(l.id); setCode(DEFAULT_CODE[l.id]); }}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                  <button className="btn btn-success btn-sm" onClick={handleSubmit} disabled={submitting || mySolved}>
                    {submitting ? <span className="spinner" /> : <Send size={14} />}
                    {mySolved ? 'Solved ✓' : 'Submit'}
                  </button>
                </div>
                <div style={{ height: 'calc(100vh - 200px)' }}>
                  <Editor
                    height="100%"
                    language={language === 'cpp' ? 'cpp' : language}
                    value={code}
                    onChange={(v) => setCode(v || '')}
                    theme="vs-dark"
                    options={{ fontSize: 14, minimap: { enabled: false }, fontFamily: 'JetBrains Mono, monospace', padding: { top: 12 } }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Finished */}
        {phase === 'finished' && (
          <div className="clash-finished animate-fade">
            <div className="finished-card card">
              <div className="finished-icon">
                {winner === user.username ? '🏆' : '😤'}
              </div>
              <h2>{winner === user.username ? 'You Won!' : `${winner} Won`}</h2>
              <p className="text-secondary">{winner === user.username ? 'Outstanding performance!' : 'Better luck next time!'}</p>

              <div className="final-scores">
                {Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([name, score], i) => (
                  <div key={name} className={`score-row ${name === user.username ? 'score-me' : ''}`}>
                    <span>{i === 0 ? '🥇' : '🥈'} {name}</span>
                    <span className="score-pts">{score} pts</span>
                  </div>
                ))}
              </div>

              <div className="finished-actions">
                <button className="btn btn-primary" onClick={() => { setPhase('lobby'); setRoomId(''); setScores({}); setMySolved(false); setTimeLeft(900); }}>
                  <Swords size={16} /> New Clash
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/leaderboard')}>
                  <Trophy size={16} /> Leaderboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
