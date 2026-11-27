// DompetKeluarga — state: seed data from data.js plus the household's
// own changes, kept in localStorage so edits survive a reload.
// Stored under one key: added transactions, deleted ids, budget
// overrides, extra savings and bill payment toggles.

import { MONTHS, SAVINGS_GOALS, BILLS, DEFAULT_MONTH } from './data.js';

const STORAGE_KEY = 'dompetkeluarga-v1';

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { added: [], deleted: [], budgets: {}, savings: {}, bills: {} };
    const parsed = JSON.parse(raw);
    return {
      added: Array.isArray(parsed.added) ? parsed.added : [],
      deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
      budgets: parsed.budgets || {},
      savings: parsed.savings || {},
      bills: parsed.bills || {},
    };
  } catch {
    return { added: [], deleted: [], budgets: {}, savings: {}, bills: {} };
  }
}

function saveStored(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the site still works for this session.
  }
}

let stored = loadStored();
let currentMonth = DEFAULT_MONTH;

export function getMonth() {
  return currentMonth;
}

export function setMonth(monthKey) {
  if (MONTHS[monthKey]) currentMonth = monthKey;
}

export function getMonthData() {
  const base = MONTHS[currentMonth];
  const added = stored.added.filter((t) => t.month === currentMonth);
  const txs = base.transactions
    .filter((t) => !stored.deleted.includes(t.id))
    .concat(added)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const categories = base.categories.map((c) => {
    const override = stored.budgets[c.id];
    const spent = txs
      .filter((t) => t.category === c.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      ...c,
      budget: typeof override === 'number' ? override : c.budget,
      spent,
    };
  });
  const incomeTotal = base.income.reduce((sum, row) => sum + row.amount, 0);
  const spentTotal = categories.reduce((sum, c) => sum + c.spent, 0);
  const budgetTotal = categories.reduce((sum, c) => sum + c.budget, 0);
  return {
    ...base,
    key: currentMonth,
    incomeTotal,
    spentTotal,
    budgetTotal,
    remaining: incomeTotal - spentTotal,
    transactions: txs,
    categories,
  };
}

export function getCategoryName(id) {
  const base = MONTHS[currentMonth];
  const found = base.categories.find((c) => c.id === id);
  return found ? found.name : id;
}

export function addTransaction(tx) {
  const entry = { ...tx, id: 'u' + Date.now().toString(36), month: currentMonth };
  stored.added.push(entry);
  saveStored(stored);
  return entry;
}

export function deleteTransaction(id) {
  stored.added = stored.added.filter((t) => t.id !== id);
  if (!stored.deleted.includes(id)) stored.deleted.push(id);
  saveStored(stored);
}

export function setBudget(categoryId, amount) {
  stored.budgets[categoryId] = amount;
  saveStored(stored);
}

export function getGoals() {
  return SAVINGS_GOALS.map((g) => ({
    ...g,
    saved: g.saved + (stored.savings[g.id] || 0),
  }));
}

export function addSaving(goalId, amount) {
  stored.savings[goalId] = (stored.savings[goalId] || 0) + amount;
  saveStored(stored);
}

export function getBills() {
  return BILLS.map((b) => ({
    ...b,
    paid: stored.bills[b.id] !== undefined ? stored.bills[b.id] : b.paid,
  }));
}

export function setBillPaid(billId, paid) {
  stored.bills[billId] = paid;
  saveStored(stored);
}

export function resetAll() {
  stored = { added: [], deleted: [], budgets: {}, savings: {}, bills: {} };
  saveStored(stored);
}
