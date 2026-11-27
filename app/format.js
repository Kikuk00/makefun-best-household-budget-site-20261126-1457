// DompetKeluarga — small formatting helpers used by every view.
// No dependencies: plain string and number work only.

export function rupiah(amount) {
  const n = Math.round(Number(amount) || 0);
  return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function rupiahShort(amount) {
  const n = Number(amount) || 0;
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
  if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + ' rb';
  return rupiah(n);
}

export function percent(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function tanggalIndo(isoDate) {
  const parts = String(isoDate).split('-');
  if (parts.length !== 3) return String(isoDate);
  const day = Number(parts[2]);
  const month = MONTH_NAMES[Number(parts[1]) - 1] || '';
  return day + ' ' + month + ' ' + parts[0];
}

export function tanggalSingkat(isoDate) {
  const parts = String(isoDate).split('-');
  if (parts.length !== 3) return String(isoDate);
  return Number(parts[2]) + ' ' + (MONTH_NAMES[Number(parts[1]) - 1] || '').slice(0, 3);
}

// Whole days from an ISO date to another ISO date (due - today).
export function daysBetween(fromIso, toIso) {
  const a = new Date(fromIso + 'T00:00:00');
  const b = new Date(toIso + 'T00:00:00');
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
