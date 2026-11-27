// DompetKeluarga — one HTML renderer per route. Each function takes the
// current month data (and, where needed, goals or bills) and returns an
// HTML string. Buttons and forms carry data-action attributes; app.js
// wires them up with one delegated listener, so nothing here is dead.

import { rupiah, rupiahShort, percent, tanggalIndo, tanggalSingkat, daysBetween, escapeHtml } from './format.js';
import { FAMILY, TODAY, MONTH_ORDER, MONTHS } from './data.js';
import { getMonthData, getCategoryName, getGoals, getBills } from './store.js';

function monthOptions(currentKey) {
  return MONTH_ORDER.map((key) => {
    const selected = key === currentKey ? ' selected' : '';
    return `<option value="${key}"${selected}>${MONTHS[key].label}</option>`;
  }).join('');
}

function bar(pct, tone) {
  const capped = Math.max(0, Math.min(100, pct));
  const over = pct > 100;
  return `<div class="bar" role="img" aria-label="${pct}% dari anggaran">
    <div class="bar-fill ${tone || ''}${over ? ' over' : ''}" style="width:${capped}%"></div>
  </div>`;
}

export function dashboard() {
  const m = getMonthData();
  const goals = getGoals();
  const bills = getBills().filter((b) => !b.paid);
  const topCats = m.categories.slice().sort((a, b) => b.spent - a.spent).slice(0, 4);
  const recent = m.transactions.slice(0, 5);
  const savedTotal = goals.reduce((s, g) => s + g.saved, 0);
  const targetTotal = goals.reduce((s, g) => s + g.target, 0);

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">Anggaran keluarga &middot; ${escapeHtml(FAMILY.city)}</p>
      <h1>Selamat datang, ${escapeHtml(FAMILY.name)}</h1>
      <p class="lede">Uang masuk, uang keluar, dan tabungan — semuanya tercatat rapi di satu tempat, tanpa aplikasi berbayar.</p>
    </div>
    <label class="month-picker">Bulan
      <select id="month-select" data-action="month">${monthOptions(m.key)}</select>
    </label>
  </section>

  <section class="cards" aria-label="Ringkasan bulan ini">
    <article class="card income"><p class="card-label">Pemasukan ${m.label}</p><p class="card-value">${rupiah(m.incomeTotal)}</p><p class="card-sub">${m.income.map((i) => escapeHtml(i.source) + ' ' + rupiahShort(i.amount)).join(' &middot; ')}</p></article>
    <article class="card expense"><p class="card-label">Pengeluaran ${m.label}</p><p class="card-value">${rupiah(m.spentTotal)}</p><p class="card-sub">${percent(m.spentTotal, m.incomeTotal)}% dari pemasukan</p></article>
    <article class="card remain"><p class="card-label">Sisa uang bulan ini</p><p class="card-value">${rupiah(m.remaining)}</p><p class="card-sub">Anggaran tersisa ${rupiah(m.budgetTotal - m.spentTotal)} dari ${rupiahShort(m.budgetTotal)}</p></article>
    <article class="card saving"><p class="card-label">Total tabungan tujuan</p><p class="card-value">${rupiah(savedTotal)}</p><p class="card-sub">${percent(savedTotal, targetTotal)}% dari target ${rupiahShort(targetTotal)}</p></article>
  </section>

  <div class="two-col">
    <section class="panel">
      <div class="panel-head"><h2>Pengeluaran terbesar</h2><a class="link" href="#/anggaran">Lihat semua kategori &rarr;</a></div>
      ${topCats.map((c) => `
      <div class="row-line">
        <div class="row-top"><span>${escapeHtml(c.name)}</span><span><strong>${rupiahShort(c.spent)}</strong> / ${rupiahShort(c.budget)}</span></div>
        ${bar(percent(c.spent, c.budget))}
        <p class="row-sub">${percent(c.spent, c.budget)}% terpakai &middot; sisa ${rupiah(c.budget - c.spent)}</p>
      </div>`).join('')}
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Tagihan belum dibayar</h2><a class="link" href="#/tagihan">Semua tagihan &rarr;</a></div>
      ${bills.length === 0
        ? '<p class="empty">Semua tagihan bulan ini sudah lunas. Bagus sekali!</p>'
        : bills.map((b) => {
            const days = daysBetween(TODAY, b.due);
            const when = days < 0 ? 'terlambat ' + Math.abs(days) + ' hari' : days === 0 ? 'jatuh tempo hari ini' : days + ' hari lagi';
            return `<div class="row-line"><div class="row-top"><span>${escapeHtml(b.name)}</span><strong>${rupiah(b.amount)}</strong></div>
            <p class="row-sub">Jatuh tempo ${tanggalIndo(b.due)} &middot; <span class="warn">${when}</span></p></div>`;
          }).join('')}
      <div class="panel-head" style="margin-top:1.2rem"><h2>Transaksi terakhir</h2><a class="link" href="#/transaksi">Semua transaksi &rarr;</a></div>
      ${recent.map((t) => `<div class="row-line"><div class="row-top"><span>${escapeHtml(t.desc)}</span><strong>&minus;${rupiah(t.amount)}</strong></div>
      <p class="row-sub">${tanggalIndo(t.date)} &middot; ${escapeHtml(getCategoryName(t.category))}</p></div>`).join('')}
    </section>
  </div>

  <section class="panel">
    <div class="panel-head"><h2>Tabungan tujuan</h2><a class="link" href="#/tabungan">Kelola tabungan &rarr;</a></div>
    <div class="goal-grid">
      ${goals.map((g) => `
      <div class="goal-mini">
        <p class="row-top"><span>${escapeHtml(g.name)}</span><strong>${percent(g.saved, g.target)}%</strong></p>
        ${bar(percent(g.saved, g.target), 'save')}
        <p class="row-sub">${rupiahShort(g.saved)} dari ${rupiahShort(g.target)}</p>
      </div>`).join('')}
    </div>
  </section>`;
}

export function anggaran() {
  const m = getMonthData();
  return `
  <section class="page-head">
    <h1>Anggaran ${m.label}</h1>
    <p class="lede">Delapan pos belanja keluarga. Total anggaran ${rupiah(m.budgetTotal)}, sudah terpakai ${rupiah(m.spentTotal)} (${percent(m.spentTotal, m.budgetTotal)}%). Ubah angka anggaran kapan saja — perubahan tersimpan di perangkat ini.</p>
  </section>
  <div class="cat-grid">
    ${m.categories.map((c) => {
      const pct = percent(c.spent, c.budget);
      const left = c.budget - c.spent;
      const status = pct >= 100 ? '<span class="badge bad">Anggaran habis</span>' : pct >= 80 ? '<span class="badge warn">Hampir habis</span>' : '<span class="badge ok">Aman</span>';
      return `<article class="panel cat-card">
        <div class="panel-head"><h2>${escapeHtml(c.name)}</h2>${status}</div>
        <p class="big">${rupiahShort(c.spent)} <span class="muted">dari ${rupiahShort(c.budget)}</span></p>
        ${bar(pct)}
        <p class="row-sub">${pct}% terpakai &middot; ${left >= 0 ? 'sisa ' + rupiah(left) : 'lebih ' + rupiah(-left)}</p>
        <p class="row-sub">${escapeHtml(c.note)}</p>
        <form class="inline-form" data-action="budget" data-category="${c.id}">
          <label>Ubah anggaran <input type="number" name="amount" min="0" step="50000" value="${c.budget}" required></label>
          <button type="submit" class="btn small">Simpan</button>
        </form>
      </article>`;
    }).join('')}
  </div>
  <p class="tip">Tips: pos yang sudah 100% seperti Pendidikan Anak dan Cicilan Motor memang sengaja dibayar penuh di awal bulan, jadi tidak perlu khawatir.</p>`;
}

export function transaksi(filterCat) {
  const m = getMonthData();
  const cats = m.categories;
  const shown = filterCat ? m.transactions.filter((t) => t.category === filterCat) : m.transactions;
  const shownTotal = shown.reduce((s, t) => s + t.amount, 0);
  return `
  <section class="page-head">
    <h1>Transaksi ${m.label}</h1>
    <p class="lede">${shown.length} transaksi, total ${rupiah(shownTotal)}. Catat pengeluaran baru di bawah — langsung masuk ke hitungan anggaran dan laporan.</p>
  </section>

  <section class="panel">
    <h2>Catat pengeluaran baru</h2>
    <form class="form-grid" data-action="add-tx">
      <label>Tanggal <input type="date" name="date" value="${TODAY}" required></label>
      <label>Keterangan <input type="text" name="desc" maxlength="80" placeholder="Misal: Belanja pasar pagi" required></label>
      <label>Kategori
        <select name="category">${cats.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}</select>
      </label>
      <label>Jumlah (Rp) <input type="number" name="amount" min="1000" step="1000" placeholder="150000" required></label>
      <button type="submit" class="btn">+ Tambah transaksi</button>
    </form>
    <p class="form-note" id="tx-note" aria-live="polite"></p>
  </section>

  <section class="panel">
    <div class="panel-head">
      <h2>Daftar transaksi</h2>
      <label class="filter">Saring kategori
        <select data-action="filter-tx">
          <option value="">Semua kategori</option>
          ${cats.map((c) => `<option value="${c.id}"${filterCat === c.id ? ' selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
        </select>
      </label>
    </div>
    ${shown.length === 0
      ? '<p class="empty">Belum ada transaksi untuk kategori ini di bulan ini.</p>'
      : `<table class="tx-table">
        <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>
        <tbody>
        ${shown.map((t) => `<tr>
          <td>${tanggalSingkat(t.date)}</td>
          <td>${escapeHtml(t.desc)}</td>
          <td>${escapeHtml(getCategoryName(t.category))}</td>
          <td class="num">&minus;${rupiah(t.amount)}</td>
          <td><button class="btn danger small" data-action="delete-tx" data-id="${t.id}">Hapus</button></td>
        </tr>`).join('')}
        </tbody>
      </table>`}
  </section>`;
}

export function tabungan() {
  const goals = getGoals();
  const savedTotal = goals.reduce((s, g) => s + g.saved, 0);
  const targetTotal = goals.reduce((s, g) => s + g.target, 0);
  return `
  <section class="page-head">
    <h1>Tabungan Tujuan</h1>
    <p class="lede">Tiga tujuan keluarga: sudah terkumpul ${rupiah(savedTotal)} dari target ${rupiah(targetTotal)} (${percent(savedTotal, targetTotal)}%). Tambah tabungan kapan saja — progres langsung berubah.</p>
  </section>
  <div class="cat-grid">
    ${goals.map((g) => {
      const pct = percent(g.saved, g.target);
      const left = g.target - g.saved;
      return `<article class="panel cat-card">
        <div class="panel-head"><h2>${escapeHtml(g.name)}</h2><span class="badge ${pct >= 100 ? 'ok' : 'warn'}">${pct}%</span></div>
        <p class="big">${rupiah(g.saved)} <span class="muted">dari ${rupiah(g.target)}</span></p>
        ${bar(pct, 'save')}
        <p class="row-sub">${left > 0 ? 'Kurang ' + rupiah(left) + ' lagi' : 'Target tercapai!'}</p>
        <p class="row-sub">${escapeHtml(g.note)}</p>
        <form class="inline-form" data-action="add-saving" data-goal="${g.id}">
          <label>Tambah tabungan (Rp) <input type="number" name="amount" min="1000" step="1000" placeholder="100000" required></label>
          <button type="submit" class="btn small">+ Tabung</button>
        </form>
      </article>`;
    }).join('')}
  </div>
  <p class="tip">Keluarga Prasetyo menyisihkan Rp 1.000.000 tiap awal bulan ke Dana Darurat, lalu sisanya dibagi ke tiga tujuan di atas setelah semua tagihan lunas.</p>`;
}

export function tagihan() {
  const bills = getBills();
  const unpaid = bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const paidTotal = bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  return `
  <section class="page-head">
    <h1>Tagihan &amp; Pengingat</h1>
    <p class="lede">Masih ada ${unpaid.length} tagihan belum dibayar senilai ${rupiah(unpaidTotal)}. Sudah lunas ${rupiah(paidTotal)} bulan ini. Ketuk tombol untuk menandai tagihan sudah dibayar.</p>
  </section>
  <section class="panel">
    <table class="tx-table">
      <thead><tr><th>Tagihan</th><th>Jatuh tempo</th><th class="num">Jumlah</th><th>Status</th><th></th></tr></thead>
      <tbody>
      ${bills.map((b) => {
        const days = daysBetween(TODAY, b.due);
        let status;
        if (b.paid) status = '<span class="badge ok">Lunas</span>';
        else if (days < 0) status = '<span class="badge bad">Terlambat ' + Math.abs(days) + ' hari</span>';
        else if (days === 0) status = '<span class="badge bad">Jatuh tempo hari ini</span>';
        else if (days <= 3) status = '<span class="badge warn">' + days + ' hari lagi</span>';
        else status = '<span class="badge">Akan datang</span>';
        return `<tr>
          <td>${escapeHtml(b.name)}</td>
          <td>${tanggalIndo(b.due)}</td>
          <td class="num">${rupiah(b.amount)}</td>
          <td>${status}</td>
          <td><button class="btn small" data-action="toggle-bill" data-id="${b.id}">${b.paid ? 'Batalkan lunas' : 'Tandai lunas'}</button></td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>
  </section>
  <p class="tip">Internet &amp; TV Kabel jatuh tempo 25 November — kemarin — jadi segera dibayar supaya tidak kena denda. BPJS Kesehatan jatuh tempo 28 November, masih ada waktu 2 hari.</p>`;
}

export function laporan() {
  const m = getMonthData();
  const sorted = m.categories.slice().sort((a, b) => b.spent - a.spent);
  const max = sorted.length ? sorted[0].spent : 1;
  const biggest = sorted[0];
  const cheapest = sorted[sorted.length - 1];
  const over = m.categories.filter((c) => c.spent >= c.budget);
  const under = m.categories.filter((c) => c.spent < c.budget * 0.6);
  return `
  <section class="page-head">
    <h1>Laporan ${m.label}</h1>
    <p class="lede">Pemasukan ${rupiah(m.incomeTotal)}, pengeluaran ${rupiah(m.spentTotal)}, sisa ${rupiah(m.remaining)} (${percent(m.remaining, m.incomeTotal)}% dari pemasukan tidak terpakai).</p>
  </section>

  <section class="panel">
    <h2>Pengeluaran per kategori</h2>
    <div class="chart">
      ${sorted.map((c) => `
      <div class="chart-row">
        <span class="chart-label">${escapeHtml(c.name)}</span>
        <div class="chart-track"><div class="chart-fill" style="width:${Math.round((c.spent / max) * 100)}%"></div></div>
        <span class="chart-value">${rupiahShort(c.spent)} <span class="muted">(${percent(c.spent, m.spentTotal)}%)</span></span>
      </div>`).join('')}
    </div>
  </section>

  <div class="two-col">
    <section class="panel">
      <h2>Yang perlu diperhatikan</h2>
      <ul class="findings">
        <li><strong>Pengeluaran terbesar:</strong> ${escapeHtml(biggest.name)} — ${rupiah(biggest.spent)} (${percent(biggest.spent, m.spentTotal)}% dari semua pengeluaran).</li>
        <li><strong>Pos paling hemat:</strong> ${escapeHtml(cheapest.name)} — hanya ${rupiah(cheapest.spent)} dari anggaran ${rupiah(cheapest.budget)}.</li>
        ${over.length ? `<li><strong>Anggaran habis:</strong> ${over.map((c) => escapeHtml(c.name)).join(', ')} sudah 100% terpakai — wajar, karena dibayar penuh di awal bulan.</li>` : ''}
        ${under.length ? `<li><strong>Masih longgar:</strong> ${under.map((c) => escapeHtml(c.name)).join(', ')} terpakai di bawah 60% — sisanya bisa dipindah ke tabungan.</li>` : ''}
        <li><strong>Sisa uang:</strong> ${rupiah(m.remaining)} belum terpakai. Kalau dipindah ke Dana Pendidikan Anak, progresnya naik ${percent(m.remaining, 25000000)}%.</li>
      </ul>
    </section>
    <section class="panel">
      <h2>Pemasukan vs pengeluaran</h2>
      <div class="chart-row"><span class="chart-label">Pemasukan</span><div class="chart-track"><div class="chart-fill income-fill" style="width:100%"></div></div><span class="chart-value">${rupiahShort(m.incomeTotal)}</span></div>
      <div class="chart-row"><span class="chart-label">Pengeluaran</span><div class="chart-track"><div class="chart-fill expense-fill" style="width:${percent(m.spentTotal, m.incomeTotal)}%"></div></div><span class="chart-value">${rupiahShort(m.spentTotal)}</span></div>
      <div class="chart-row"><span class="chart-label">Sisa</span><div class="chart-track"><div class="chart-fill save-fill" style="width:${percent(m.remaining, m.incomeTotal)}%"></div></div><span class="chart-value">${rupiahShort(m.remaining)}</span></div>
      <p class="row-sub" style="margin-top:1rem">Bulan lalu (Oktober 2026) pengeluaran keluarga Rp 7.850.000 dari pemasukan Rp 12.000.000 — bulan ini pengeluaran ${m.spentTotal < 7850000 ? 'lebih hemat' : 'sedikit lebih besar'} dari bulan lalu.</p>
      <p><a class="btn" href="#/transaksi">Catat pengeluaran baru</a></p>
    </section>
  </div>`;
}

export function missing() {
  return `<section class="page-head"><h1>Halaman tidak ditemukan</h1>
  <p class="lede">Alamat yang dibuka tidak ada di DompetKeluarga.</p>
  <p><a class="btn" href="#/">Kembali ke Dashboard</a></p></section>`;
}
