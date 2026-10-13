import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Play, Send, ChevronLeft, ChevronDown, ChevronUp, RotateCcw, Clock, Cpu, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProblemSolver.css';

const LANGUAGES = [
  { id: 'cpp', label: 'C++', monaco: 'cpp' },
  { id: 'python', label: 'Python', monaco: 'python' },
  { id: 'javascript', label: 'JavaScript', monaco: 'javascript' },
  { id: 'java', label: 'Java', monaco: 'java' },
];

const DEFAULT_CODE = {
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}',
  python: '# Write your solution here\n',
  javascript: '// Write your solution here\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}',
};

export default function ProblemSolver() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [editorHeight, setEditorHeight] = useState(500);

  useEffect(() => {
    fetchProblem();
  }, [slug]);

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/problems/${slug}`);
      setProblem(res.data);
      const starter = res.data.starterCode?.[language] || DEFAULT_CODE[language];
      setCode(starter);
      if (res.data.testCases?.[0]) setCustomInput(res.data.testCases[0].input);
    } catch (err) {
      toast.error('Problem not found');
      navigate('/problems');
    }
    setLoading(false);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const starter = problem?.starterCode?.[lang] || DEFAULT_CODE[lang];
    setCode(starter);
  };

  const handleRun = async () => {
    if (!user) return toast.error('Please login to run code');
    setRunning(true);
    setOutput(null);
    try {
      const res = await axios.post('http://localhost:5000/api/submit/run', {
        code, language, input: customInput,
      });
      setOutput(res.data);
      setShowResults(true);
    } catch (err) {
      toast.error('Failed to run code');
    }
    setRunning(false);
  };

  const handleSubmit = async () => {
    if (!user) return toast.error('Please login to submit');
    setSubmitting(true);
    setSubmission(null);
    try {
      const res = await axios.post(`http://localhost:5000/api/submit/${slug}`, {
        code, language,
      });
      setSubmission(res.data);
      setShowResults(true);
      setActiveTab('result');

      if (res.data.submission.status === 'Accepted') {
        toast.success('🎉 Accepted! All test cases passed!', { duration: 4000 });
      } else {
        toast.error(`❌ ${res.data.submission.status}`);
      }
    } catch (err) {
      toast.error('Submission failed');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="page solver-loading">
        <div className="spinner spinner-lg" />
        <p>Loading problem...</p>
      </div>
    );
  }

  if (!problem) return null;

  const diffClass = problem.difficulty === 'Easy' ? 'badge-easy' : problem.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard';

  return (
    <div className="solver-page page">
      {/* Top bar */}
      <div className="solver-topbar">
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/problems')}>
          <ChevronLeft size={16} /> Problems
        </button>
        <div className="solver-problem-name">
          <span className={`badge ${diffClass}`}>{problem.difficulty}</span>
          <span className="solver-title">{problem.title}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={handleRun} disabled={running}>
            {running ? <span className="spinner" /> : <Play size={15} />}
            Run
          </button>
          <button className="btn btn-success btn-sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <span className="spinner" /> : <Send size={15} />}
            Submit
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="solver-layout">
        {/* Left panel */}
        <div className="solver-left">
          <div className="tabs">
            {['description', 'examples', 'submissions', 'result'].map((t) => (
              <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="problem-description animate-fade">
              <div className="flex gap-8 flex-wrap" style={{ marginBottom: 20 }}>
                {problem.tags?.map((t) => <span key={t} className="badge badge-tag">{t}</span>)}
              </div>
              <div className="description-text" dangerouslySetInnerHTML={{ __html: markdownToHtml(problem.description) }} />
              {problem.constraints && (
                <div className="constraints-box">
                  <strong>Constraints:</strong>
                  <pre>{problem.constraints}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="examples animate-fade">
              {problem.examples?.map((ex, i) => (
                <div key={i} className="example-card card">
                  <div className="example-label">Example {i + 1}</div>
                  <div className="io-row">
                    <span className="io-label">Input:</span>
                    <code>{ex.input}</code>
                  </div>
                  <div className="io-row">
                    <span className="io-label">Output:</span>
                    <code>{ex.output}</code>
                  </div>
                  {ex.explanation && (
                    <div className="io-row">
                      <span className="io-label">Explanation:</span>
                      <span className="text-secondary">{ex.explanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'result' && submission && (
            <div className="result-panel animate-fade">
              <div className={`result-status ${getStatusClass(submission.submission.status)}`}>
                {getStatusIcon(submission.submission.status)}
                {submission.submission.status}
              </div>
              <div className="result-meta grid-2" style={{ marginTop: 20 }}>
                <div className="meta-card">
                  <Clock size={16} />
                  <span>{submission.submission.runtime?.toFixed(0) || 0} ms</span>
                  <span className="text-secondary">Runtime</span>
                </div>
                <div className="meta-card">
                  <Cpu size={16} />
                  <span>{((submission.submission.memory || 0) / 1024).toFixed(1)} MB</span>
                  <span className="text-secondary">Memory</span>
                </div>
              </div>
              <div className="testcase-results">
                <div className="progress" style={{ marginBottom: 16 }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${(submission.submission.testCasesPassed / submission.submission.totalTestCases) * 100}%`, background: submission.submission.status === 'Accepted' ? 'var(--gradient-2)' : 'var(--accent-red)' }}
                  />
                </div>
                <p className="text-secondary">
                  {submission.submission.testCasesPassed} / {submission.submission.totalTestCases} test cases passed
                </p>
                {submission.results?.map((r, i) => (
                  <div key={i} className={`tc-row ${r.passed ? 'tc-pass' : 'tc-fail'}`}>
                    <span>{r.passed ? <CheckCircle size={14} /> : <XCircle size={14} />} Case {i + 1}</span>
                    {!r.passed && r.output !== '***' && (
                      <div className="tc-detail">
                        <span>Expected: <code>{r.expected}</code></span>
                        <span>Got: <code>{r.output || 'empty'}</code></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="animate-fade">
              <p className="text-secondary" style={{ textAlign: 'center', marginTop: 40 }}>
                Submit your solution to see history here.
              </p>
            </div>
          )}
        </div>

        {/* Right panel - Editor */}
        <div className="solver-right">
          <div className="editor-toolbar">
            <div className="lang-selector">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  className={`lang-btn ${language === l.id ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(l.id)}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button className="btn btn-outline btn-sm btn-icon" onClick={() => setCode(problem?.starterCode?.[language] || DEFAULT_CODE[language])} title="Reset code">
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="editor-wrapper">
            <Editor
              height="100%"
              language={LANGUAGES.find((l) => l.id === language)?.monaco || 'python'}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontFamily: 'JetBrains Mono, monospace',
                fontLigatures: true,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                tabSize: 4,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>

          {/* Console */}
          <div className="console-panel">
            <div className="console-header">
              <span>Console</span>
              <span className="text-muted" style={{ fontSize: 12 }}>Custom test input</span>
            </div>
            <textarea
              className="input console-input font-mono"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter custom input..."
              rows={3}
            />
            {output && (
              <div className="console-output">
                <span className="text-muted" style={{ fontSize: 12 }}>Output:</span>
                <pre className="font-mono">{output.stdout || output.stderr || 'No output'}</pre>
                {output.time && <span className="text-muted" style={{ fontSize: 12 }}>⏱ {parseFloat(output.time) * 1000}ms</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function markdownToHtml(text) {
  if (!text) return '';
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function getStatusClass(status) {
  if (status === 'Accepted') return 'status-accepted';
  if (status === 'Wrong Answer') return 'status-wrong';
  if (status === 'Time Limit Exceeded') return 'status-tle';
  return 'status-error';
}

function getStatusIcon(status) {
  if (status === 'Accepted') return <CheckCircle size={22} />;
  if (status === 'Wrong Answer') return <XCircle size={22} />;
  return <AlertTriangle size={22} />;
}
