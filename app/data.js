// DompetKeluarga — seed data for Keluarga Prasetyo, November 2026.
// All figures are in Indonesian rupiah and internally consistent:
// every category's "spent" equals the sum of that month's transactions
// in the category, and the dashboard totals are the sums of the rows.
// October 2026 is kept as a second month so the month selector has
// real data to show instead of an empty page.

export const FAMILY = {
  name: 'Keluarga Prasetyo',
  members: 'Budi, Sari, dan dua anak',
  city: 'Yogyakarta',
  monthLabel: 'November 2026',
};

export const MONTHS = {
  '2026-11': {
    label: 'November 2026',
    income: [
      { source: 'Gaji Budi (karyawan toko)', amount: 9500000 },
      { source: 'Usaha sampingan Sari (katering)', amount: 3000000 },
    ],
    categories: [
      { id: 'belanja', name: 'Belanja Harian', budget: 3000000, spent: 1865000, note: 'Pasar, supermarket, warung' },
      { id: 'listrik', name: 'Listrik & Air', budget: 800000, spent: 462000, note: 'Token listrik, PDAM' },
      { id: 'transport', name: 'Transportasi', budget: 1200000, spent: 655000, note: 'Bensin, ojek, parkir, tol' },
      { id: 'pendidikan', name: 'Pendidikan Anak', budget: 1500000, spent: 1500000, note: 'SPP dan les' },
      { id: 'kesehatan', name: 'Kesehatan', budget: 600000, spent: 275000, note: 'Dokter, apotek, vitamin' },
      { id: 'hiburan', name: 'Hiburan', budget: 500000, spent: 320000, note: 'Streaming, nonton, jalan-jalan' },
      { id: 'cicilan', name: 'Cicilan Motor', budget: 1800000, spent: 1800000, note: 'Cicilan tetap tiap bulan' },
      { id: 'darurat', name: 'Dana Darurat', budget: 1000000, spent: 1000000, note: 'Disisihkan di awal bulan' },
    ],
    transactions: [
      { id: 't01', date: '2026-11-01', desc: 'SPP sekolah + les matematika', category: 'pendidikan', amount: 1500000 },
      { id: 't02', date: '2026-11-03', desc: 'Belanja bulanan supermarket', category: 'belanja', amount: 890000 },
      { id: 't03', date: '2026-11-05', desc: 'Token listrik 300 ribu', category: 'listrik', amount: 300000 },
      { id: 't04', date: '2026-11-08', desc: 'Bensin mobil', category: 'transport', amount: 350000 },
      { id: 't05', date: '2026-11-09', desc: 'Supermarket mingguan', category: 'belanja', amount: 420000 },
      { id: 't06', date: '2026-11-10', desc: 'Cicilan motor bulan November', category: 'cicilan', amount: 1800000 },
      { id: 't07', date: '2026-11-12', desc: 'Tagihan air PDAM', category: 'listrik', amount: 162000 },
      { id: 't08', date: '2026-11-14', desc: 'Langganan streaming + nonton', category: 'hiburan', amount: 320000 },
      { id: 't09', date: '2026-11-15', desc: 'Bensin motor', category: 'transport', amount: 120000 },
      { id: 't10', date: '2026-11-16', desc: 'Belanja pasar pagi', category: 'belanja', amount: 185000 },
      { id: 't11', date: '2026-11-17', desc: 'Dokter anak + obat apotek', category: 'kesehatan', amount: 275000 },
      { id: 't12', date: '2026-11-21', desc: 'Ojek online + parkir', category: 'transport', amount: 185000 },
      { id: 't13', date: '2026-11-23', desc: 'Supermarket mingguan', category: 'belanja', amount: 370000 },
      { id: 't14', date: '2026-11-25', desc: 'Pindah ke tabungan darurat', category: 'darurat', amount: 1000000 },
    ],
  },
  '2026-10': {
    label: 'Oktober 2026',
    income: [
      { source: 'Gaji Budi (karyawan toko)', amount: 9000000 },
      { source: 'Usaha sampingan Sari (katering)', amount: 3000000 },
    ],
    categories: [
      { id: 'belanja', name: 'Belanja Harian', budget: 3000000, spent: 2010000, note: 'Pasar, supermarket, warung' },
      { id: 'listrik', name: 'Listrik & Air', budget: 800000, spent: 590000, note: 'Token listrik, PDAM' },
      { id: 'transport', name: 'Transportasi', budget: 1200000, spent: 710000, note: 'Bensin, ojek, parkir, tol' },
      { id: 'pendidikan', name: 'Pendidikan Anak', budget: 1500000, spent: 1500000, note: 'SPP dan les' },
      { id: 'kesehatan', name: 'Kesehatan', budget: 600000, spent: 0, note: 'Dokter, apotek, vitamin' },
      { id: 'hiburan', name: 'Hiburan', budget: 500000, spent: 240000, note: 'Streaming, nonton, jalan-jalan' },
      { id: 'cicilan', name: 'Cicilan Motor', budget: 1800000, spent: 1800000, note: 'Cicilan tetap tiap bulan' },
      { id: 'darurat', name: 'Dana Darurat', budget: 1000000, spent: 1000000, note: 'Disisihkan di awal bulan' },
    ],
    transactions: [
      { id: 'o01', date: '2026-10-02', desc: 'SPP sekolah + les matematika', category: 'pendidikan', amount: 1500000 },
      { id: 'o02', date: '2026-10-04', desc: 'Belanja bulanan supermarket', category: 'belanja', amount: 920000 },
      { id: 'o03', date: '2026-10-06', desc: 'Token listrik 300 ribu', category: 'listrik', amount: 300000 },
      { id: 'o04', date: '2026-10-09', desc: 'Bensin mobil + tol', category: 'transport', amount: 410000 },
      { id: 'o05', date: '2026-10-10', desc: 'Cicilan motor bulan Oktober', category: 'cicilan', amount: 1800000 },
      { id: 'o06', date: '2026-10-12', desc: 'Nonton bioskop keluarga', category: 'hiburan', amount: 240000 },
      { id: 'o07', date: '2026-10-18', desc: 'Supermarket mingguan', category: 'belanja', amount: 640000 },
      { id: 'o08', date: '2026-10-20', desc: 'Tagihan air PDAM', category: 'listrik', amount: 290000 },
      { id: 'o09', date: '2026-10-23', desc: 'Bensin motor', category: 'transport', amount: 300000 },
      { id: 'o10', date: '2026-10-25', desc: 'Belanja pasar pagi', category: 'belanja', amount: 450000 },
      { id: 'o11', date: '2026-10-26', desc: 'Pindah ke tabungan darurat', category: 'darurat', amount: 1000000 },
    ],
  },
};

