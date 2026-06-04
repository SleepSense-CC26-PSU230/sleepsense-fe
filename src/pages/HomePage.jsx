import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSleepData } from '../context/SleepDataContext';
import { useChat } from '../context/ChatContext';
import { getGreeting } from '../utils/dateHelper';
import { analyzeSleep, calcStreak, getWeeklyComparison } from '../utils/sleepAnalyzer';
import { exportWeeklyReport } from '../utils/pdfExport';
import ChatBubble from '../components/Chatbubble';
import QuickReply from '../components/QuickReply';
import ProgressBar from '../components/ProgressBar';
import MoodSelector from '../components/MoodSelector';
import NotificationReminder from '../components/NotificationReminder';
import '../styles/pages.css';
import '../styles/chat.css';
import '../styles/forms.css';

// ── Empty State ───────────────────────────────────────────────
function EmptyState({ onNavigate }) {
  return (
    <div style={{
      textAlign: 'center', padding: '28px 16px',
      background: 'linear-gradient(135deg, #EDE9FE, #E0E7FF)',
      borderRadius: 16, marginBottom: 16, color: '#1a1a1a'
    }}>
      <div style={{ fontSize: 52, marginBottom: 10 }}>🌙</div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>
        Belum ada catatan tidur
      </h3>
      <p style={{ fontSize: '0.83rem', color: '#4A5568', lineHeight: 1.6, marginBottom: 18 }}>
        Mulai catat tidurmu hari ini dan dapatkan<br />analisis kesehatan tidur yang personal!
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => onNavigate('/sleep')}
          style={{ borderRadius: 24, padding: '9px 18px', fontSize: '0.85rem' }}>
          🛌 Catat Tidur Pertamaku
        </button>
        <button className="btn btn-outline" onClick={() => onNavigate('/health')}
          style={{ borderRadius: 24, padding: '9px 18px', fontSize: '0.85rem' }}>
          🤖 Cek Risiko Kesehatan
        </button>
      </div>
    </div>
  );
}

// ── Weekly Comparison Card ────────────────────────────────────
function WeeklyComparisonCard({ weekly }) {
  const trendIcon = weekly.trend === 'up' ? '📈' : weekly.trend === 'down' ? '📉' : '➡️';
  const trendColor = weekly.trend === 'up' ? '#276749' : weekly.trend === 'down' ? '#9B2C2C' : '#553C9A';
  const trendText = weekly.trend === 'up'
    ? `+${weekly.diff}j lebih baik dari minggu lalu`
    : weekly.trend === 'down'
    ? `${Math.abs(weekly.diff)}j lebih sedikit dari minggu lalu`
    : 'Stabil dibanding minggu lalu';

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>📅 Perbandingan Mingguan</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div style={{ background: 'var(--bg-main)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>
            {weekly.thisWeekAvg}<span style={{ fontSize: '0.8rem' }}> jam</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Minggu Ini ({weekly.thisWeekCount}x)
          </div>
        </div>
        <div style={{ background: 'var(--bg-main)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {weekly.lastWeekAvg > 0
              ? <>{weekly.lastWeekAvg}<span style={{ fontSize: '0.8rem' }}> jam</span></>
              : <span style={{ fontSize: '1rem' }}>—</span>}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Minggu Lalu ({weekly.lastWeekCount}x)
          </div>
        </div>
      </div>
      {weekly.lastWeekAvg > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: trendColor + '18', borderRadius: 8,
          padding: '7px 12px', fontSize: '0.82rem', color: trendColor, fontWeight: 500
        }}>
          {trendIcon} {trendText}
        </div>
      )}
    </div>
  );
}

