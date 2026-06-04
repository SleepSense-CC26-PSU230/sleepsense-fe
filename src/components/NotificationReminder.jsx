import React from 'react';
import { useNotification } from '../context/NotificationContext';
import '../styles/forms.css';

export default function NotificationReminder() {
  const { permission, settings, requestPermission, updateSettings } = useNotification();

  // Izin belum diminta atau ditolak
  if (permission !== 'granted') {
    return (
      <button
        className="notif-activate-btn"
        onClick={requestPermission}
        title="Aktifkan notifikasi pengingat tidur"
      >
        🔔 Aktifkan Notifikasi
      </button>
    );
  }

  // Izin sudah diberikan → tampilkan toggle aktif/nonaktif
  const isEnabled = settings.enabled !== false;

  return (
    <button
      onClick={() => updateSettings({ enabled: !isEnabled })}
      title={isEnabled ? 'Klik untuk nonaktifkan notifikasi' : 'Klik untuk aktifkan notifikasi'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 20,
        border: `1.5px solid ${isEnabled ? '#4CAF50' : '#9E9E9E'}`,
        background: isEnabled ? '#E8F5E9' : '#F5F5F5',
        color: isEnabled ? '#2E7D32' : '#757575',
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        minWidth: 0,
      }}
    >
      {/* Toggle pill */}
      <span style={{
        display: 'inline-flex',
        width: 28,
        height: 16,
        borderRadius: 8,
        background: isEnabled ? '#4CAF50' : '#BDBDBD',
        position: 'relative',
        flexShrink: 0,
        transition: 'background 0.2s',
      }}>
        <span style={{
          position: 'absolute',
          top: 2,
          left: isEnabled ? 14 : 2,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'white',
          transition: 'left 0.2s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }} />
      </span>
      {isEnabled ? '🔔 Notifikasi aktif' : '🔕 Notifikasi mati'}
    </button>
  );
}
