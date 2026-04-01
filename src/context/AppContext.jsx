import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { initialTransactions } from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_KEY_THEME = 'finDash_theme';
const STORAGE_KEY_TXN = 'finDash_transactions';

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved) return saved;
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TXN);
    if (saved) return JSON.parse(saved);
  } catch {}
  return initialTransactions;
}

const initialState = {
  transactions: getInitialTransactions(),
  role: 'admin',
  theme: getInitialTheme(),
  currentPage: 'dashboard',
  filters: {
    category: 'all',
    type: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc',
  },
  sidebarOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload, sidebarOpen: false };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, [action.key]: action.value } };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: { ...initialState.filters },
      };
    case 'ADD_TRANSACTION': {
      const newId = Math.max(0, ...state.transactions.map((t) => t.id)) + 1;
      const newTxn = { ...action.payload, id: newId };
      return { ...state, transactions: [newTxn, ...state.transactions] };
    }
    case 'EDIT_TRANSACTION': {
      const txns = state.transactions.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      return { ...state, transactions: txns };
    }
    case 'DELETE_TRANSACTION': {
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    try { localStorage.setItem(STORAGE_KEY_THEME, state.theme); } catch {}
  }, [state.theme]);

  // persist transactions
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_TXN, JSON.stringify(state.transactions)); } catch {}
  }, [state.transactions]);

  // derived values
  const derived = useMemo(() => {
    const income = state.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = state.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    return { totalIncome: income, totalExpenses: expenses, totalBalance: balance, savingsRate };
  }, [state.transactions]);

  // filtered + sorted transactions
  const filteredTransactions = useMemo(() => {
    let list = [...state.transactions];
    const f = state.filters;

    if (f.category !== 'all') {
      list = list.filter((t) => t.category === f.category);
    }
    if (f.type !== 'all') {
      list = list.filter((t) => t.type === f.type);
    }
    if (f.search) {
      const q = f.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    if (f.dateFrom) {
      list = list.filter((t) => t.date >= f.dateFrom);
    }
    if (f.dateTo) {
      list = list.filter((t) => t.date <= f.dateTo);
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (f.sortBy === 'date') cmp = a.date.localeCompare(b.date);
      else if (f.sortBy === 'amount') cmp = a.amount - b.amount;
      else if (f.sortBy === 'category') cmp = a.category.localeCompare(b.category);
      return f.sortOrder === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [state.transactions, state.filters]);

  const actions = useMemo(
    () => ({
      setPage: (page) => dispatch({ type: 'SET_PAGE', payload: page }),
      setRole: (role) => dispatch({ type: 'SET_ROLE', payload: role }),
      toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
      toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
      setFilter: (key, value) => dispatch({ type: 'SET_FILTER', key, value }),
      resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
      addTransaction: (txn) => dispatch({ type: 'ADD_TRANSACTION', payload: txn }),
      editTransaction: (txn) => dispatch({ type: 'EDIT_TRANSACTION', payload: txn }),
      deleteTransaction: (id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id }),
    }),
    []
  );

  const value = useMemo(
    () => ({ ...state, ...derived, filteredTransactions, ...actions }),
    [state, derived, filteredTransactions, actions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