// ── Main HomePage ─────────────────────────────────────────────
export default function HomePage() {
  const { user } = useAuth();
  const { sleepRecords, dass21History, targetSleep, fetchSleepData, fetchDass21History } = useSleepData();
  const { messages, isLoading, addUserMessage } = useChat();
  const [mood, setMood] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSleepData(14);
    if (fetchDass21History) fetchDass21History();
  }, [fetchSleepData, fetchDass21History]);

  const analysis = analyzeSleep(sleepRecords, targetSleep.hours);
  const streak   = calcStreak(sleepRecords);
  const weekly   = getWeeklyComparison(sleepRecords);
  const greeting = getGreeting();
  const hasData  = sleepRecords.length > 0;

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addUserMessage(chatInput.trim());
    setChatInput('');
    setShowChat(true);
  };

  const handleQuickReply = (key) => {
    const replies = {
      sleep_tips: 'Berikan tips tidur yang lebih baik',
      screen_time: 'Bagaimana cara mengurangi screen time?',
      mood_check: 'Aku ingin cerita tentang perasaanku hari ini',
      relaxation: 'Ajari aku teknik relaksasi sebelum tidur'
    };
    addUserMessage(replies[key] || key);
    setShowChat(true);
  };

  const handleExportPDF = () => {
    setExporting(true);
    exportWeeklyReport({ sleepRecords, dass21History: dass21History || [], user, weeklyStats: { ...weekly, streak } });
    setTimeout(() => setExporting(false), 1200);
  };

  return (
    <div className="page-content">

      {/* ── Greeting + Streak ──── */}
      <div className="card home-greeting-card">
        <div className="home-greeting-content">
          <div style={{ flex: 1 }}>
            <h2 className="home-greeting-title">{greeting}, {user?.nickname || user?.username}!</h2>
            <p className="home-greeting-subtitle">{analysis.insights?.[0] || 'Semoga harimu menyenangkan! 🌟'}</p>
            {streak > 0 && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                marginTop: 8, padding: '4px 11px',
                background: streak >= 7 ? '#FEFCBF' : streak >= 3 ? '#FEF3C7' : '#EDE9FE',
                border: `1px solid ${streak >= 7 ? '#D69E2E' : streak >= 3 ? '#F6AD55' : '#9F7AEA'}`,
                borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                color: streak >= 7 ? '#744210' : streak >= 3 ? '#7B341E' : '#553C9A'
              }}>
                🔥 {streak} hari streak{streak >= 7 ? ' 🏆' : streak >= 3 ? ' 💪' : ''}
              </div>
            )}
          </div>
          <NotificationReminder />
        </div>
      </div>

      {/* ── Data atau Empty State ── */}
      {!hasData ? (
        <EmptyState onNavigate={navigate} />
      ) : (
        <>
          {/* Ringkasan Tidur */}
          <div className="card home-summary-card">
            <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>📊 Ringkasan Tidur</h3>
            <ProgressBar value={analysis.avgDuration} max={targetSleep.hours} label="Rata-rata Durasi" color="var(--primary)" />
            <ProgressBar value={analysis.consistency} max={100} label="Konsistensi Jadwal" color="var(--accent)" />
            <div className="home-summary-stats">
              <span>🎯 Target: {targetSleep.hours} jam</span>
              <span className={`home-risk-badge risk-${analysis.riskLevel}`}>
                Risiko: {analysis.riskLevel === 'high' ? 'Tinggi' : analysis.riskLevel === 'medium' ? 'Sedang' : 'Rendah'}
              </span>
            </div>
          </div>

          {/* Weekly Comparison */}
          <WeeklyComparisonCard weekly={weekly} />

          {/* Tombol Export PDF */}
          <button onClick={handleExportPDF} disabled={exporting} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', marginBottom: 16, padding: '11px',
            background: exporting ? 'var(--bg-main)' : 'linear-gradient(135deg, #667EEA, #764BA2)',
            color: exporting ? 'var(--text-muted)' : 'white',
            border: 'none', borderRadius: 12, fontSize: '0.88rem',
            fontWeight: 600, cursor: exporting ? 'not-allowed' : 'pointer'
          }}>
            {exporting ? '⏳ Membuat laporan...' : '📄 Unduh Laporan Mingguan (PDF)'}
          </button>
        </>
      )}

      {/* ── Mood ── */}
      <div className="card home-mood-card">
        <h3 style={{ textAlign: 'center', marginBottom: 12 }}>Bagaimana perasaanmu hari ini?</h3>
        <MoodSelector value={mood} onChange={(m) => {
          setMood(m);
          const msgs = { happy: 'Aku merasa senang hari ini!', neutral: 'Perasaanku biasa saja hari ini', sad: 'Aku merasa sedih, butuh teman cerita', stressed: 'Aku lagi stres nih', anxious: 'Aku merasa cemas' };
          if (msgs[m]) { addUserMessage(msgs[m]); setShowChat(true); }
        }} />
      </div>

      {/* ── Chat ── */}
      <div className="card home-chat-card">
        <div className="chat-header">
          <span className="chat-header-icon">🤖</span>
          <div className="chat-header-info">
            <h3>SobatSense</h3>
            <p>Teman curhat & panduan tidurmu</p>
          </div>
          <button className="btn btn-sm btn-outline chat-toggle-btn" onClick={() => setShowChat(!showChat)}>
            {showChat ? 'Sembunyikan' : '💬 Chat'}
          </button>
        </div>
        {showChat && (
          <>
            <div className="chat-messages-container">
              {messages.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>Hai! Ada yang bisa aku bantu? 👋</p>
              )}
              {messages.map((msg, i) => (
                <ChatBubble key={i} message={msg} isUser={msg.role === 'user'} />
              ))}
              {isLoading && <div className="typing-indicator">SobatSense sedang mengetik...</div>}
            </div>
            <QuickReply onSelect={handleQuickReply} disabled={isLoading} />
            <form className="chat-input-form" onSubmit={handleSend}>
              <input className="chat-input" type="text" value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Tanyakan sesuatu ke SobatSense..." />
              <button className="btn btn-primary btn-sm chat-send-btn"
                disabled={isLoading || !chatInput.trim()}>➤</button>
            </form>
          </>
        )}
      </div>

    </div>
  );
}
