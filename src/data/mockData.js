export const CATEGORIES = {
  food: { label: 'Food & Dining', color: '#f97316', icon: '🍔' },
  transport: { label: 'Transport', color: '#3b82f6', icon: '🚗' },
  shopping: { label: 'Shopping', color: '#a855f7', icon: '🛍️' },
  bills: { label: 'Bills & Utilities', color: '#ef4444', icon: '📄' },
  entertainment: { label: 'Entertainment', color: '#ec4899', icon: '🎬' },
  health: { label: 'Health', color: '#14b8a6', icon: '💊' },
  salary: { label: 'Salary', color: '#22c55e', icon: '💰' },
  freelance: { label: 'Freelance', color: '#06b6d4', icon: '💻' },
  investment: { label: 'Investment', color: '#eab308', icon: '📈' },
  other: { label: 'Other', color: '#6b7280', icon: '📌' },
};

let txnId = 1;
function t(date, desc, category, type, amount) {
  return { id: txnId++, date, description: desc, category, type, amount };
}

export const initialTransactions = [
  // January 2026
  t('2026-01-02', 'Monthly Salary', 'salary', 'income', 85000),
  t('2026-01-03', 'Grocery Store', 'food', 'expense', 3200),
  t('2026-01-05', 'Electricity Bill', 'bills', 'expense', 2400),
  t('2026-01-06', 'Uber Ride', 'transport', 'expense', 450),
  t('2026-01-08', 'Netflix Subscription', 'entertainment', 'expense', 649),
  t('2026-01-10', 'Freelance Project - UI Design', 'freelance', 'income', 15000),
  t('2026-01-11', 'Restaurant Dinner', 'food', 'expense', 1800),
  t('2026-01-13', 'Gym Membership', 'health', 'expense', 2500),
  t('2026-01-15', 'Amazon Purchase', 'shopping', 'expense', 4300),
  t('2026-01-17', 'Internet Bill', 'bills', 'expense', 1100),
  t('2026-01-18', 'Metro Card Recharge', 'transport', 'expense', 500),
  t('2026-01-20', 'Movie Tickets', 'entertainment', 'expense', 700),
  t('2026-01-22', 'Mutual Fund SIP', 'investment', 'expense', 10000),
  t('2026-01-24', 'Coffee Shop', 'food', 'expense', 350),
  t('2026-01-26', 'Book Purchase', 'shopping', 'expense', 890),
  t('2026-01-28', 'Doctor Visit', 'health', 'expense', 1500),
  t('2026-01-30', 'Freelance Project - Landing Page', 'freelance', 'income', 8000),

  // February 2026
  t('2026-02-01', 'Monthly Salary', 'salary', 'income', 85000),
  t('2026-02-02', 'Grocery Store', 'food', 'expense', 2800),
  t('2026-02-04', 'Gas Bill', 'bills', 'expense', 900),
  t('2026-02-05', 'Ola Ride', 'transport', 'expense', 380),
  t('2026-02-07', 'Spotify Subscription', 'entertainment', 'expense', 119),
  t('2026-02-09', 'Online Course - React Advanced', 'other', 'expense', 4500),
  t('2026-02-10', 'Lunch with Team', 'food', 'expense', 1200),
  t('2026-02-12', 'Electricity Bill', 'bills', 'expense', 2600),
  t('2026-02-14', 'Valentine Dinner', 'food', 'expense', 3500),
  t('2026-02-15', 'Freelance - Mobile App', 'freelance', 'income', 22000),
  t('2026-02-17', 'Shoes Purchase', 'shopping', 'expense', 3800),
  t('2026-02-19', 'Pharmacy', 'health', 'expense', 650),
  t('2026-02-20', 'Uber Ride', 'transport', 'expense', 520),
  t('2026-02-22', 'Mutual Fund SIP', 'investment', 'expense', 10000),
  t('2026-02-24', 'Concert Tickets', 'entertainment', 'expense', 2500),
  t('2026-02-26', 'Grocery Store', 'food', 'expense', 2900),
  t('2026-02-28', 'Internet Bill', 'bills', 'expense', 1100),

  // March 2026
  t('2026-03-01', 'Monthly Salary', 'salary', 'income', 85000),
  t('2026-03-02', 'Investment Dividend', 'investment', 'income', 5500),
  t('2026-03-03', 'Grocery Store', 'food', 'expense', 3100),
  t('2026-03-05', 'Water Bill', 'bills', 'expense', 400),
  t('2026-03-06', 'Auto Rickshaw', 'transport', 'expense', 200),
  t('2026-03-08', 'YouTube Premium', 'entertainment', 'expense', 149),
  t('2026-03-10', 'Freelance - API Integration', 'freelance', 'income', 18000),
  t('2026-03-11', 'Street Food', 'food', 'expense', 450),
  t('2026-03-13', 'Gym Membership', 'health', 'expense', 2500),
  t('2026-03-15', 'Flipkart Purchase', 'shopping', 'expense', 6200),
  t('2026-03-17', 'Electricity Bill', 'bills', 'expense', 2300),
  t('2026-03-18', 'Fuel', 'transport', 'expense', 2000),
  t('2026-03-20', 'Movie Night', 'entertainment', 'expense', 850),
  t('2026-03-22', 'Mutual Fund SIP', 'investment', 'expense', 10000),
  t('2026-03-24', 'Bakery', 'food', 'expense', 600),
  t('2026-03-25', 'T-shirt Purchase', 'shopping', 'expense', 1200),
  t('2026-03-27', 'Blood Test', 'health', 'expense', 1800),
  t('2026-03-28', 'Freelance - Dashboard Design', 'freelance', 'income', 12000),
  t('2026-03-30', 'Internet Bill', 'bills', 'expense', 1100),
  t('2026-03-31', 'Cab to Airport', 'transport', 'expense', 1500),
];

export const monthlyData = [
  { month: 'Oct', income: 78000, expenses: 42000, balance: 36000 },
  { month: 'Nov', income: 82000, expenses: 48000, balance: 34000 },
  { month: 'Dec', income: 95000, expenses: 55000, balance: 40000 },
  { month: 'Jan', income: 108000, expenses: 30339, balance: 77661 },
  { month: 'Feb', income: 107000, expenses: 37469, balance: 69531 },
  { month: 'Mar', income: 120500, expenses: 34349, balance: 86151 },
];
