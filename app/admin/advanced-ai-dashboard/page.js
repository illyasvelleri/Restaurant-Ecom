
// app/admin/prompts/ai-recommendations/page.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Save, Sparkles, RotateCcw, Copy, Check, Zap, TrendingUp, Settings, Activity, BarChart3,
  Clock, Eye, History, AlertCircle, Download, Upload
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AIRecommendationsDashboard() {
  // State Management
  const [activeTab, setActiveTab] = useState('editor'); // editor, performance, history (removed config)
  const [prompt, setPrompt] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [isEnabled, setIsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [testingAI, setTestingAI] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Performance Metrics (kept as-is)
  const [metrics, setMetrics] = useState({
    totalRecommendations: 0,
    totalClicks: 0,
    totalAddedToCart: 0,
    totalRevenue: 0,
    clickThroughRate: 0,
    conversionRate: 0
  });

  const [dailyMetrics, setDailyMetrics] = useState([]);

  // Load initial data
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/ai-recommendations');
      if (res.ok) {
        const data = await res.json();
        setPrompt(data.currentPrompt || '');
        setOriginalPrompt(data.currentPrompt || '');
        setVersions(data.versions || []);
        setCurrentVersion(data.currentVersion || 1);
        setIsEnabled(data.isEnabled !== undefined ? data.isEnabled : true);
        setMetrics(data.performance || metrics);
        setDailyMetrics(data.dailyMetrics || []);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load AI settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          prompt,
          isEnabled
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOriginalPrompt(prompt);
        setCurrentVersion(data.currentVersion);
        setVersions(data.versions);
        toast.success('Prompt saved successfully!');
      } else {
        toast.error('Failed to save prompt');
      }
    } catch (error) {
      toast.error('Error saving prompt');
    } finally {
      setSaving(false);
    }
  };

  const handleRollback = async (versionNumber) => {
    try {
      const res = await fetch('/api/admin/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rollback',
          version: versionNumber
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPrompt(data.currentPrompt);
        setOriginalPrompt(data.currentPrompt);
        setCurrentVersion(versionNumber);
        setVersions(data.versions);
        toast.success(`Rolled back to version ${versionNumber}`);
      }
    } catch (error) {
      toast.error('Error rolling back');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success('Prompt copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const exportData = {
      prompt,
      version: currentVersion,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-prompt-v${currentVersion}-${Date.now()}.json`;
    a.click();
    toast.success('Exported successfully!');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          setPrompt(imported.prompt || '');
          toast.success('Imported successfully!');
        } catch (error) {
          toast.error('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const testAI = async () => {
    setTestingAI(true);
    setTestResults(null);
    try {
      const res = await fetch('/api/admin/ai-recommendations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (res.ok) {
        const data = await res.json();
        setTestResults(data);
        toast.success('Test completed!');
      } else {
        toast.error('Test failed');
      }
    } catch (error) {
      toast.error('Error testing AI');
    } finally {
      setTestingAI(false);
    }
  };

  const hasChanges = prompt !== originalPrompt;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading AI Dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { overflow-x: hidden; }

        .dashboard {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f5f4f1;
        }

        /* Header */
        .dashboard-header {
          background: white;
          border-bottom: 1px solid #eceae5;
          padding: 24px 32px;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-title {
          font-size: clamp(20px, 4vw, 32px);
          font-weight: 300;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-badge-header {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .status-enabled {
          background: #d4edda;
          color: #155724;
        }

        .status-disabled {
          background: #f8d7da;
          color: #721c24;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Navigation Tabs */
        .nav-tabs {
          background: white;
          border-bottom: 1px solid #eceae5;
          padding: 0 32px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .nav-tabs::-webkit-scrollbar {
          display: none;
        }

        .tabs-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          gap: 4px;
        }

        .tab {
          padding: 16px 24px;
          font-size: 13px;
          font-weight: 400;
          color: #888;
          border: none;
          background: none;
          cursor: pointer;
          position: relative;
          white-space: nowrap;
          letter-spacing: 0.02em;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab:hover {
          color: #1a1a1a;
        }

        .tab.active {
          color: #1a1a1a;
          font-weight: 500;
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        /* Main Content */
        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px;
        }

        /* Cards */
        .card {
          background: white;
          border: 1px solid #eceae5;
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 24px;
          animation: fadeIn 0.4s ease;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .card-title {
          font-size: 20px;
          font-weight: 400;
          color: #1a1a1a;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-subtitle {
          font-size: 13px;
          font-weight: 300;
          color: #b0a898;
          margin-top: 6px;
        }

        /* Editor */
        .editor-container {
          position: relative;
        }

        .editor-textarea {
          width: 100%;
          min-height: 500px;
          padding: 20px;
          border: 1.5px solid #eceae5;
          border-radius: 16px;
          font-family: 'Courier New', monospace;
          font-size: 15px;
          line-height: 1.7;
          color: #1a1a1a;
          background: #fafaf9;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .editor-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .editor-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          font-size: 12px;
          color: #888;
          flex-wrap: wrap;
          gap: 8px;
        }

        /* Buttons */
        .button-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .btn-primary {
          background: #1a1a1a;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2a2a2a;
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f0ede8;
          color: #1a1a1a;
        }

        .btn-secondary:hover {
          background: #e5e2dc;
        }

        .btn-outline {
          background: white;
          color: #1a1a1a;
          border: 1.5px solid #eceae5;
        }

        .btn-outline:hover {
          border-color: #1a1a1a;
          background: #fafaf9;
        }

        .btn-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-gradient:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border: 1px solid #eceae5;
          border-radius: 16px;
          padding: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #b0a898;
        }

        .stat-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea20, #764ba220);
        }

        .stat-value {
          font-size: 32px;
          font-weight: 200;
          color: #1a1a1a;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 400;
          margin-top: 8px;
        }

        .stat-change.positive {
          color: #155724;
        }

        .stat-change.negative {
          color: #721c24;
        }

        /* Version History */
        .version-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .version-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #fafaf9;
          border: 1.5px solid #eceae5;
          border-radius: 12px;
          transition: all 0.2s;
          flex-wrap: wrap;
          gap: 12px;
        }

        .version-item:hover {
          border-color: #c8c5be;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .version-item.active {
          background: linear-gradient(135deg, #667eea10, #764ba210);
          border-color: #667eea;
        }

        .version-info {
          flex: 1;
          min-width: 200px;
        }

        .version-number {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .version-meta {
          font-size: 12px;
          color: #888;
        }

        .version-actions {
          display: flex;
          gap: 8px;
        }

        /* Test Results */
        .test-results {
          margin-top: 24px;
          padding: 20px;
          background: #fafaf9;
          border: 1.5px solid #eceae5;
          border-radius: 16px;
        }

        .test-results-title {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 16px;
        }

        .test-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .test-result-item {
          padding: 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid #eceae5;
        }

        .test-result-name {
          font-size: 13px;
          font-weight: 400;
          color: #1a1a1a;
          margin-bottom: 6px;
        }

        .test-result-price {
          font-size: 16px;
          font-weight: 300;
          color: #667eea;
          margin-bottom: 8px;
        }

        .test-result-reason {
          font-size: 11px;
          color: #888;
          font-style: italic;
          line-height: 1.4;
        }

        .test-result-badge {
          display: inline-block;
          padding: 4px 8px;
          background: #667eea20;
          color: #667eea;
          border-radius: 6px;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 8px;
        }

        /* Loading & Spinner */
        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f5f4f1;
          font-family: 'DM Sans', sans-serif;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 2px solid #e0ddd8;
          border-top-color: #1a1a1a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }

        .loading-screen p {
          font-size: 13px;
          color: #888;
          letter-spacing: 0.06em;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-content {
            padding: 20px 16px;
          }

          .card {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .version-item {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* Alert */
        .alert {
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 13px;
          line-height: 1.5;
        }

        .alert-warning {
          background: #fff3cd;
          border: 1px solid #ffc107;
          color: #856404;
        }

        .alert-info {
          background: #d1ecf1;
          border: 1px solid #17a2b8;
          color: #0c5460;
        }

        .alert-success {
          background: #d4edda;
          border: 1px solid #28a745;
          color: #155724;
        }
      `}</style>

      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="header-title">
                <Sparkles size={28} color="#667eea" />
                AI Recommendations
              </h1>
              <span className="ai-badge-header">
                <Zap size={12} />
                Advanced
              </span>
            </div>
            <div className="header-right">
              <div className={`status-indicator ${isEnabled ? 'status-enabled' : 'status-disabled'}`}>
                <div
                  className="status-dot"
                  style={{ background: isEnabled ? '#28a745' : '#dc3545' }}
                />
                {isEnabled ? 'Active' : 'Disabled'}
              </div>
              <label className="config-toggle" style={{ margin: 0, padding: '8px 12px' }}>
                <div className={`toggle-switch ${isEnabled ? 'active' : ''}`}>
                  <div className="toggle-slider" />
                </div>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Navigation Tabs – removed config tab */}
        <div className="nav-tabs">
          <div className="tabs-container">
            <button
              className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              <Settings size={16} />
              Prompt Editor
            </button>
            <button
              className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              <TrendingUp size={16} />
              Performance
            </button>
            <button
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={16} />
              Version History
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">

          {/* Editor Tab */}
          {activeTab === 'editor' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {hasChanges && (
                <div className="alert alert-warning">
                  <AlertCircle size={18} />
                  <div>
                    <strong>Unsaved Changes</strong><br />
                    You have unsaved changes to your AI prompt. Click "Save Changes" to apply them.
                  </div>
                </div>
              )}

              <div className="card">
                <div className="card-header">
                  <div>
                    <h2 className="card-title">
                      <Eye size={20} />
                      System Prompt
                    </h2>
                    <p className="card-subtitle">
                      Version {currentVersion} · Last modified {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="button-row">
                    <button className="btn btn-outline" onClick={handleCopy}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button className="btn btn-secondary" onClick={handleExport}>
                      <Download size={14} />
                      Export
                    </button>
                    <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                      <Upload size={14} />
                      Import
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                <div className="editor-container">
                  <textarea
                    className="editor-textarea"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your AI system prompt here..."
                  />
                  <div className="editor-info">
                    <span>{prompt.length} characters · {Math.ceil(prompt.length / 4)} tokens (approx)</span>
                    {hasChanges && <span style={{ color: '#856404' }}>● Unsaved</span>}
                  </div>
                </div>

                <div className="button-row" style={{ marginTop: 20 }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                  >
                    {saving ? (
                      <>
                        <div className="spinner" style={{ width: 14, height: 14, border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', margin: 0 }} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-gradient"
                    onClick={testAI}
                    disabled={testingAI}
                  >
                    {testingAI ? (
                      <>
                        <div className="spinner" style={{ width: 14, height: 14, border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', margin: 0 }} />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        Test AI
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setPrompt(originalPrompt)}
                    disabled={!hasChanges}
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                </div>

                {testResults && (
                  <div className="test-results">
                    <div className="test-results-title">
                      Test Results ({testResults.recommendations?.length || 0} recommendations)
                    </div>
                    <div className="test-results-grid">
                      {testResults.recommendations?.map((rec, idx) => (
                        <div key={idx} className="test-result-item">
                          <div className="test-result-name">
                            {rec.emoji} {rec.name}
                          </div>
                          <div className="test-result-price">
                            {rec.price}
                          </div>
                          <div className="test-result-reason">
                            {rec.reason}
                          </div>
                          {rec.badge && (
                            <div className="test-result-badge">{rec.badge}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    {testResults.responseTime && (
                      <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
                        Response time: {testResults.responseTime}ms
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Performance Tab – FIXED: safe chaining added */}
          {activeTab === 'performance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Total Recommendations</span>
                    <div className="stat-icon">
                      <Activity size={16} color="#667eea" />
                    </div>
                  </div>
                  <div className="stat-value">
                    {metrics?.totalRecommendations?.toLocaleString() || '0'}
                  </div>
                  <div className="stat-change positive">+12% vs last week</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Click-Through Rate</span>
                    <div className="stat-icon">
                      <TrendingUp size={16} color="#667eea" />
                    </div>
                  </div>
                  <div className="stat-value">
                    {metrics?.clickThroughRate?.toFixed(1) || '0.0'}%
                  </div>
                  <div className="stat-change positive">+2.3% vs last week</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Conversion Rate</span>
                    <div className="stat-icon">
                      <BarChart3 size={16} color="#667eea" />
                    </div>
                  </div>
                  <div className="stat-value">
                    {metrics?.conversionRate?.toFixed(1) || '0.0'}%
                  </div>
                  <div className="stat-change positive">+1.8% vs last week</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">Revenue Generated</span>
                    <div className="stat-icon">
                      <Sparkles size={16} color="#667eea" />
                    </div>
                  </div>
                  <div className="stat-value">
                    {metrics?.totalRevenue?.toLocaleString() || '0'}
                  </div>
                  <div className="stat-change positive">+18% vs last week</div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <BarChart3 size={20} />
                    Performance Insights
                  </h2>
                </div>
                <div className="alert alert-info">
                  <AlertCircle size={18} />
                  <div>
                    Your AI recommendations are performing above average! The click-through rate of {metrics?.clickThroughRate?.toFixed(1) || '0.0'}% exceeds the industry benchmark of 15-20%.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Version History Tab */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <History size={20} />
                    Version History
                  </h2>
                  <p className="card-subtitle">
                    {versions.length} version{versions.length !== 1 ? 's' : ''} saved
                  </p>
                </div>

                <div className="version-list">
                  {versions.slice().reverse().map((version) => (
                    <div
                      key={version.version}
                      className={`version-item ${version.version === currentVersion ? 'active' : ''}`}
                    >
                      <div className="version-info">
                        <div className="version-number">
                          Version {version.version}
                          {version.version === currentVersion && (
                            <span style={{
                              marginLeft: 8,
                              fontSize: 10,
                              background: '#667eea',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '999px'
                            }}>
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="version-meta">
                          {new Date(version.createdAt).toLocaleString()} · by {version.createdBy}
                          {version.notes && ` · ${version.notes}`}
                        </div>
                      </div>
                      <div className="version-actions">
                        <button
                          className="btn btn-outline"
                          onClick={() => {
                            setPrompt(version.prompt);
                            toast.success(`Loaded version ${version.version}`);
                          }}
                        >
                          <Eye size={14} />
                          Preview
                        </button>
                        {version.version !== currentVersion && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleRollback(version.version)}
                          >
                            <RotateCcw size={14} />
                            Restore
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </>
  );
}