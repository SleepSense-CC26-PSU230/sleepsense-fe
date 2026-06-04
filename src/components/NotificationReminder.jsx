import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

export default function NotificationReminder() {
  const { permission, settings, requestPermission, updateSettings } = useNotification();
  const [showTooltip, setShowTooltip] = useState(false);

  const isEnabled = permission === 'granted' && settings.enabled !== false;

  const handleClick = () => {
    if (permission !== 'granted') {
      requestPermission();
    } else {
      updateSettings({ enabled: !isEnabled });
    }
  };

  const label = permission !== 'granted'
    ? 'Aktifkan notifikasi'
    : isEnabled ? 'Notifikasi aktif — klik untuk matikan' : 'Notifikasi mati — klik untuk aktifkan';

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={label}
        aria-label={label}
        style={{
          width: 36, height: 36,
          borderRadius: '50%',
          border: 'none',
          background: isEnabled
            ? 'rgba(74, 222, 128, 0.15)'
            : permission !== 'granted'
            ? 'rgba(148, 163, 184, 0.12)'
            : 'rgba(148, 163, 184, 0.12)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
          transition: 'background 0.2s, transform 0.15s',
          position: 'relative',
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {permission !== 'granted' ? '🔔' : isEnabled ? '🔔' : '🔕'}

        {/* Dot indikator aktif */}
        {isEnabled && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 8, height: 8, borderRadius: '50%',
            background: '#4ADE80',
            border: '1.5px solid var(--bg-card, #fff)',
          }} />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div style={{
          position: 'absolute', top: 44, right: 0,
          background: 'var(--bg-tooltip, #1e293b)',
          color: 'var(--text-tooltip, #e2e8f0)',
          fontSize: '0.72rem', fontWeight: 500,
          padding: '5px 10px', borderRadius: 8,
          whiteSpace: 'nowrap', pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 50,
        }}>
          {label}
          <div style={{
            position: 'absolute', top: -4, right: 12,
            width: 8, height: 8, background: 'var(--bg-tooltip, #1e293b)',
            transform: 'rotate(45deg)',
          }} />
        </div>
      )}
    </div>
  );
}
