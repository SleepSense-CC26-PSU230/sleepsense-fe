export function analyzeSleep(sleepRecords, targetHours = 8) {
  if (!sleepRecords.length) return { avgDuration: 0, consistency: 0, trend: 'no_data', riskLevel: 'low', insights: [] };

  const durations = sleepRecords.map(r => r.duration || 0);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

  const variance = durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / durations.length;
  const stdDev = Math.sqrt(variance);
  const consistency = Math.max(0, 100 - (stdDev / 2) * 100);

  const n = durations.length;
  const indices = durations.map((_, i) => i);
  const xMean = (n - 1) / 2;
  const yMean = avgDuration;
  const slope = indices.reduce((sum, x, i) => sum + (x - xMean) * (durations[i] - yMean), 0) /
    (indices.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0) || 1);
  const trend = slope > 0.1 ? 'improving' : slope < -0.1 ? 'declining' : 'stable';

  let riskLevel = 'low';
  const insights = [];
  if (avgDuration < 6) { riskLevel = 'high'; insights.push('Durasi tidur rata-rata kurang dari 6 jam. Ini meningkatkan risiko hipertensi hingga 20%.'); }
  else if (avgDuration < 7) { riskLevel = 'medium'; insights.push('Durasi tidur di bawah rekomendasi 7-9 jam. Coba tambahkan 30 menit tidur.'); }
  else { insights.push('Durasi tidur rata-rata sudah cukup baik! 👍'); }

  if (consistency < 50) { insights.push('Jadwal tidur tidak konsisten. Usahakan tidur dan bangun di jam yang sama setiap hari.'); }
  if (trend === 'declining') { insights.push('Tren durasi tidur menurun. Perhatikan faktor yang mungkin mengganggu tidurmu.'); }

  return { avgDuration: Math.round(avgDuration * 10) / 10, consistency: Math.round(consistency), trend, riskLevel, insights };
}

export function getSleepQualityLabel(duration, quality) {
  if (quality === 'bad' || duration < 5) return { label: 'Kurang', color: '#F44336' };
  if (quality === 'good' && duration >= 7) return { label: 'Baik', color: '#4CAF50' };
  return { label: 'Cukup', color: '#FF9800' };
}

// ── Streak tidur berturut-turut ───────────────────────────────
export function calcStreak(records) {
  if (!records || !records.length) return 0;

  const recordedDates = new Set(
    records.map(r => new Date(r.date).toISOString().split('T')[0])
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Mulai dari hari ini; kalau belum ada catatan hari ini, mulai dari kemarin
  const startDay = new Date(today);
  if (!recordedDates.has(startDay.toISOString().split('T')[0])) {
    startDay.setDate(startDay.getDate() - 1);
  }

  let streak = 0;
  const checkDay = new Date(startDay);
  while (recordedDates.has(checkDay.toISOString().split('T')[0])) {
    streak++;
    checkDay.setDate(checkDay.getDate() - 1);
    if (streak > 365) break;
  }
  return streak;
}

// ── Perbandingan minggu ini vs minggu lalu ────────────────────
export function getWeeklyComparison(records) {
  const now = new Date();

  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - 6);
  thisWeekStart.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(now);
  lastWeekStart.setDate(now.getDate() - 13);
  lastWeekStart.setHours(0, 0, 0, 0);

  const lastWeekEnd = new Date(now);
  lastWeekEnd.setDate(now.getDate() - 7);
  lastWeekEnd.setHours(23, 59, 59, 999);

  const thisWeek = records.filter(r => new Date(r.date) >= thisWeekStart);
  const lastWeek = records.filter(r => {
    const d = new Date(r.date);
    return d >= lastWeekStart && d <= lastWeekEnd;
  });

  const avg = arr => arr.length
    ? Math.round((arr.reduce((s, r) => s + (r.duration || 0), 0) / arr.length) * 10) / 10
    : 0;

  const thisAvg = avg(thisWeek);
  const lastAvg = avg(lastWeek);
  const diff = Math.round((thisAvg - lastAvg) * 10) / 10;

  return {
    thisWeekAvg: thisAvg,
    lastWeekAvg: lastAvg,
    diff,
    thisWeekCount: thisWeek.length,
    lastWeekCount: lastWeek.length,
    trend: diff > 0.3 ? 'up' : diff < -0.3 ? 'down' : 'stable'
  };
}