// Savings goals are shared across months; "saved" grows when the
// household adds money from the Tabungan page.
export const SAVINGS_GOALS = [
  { id: 'g1', name: 'Dana Pendidikan Anak', target: 25000000, saved: 14250000, note: 'Untuk biaya masuk SMP tahun depan' },
  { id: 'g2', name: 'Renovasi Dapur', target: 15000000, saved: 6800000, note: 'Ganti atap bocor dan kompor' },
  { id: 'g3', name: 'Liburan Keluarga', target: 8000000, saved: 5400000, note: 'Ke pantai akhir tahun, naik kereta' },
];

// Bills for November 2026. "today" is fixed to 2026-11-26 so the
// due-date status (lunas / jatuh tempo / akan datang) is stable.
export const TODAY = '2026-11-26';

export const BILLS = [
  { id: 'b1', name: 'SPP Sekolah Anak', due: '2026-11-01', amount: 1500000, paid: true },
  { id: 'b2', name: 'Cicilan Motor', due: '2026-11-10', amount: 1800000, paid: true },
  { id: 'b3', name: 'Air PDAM', due: '2026-11-12', amount: 162000, paid: true },
  { id: 'b4', name: 'Listrik PLN', due: '2026-11-20', amount: 312000, paid: true },
  { id: 'b5', name: 'Internet & TV Kabel', due: '2026-11-25', amount: 385000, paid: false },
  { id: 'b6', name: 'BPJS Kesehatan', due: '2026-11-28', amount: 210000, paid: false },
];

export const DEFAULT_MONTH = '2026-11';
export const MONTH_ORDER = ['2026-11', '2026-10'];
