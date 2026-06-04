export function exportWeeklyReport({ sleepRecords, dass21History, user, weeklyStats }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - 6);
  thisWeekStart.setHours(0, 0, 0, 0);

  const recentRecords = sleepRecords
    .filter(r => new Date(r.date) >= thisWeekStart)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const recentDass = (dass21History || []).slice(0, 3);
  const avgDur = weeklyStats?.thisWeekAvg || 0;
  const streak = weeklyStats?.streak || 0;

  const sleepRows = recentRecords.map(r => {
    const dayStr = new Date(r.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
    return `<tr>
      <td>${dayStr}</td>
      <td>${r.bedtime || '-'}</td>
      <td>${r.wakeTime || '-'}</td>
      <td style="font-weight:600">${r.duration ? r.duration + ' jam' : '-'}</td>
      <td>${r.qualityScore ? r.qualityScore + '/10' : (r.quality || '-')}</td>
      <td>${r.screenTimeBefore ? r.screenTimeBefore + ' mnt' : '-'}</td>
      <td style="font-size:11px;color:#555">${r.notes || '-'}</td>
    </tr>`;
  }).join('');

  const dassRows = recentDass.map(d => {
    const dateLabel = new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    return `<tr>
      <td>${dateLabel}</td>
      <td>${d.depression?.category || '-'} (${d.depression?.score ?? '-'})</td>
      <td>${d.anxiety?.category || '-'} (${d.anxiety?.score ?? '-'})</td>
      <td>${d.stress?.category || '-'} (${d.stress?.score ?? '-'})</td>
    </tr>`;
  }).join('');

  const diffSign = (weeklyStats?.diff ?? 0) >= 0 ? '+' : '';
  const diffColor = (weeklyStats?.diff ?? 0) >= 0 ? '#276749' : '#9B2C2C';

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan Tidur SleepSense</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; color: #1a1a1a; background: #fff; padding: 32px; font-size: 13px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; padding-bottom:16px; border-bottom:2px solid #4A5568; }
  .brand { font-size:22px; font-weight:700; color:#2D3748; }
  .brand span { color:#6B46C1; }
  .meta { text-align:right; color:#718096; font-size:12px; line-height:1.6; }
  .sec-title { font-size:13px; font-weight:600; color:#2D3748; margin-bottom:10px; padding:5px 10px; background:#EDF2F7; border-left:3px solid #6B46C1; border-radius:0 4px 4px 0; }
  .section { margin-bottom:22px; }
  .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:14px; }
  .stat { border:1px solid #E2E8F0; border-radius:8px; padding:10px; text-align:center; }
  .stat-val { font-size:20px; font-weight:700; color:#6B46C1; }
  .stat-lbl { font-size:11px; color:#718096; margin-top:2px; }
  table { width:100%; border-collapse:collapse; font-size:12px; }
  th { background:#2D3748; color:white; padding:7px 8px; text-align:left; font-weight:500; }
  td { padding:6px 8px; border-bottom:1px solid #E2E8F0; }
  tr:nth-child(even) td { background:#F7FAFC; }
  .empty { text-align:center; color:#A0AEC0; padding:16px; font-style:italic; }
  .disc { margin-top:24px; padding:8px 12px; background:#FFFBEB; border:1px solid #F6E05E; border-radius:6px; font-size:11px; color:#744210; }
  .footer { margin-top:20px; padding-top:14px; border-top:1px solid #E2E8F0; text-align:center; font-size:11px; color:#A0AEC0; }
  @media print { body { padding:16px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="brand">😴 Sleep<span>Sense</span></div>
    <div style="font-size:12px;color:#718096;margin-top:3px;">Laporan Kesehatan Tidur Mingguan</div>
  </div>
  <div class="meta">
    <strong>${user?.nickname || user?.username || 'Pengguna'}</strong><br>
    Dicetak: ${dateStr}<br>
    Periode: 7 hari terakhir
  </div>
</div>

<div class="section">
  <div class="sec-title">📊 Ringkasan Minggu Ini</div>
  <div class="stats">
    <div class="stat"><div class="stat-val">${avgDur}j</div><div class="stat-lbl">Rata-rata Tidur</div></div>
    <div class="stat"><div class="stat-val">${recentRecords.length}x</div><div class="stat-lbl">Hari Tercatat</div></div>
    <div class="stat"><div class="stat-val">🔥${streak}</div><div class="stat-lbl">Hari Streak</div></div>
    <div class="stat">
      ${weeklyStats?.lastWeekAvg > 0
        ? `<div class="stat-val" style="color:${diffColor}">${diffSign}${weeklyStats.diff}j</div><div class="stat-lbl">vs Minggu Lalu</div>`
        : `<div class="stat-val">—</div><div class="stat-lbl">vs Minggu Lalu</div>`}
    </div>
  </div>
</div>

<div class="section">
  <div class="sec-title">🛌 Catatan Tidur (7 Hari Terakhir)</div>
  ${recentRecords.length > 0 ? `
  <table>
    <thead><tr><th>Tanggal</th><th>Tidur</th><th>Bangun</th><th>Durasi</th><th>Kualitas</th><th>Screen Time</th><th>Catatan</th></tr></thead>
    <tbody>${sleepRows}</tbody>
  </table>` : '<p class="empty">Belum ada catatan tidur minggu ini.</p>'}
</div>

${recentDass.length > 0 ? `
<div class="section">
  <div class="sec-title">🧠 Riwayat Skrining DASS-21</div>
  <table>
    <thead><tr><th>Tanggal</th><th>Depresi</th><th>Kecemasan</th><th>Stres</th></tr></thead>
    <tbody>${dassRows}</tbody>
  </table>
</div>` : ''}

<div class="disc">⚠️ <strong>Penting:</strong> Laporan ini bersifat informatif dan BUKAN diagnosis medis. Hotline KESWA: <strong>119 ext 8</strong> · <strong>021-500-454</strong></div>
<div class="footer">SleepSense · Team CC26-PSU230 · DBS Foundation Coding Camp 2026<br>"Tidur yang baik adalah investasi terbaik untuk hari esok" 🌙</div>

<script>window.onload = function() { window.print(); }</script>
</body></html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) { alert('Pop-up diblokir! Izinkan pop-up di browser untuk mengunduh laporan.'); return; }
  win.document.write(html);
  win.document.close();
}
