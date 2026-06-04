import React from 'react';
import { useNavigate } from 'react-router-dom';

const TEAM = [
  {
    name: 'Nama Anggota 1',       // ← ganti dengan nama asli
    role: 'Backend Developer',
    desc: 'Membangun API Express.js, integrasi Supabase, dan autentikasi JWT.',
    emoji: '⚙️',
    github: '#',                  // ← ganti dengan link GitHub
    color: '#6366F1',
  },
  {
    name: 'Nama Anggota 2',
    role: 'Frontend Developer',
    desc: 'Merancang UI/UX React dengan PWA support dan dark mode.',
    emoji: '🎨',
    github: '#',
    color: '#EC4899',
  },
  {
    name: 'Rifqi Zaghlul',
    role: 'AI / ML Engineer',
    desc: 'Membangun model prediksi risiko tidur dan integrasi Flask + Gemini AI.',
    emoji: '🤖',
    github: '#',
    color: '#14B8A6',
  },
  {
    name: 'Nama Anggota 4',
    role: 'Full Stack Developer',
    desc: 'Berkontribusi di seluruh layer aplikasi dari desain hingga deployment.',
    emoji: '🚀',
    github: '#',
    color: '#F59E0B',
  },
];

function Stars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4, dur: Math.random() * 3 + 2,
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: '50%', background: 'white',
          opacity: 0, animation: `twinkle ${s.dur}s ${s.delay}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
}

function MemberCard({ member, index }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${member.color}30`,
      borderRadius: 24, padding: '32px 24px',
      textAlign: 'center', backdropFilter: 'blur(12px)',
      animation: `fadeUp 0.5s ${0.1 + index * 0.1}s both`,
      transition: 'transform 0.3s, border-color 0.3s, background 0.3s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.borderColor = member.color + '60';
      e.currentTarget.style.background = member.color + '10';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = member.color + '30';
      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
    }}>
      {/* Avatar */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
        background: `linear-gradient(135deg, ${member.color}40, ${member.color}15)`,
        border: `2px solid ${member.color}50`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36,
      }}>
        {member.emoji}
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E2E8F0', marginBottom: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>
        {member.name}
      </h3>

      <div style={{
        display: 'inline-block', padding: '3px 12px',
        background: member.color + '20', border: `1px solid ${member.color}40`,
        borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
        color: member.color, marginBottom: 14, letterSpacing: '0.03em',
      }}>
        {member.role}
      </div>

      <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: 20 }}>
        {member.desc}
      </p>

      {member.github && member.github !== '#' && (
        <a href={member.github} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 16px', borderRadius: 20,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#94A3B8', fontSize: '0.8rem',
          textDecoration: 'none', fontWeight: 500,
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#E2E8F0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
          <span>⌨️</span> GitHub
        </a>
      )}
    </div>
  );
}

export default function TeamPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #020817 0%, #0F172A 50%, #1E1B4B 100%)',
      color: '#E2E8F0',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes twinkle { 0%,100%{opacity:0.1} 50%{opacity:0.7} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      `}</style>

      <Stars />

      {/* Glowing orb */}
      <div style={{ position: 'fixed', top: '-5%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '14px 5%',
        background: 'rgba(2,8,23,0.8)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => navigate('/landing')} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8',
          fontSize: '0.875rem', fontWeight: 500,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#E2E8F0'}
        onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
          ← Kembali
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>😴</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700 }}>
            Sleep<span style={{ color: '#A78BFA' }}>Sense</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/login')} style={{ padding: '7px 18px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#94A3B8', fontSize: '0.82rem', cursor: 'pointer' }}>Masuk</button>
          <button onClick={() => navigate('/register')} style={{ padding: '7px 18px', borderRadius: 20, background: 'linear-gradient(135deg, #7C3AED, #2563EB)', border: 'none', color: 'white', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Daftar</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 5% 60px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12, animation: 'float 4s ease-in-out infinite' }}>👥</div>
        <p style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.82rem', letterSpacing: '0.1em', marginBottom: 12, animation: 'fadeUp 0.5s 0.1s both' }}>TEAM CC26-PSU230</p>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16,
          animation: 'fadeUp 0.5s 0.2s both',
        }}>
          Tim di Balik{' '}
          <span style={{ background: 'linear-gradient(135deg, #A78BFA, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SleepSense
          </span>
        </h1>
        <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7, animation: 'fadeUp 0.5s 0.3s both' }}>
          Empat mahasiswa yang bersatu membangun solusi nyata untuk masalah nyata — karena tidur yang baik adalah hak semua orang.
        </p>

        {/* Badge DBS */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginTop: 24, padding: '8px 20px',
          background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 20, fontSize: '0.8rem', color: '#A78BFA', fontWeight: 500,
          animation: 'fadeUp 0.5s 0.4s both',
        }}>
          🏆 DBS Foundation Coding Camp 2026
        </div>
      </section>

      {/* Team Grid */}
      <section style={{ position: 'relative', zIndex: 1, padding: '20px 5% 80px' }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24,
        }}>
          {TEAM.map((member, i) => <MemberCard key={i} member={member} index={i} />)}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 5% 80px' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, padding: '40px 32px',
        }}>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: 24, lineHeight: 1.6 }}>
            Tertarik mencoba hasil karya kami?<br />
            <span style={{ color: '#94A3B8' }}>SleepSense gratis untuk semua pengguna.</span>
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{
              padding: '11px 28px', borderRadius: 24,
              background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
              border: 'none', color: 'white', fontSize: '0.9rem',
              fontWeight: 600, cursor: 'pointer',
            }}>🚀 Coba SleepSense</button>
            <button onClick={() => navigate('/landing')} style={{
              padding: '11px 28px', borderRadius: 24,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#94A3B8', fontSize: '0.9rem', cursor: 'pointer',
            }}>← Kembali ke Landing</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 5%', textAlign: 'center', fontSize: '0.78rem', color: '#334155' }}>
        © 2026 SleepSense · Team CC26-PSU230 · DBS Foundation Coding Camp
      </footer>
    </div>
  );
}
