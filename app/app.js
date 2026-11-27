// DompetKeluarga — router and interactions. Hash routes:
//   #/            Dashboard
//   #/anggaran    Budget categories
//   #/transaksi   Transactions (with add/delete form)
//   #/tabungan    Savings goals
//   #/tagihan     Bills & reminders
//   #/laporan     Monthly report
// One delegated listener on #app handles every button and form, so
// re-rendering a route never leaves a dead control behind.

import { dashboard, anggaran, transaksi, tabungan, tagihan, laporan, missing } from './views.js';
import { setMonth, getMonth, addTransaction, deleteTransaction, setBudget, addSaving, setBillPaid } from './store.js';

const app = document.getElementById('app');
let txFilter = '';

const ROUTES = {
  '/': dashboard,
  '/anggaran': anggaran,
  '/transaksi': () => transaksi(txFilter),
  '/tabungan': tabungan,
  '/tagihan': tagihan,
  '/laporan': laporan,
};

const TITLES = {
  '/': 'Dashboard',
  '/anggaran': 'Anggaran',
  '/transaksi': 'Transaksi',
  '/tabungan': 'Tabungan',
  '/tagihan': 'Tagihan',
  '/laporan': 'Laporan',
};

function currentPath() {
  const hash = location.hash.replace(/^#/, '') || '/';
  return hash.split('?')[0];
}

function render() {
  window.__shotReady = false;
  const path = currentPath();
  const view = ROUTES[path];
  document.title = (view ? TITLES[path] + ' | ' : '') + 'DompetKeluarga — Anggaran Keluarga Prasetyo';
  app.innerHTML = view ? view() : missing();
  const links = document.querySelectorAll('nav a');
  links.forEach((a) => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('active', href === '#' + path);
  });
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function rerender() {
  render();
}

app.addEventListener('submit', (event) => {
  const form = event.target;
  const action = form.getAttribute('data-action');
  if (!action) return;
  event.preventDefault();
  const data = new FormData(form);

  if (action === 'add-tx') {
    const amount = Number(data.get('amount'));
    const desc = String(data.get('desc') || '').trim();
    const date = String(data.get('date') || '');
    const category = String(data.get('category') || '');
    if (!desc || !date || !category || !(amount > 0)) return;
    addTransaction({ date, desc, category, amount });
    const note = document.getElementById('tx-note');
    if (note) note.textContent = 'Tersimpan: ' + desc + ' sebesar Rp ' + amount.toLocaleString('id-ID') + '.';
    rerender();
  }

  if (action === 'budget') {
    const amount = Number(data.get('amount'));
    const category = form.getAttribute('data-category');
    if (category && amount >= 0) setBudget(category, amount);
    rerender();
  }

  if (action === 'add-saving') {
    const amount = Number(data.get('amount'));
    const goal = form.getAttribute('data-goal');
    if (goal && amount > 0) addSaving(goal, amount);
    rerender();
  }
});

app.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.getAttribute('data-action');

  if (action === 'delete-tx') {
    const id = button.getAttribute('data-id');
    if (id && window.confirm('Hapus transaksi ini?')) {
      deleteTransaction(id);
      rerender();
    }
  }

  if (action === 'toggle-bill') {
    const id = button.getAttribute('data-id');
    const nowPaid = button.textContent.trim() === 'Tandai lunas';
    if (id) {
      setBillPaid(id, nowPaid);
      rerender();
    }
  }
});

app.addEventListener('change', (event) => {
  const el = event.target;
  const action = el.getAttribute('data-action');
  if (action === 'month') {
    setMonth(el.value);
    rerender();
  }
  if (action === 'filter-tx') {
    txFilter = el.value;
    rerender();
  }
});

document.querySelector('nav').addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (link) txFilter = '';
});

window.addEventListener('hashchange', render);
render();
