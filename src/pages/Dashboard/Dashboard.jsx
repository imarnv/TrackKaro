import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, monthlyData } from '../../data/mockData';
import Card from '../../components/Card/Card';
import {
  LuWallet,
  LuTrendingUp,
  LuTrendingDown,
  LuPiggyBank,
  LuArrowUpRight,
  LuArrowDownRight,
} from 'react-icons/lu';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import './Dashboard.css';

const formatCurrency = (val) => {
  if (val >= 100000) return '₹' + (val / 100000).toFixed(1) + 'L';
  if (val >= 1000) return '₹' + (val / 1000).toFixed(1) + 'K';
  return '₹' + val.toLocaleString('en-IN');
};

const formatFullCurrency = (val) => '₹' + val.toLocaleString('en-IN');

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {formatFullCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="chart-tooltip">
      <p style={{ color: payload[0].payload.color }}>
        {payload[0].name}: {formatFullCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { transactions, totalBalance, totalIncome, totalExpenses, savingsRate, setPage } = useApp();

  const summaryCards = [
    {
      title: 'Total Balance',
      value: formatFullCurrency(totalBalance),
      change: '+12.5%',
      positive: true,
      icon: LuWallet,
      color: 'primary',
    },
    {
      title: 'Total Income',
      value: formatFullCurrency(totalIncome),
      change: '+8.2%',
      positive: true,
      icon: LuTrendingUp,
      color: 'green',
    },
    {
      title: 'Total Expenses',
      value: formatFullCurrency(totalExpenses),
      change: '-3.1%',
      positive: false,
      icon: LuTrendingDown,
      color: 'red',
    },
    {
      title: 'Savings Rate',
      value: savingsRate.toFixed(1) + '%',
      change: '+5.4%',
      positive: true,
      icon: LuPiggyBank,
      color: 'orange',
    },
  ];

  const categoryBreakdown = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .map(([key, value]) => ({
        name: CATEGORIES[key]?.label || key,
        value,
        color: CATEGORIES[key]?.color || '#6b7280',
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  }, [transactions]);

  return (
    <div className="dashboard fade-in">
      {/* Summary Cards */}
      <div className="summary-cards stagger-children">
        {summaryCards.map((card) => (
          <Card key={card.title} className={`summary-card summary-${card.color}`}>
            <div className="summary-top">
              <div className={`summary-icon-wrap bg-${card.color}`}>
                <card.icon size={20} />
              </div>
              <span className={`summary-change ${card.positive ? 'positive' : 'negative'}`}>
                {card.positive ? <LuArrowUpRight size={14} /> : <LuArrowDownRight size={14} />}
                {card.change}
              </span>
            </div>
            <div className="summary-value">{card.value}</div>
            <div className="summary-label">{card.title}</div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Balance Trend */}
        <Card className="chart-card balance-chart">
          <div className="card-header">
            <div>
              <h3 className="card-title">Balance Trend</h3>
              <p className="card-subtitle">Last 6 months overview</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                  tickFormatter={(v) => formatCurrency(v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#incomeGrad)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fill="url(#expenseGrad)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Spending Breakdown */}
        <Card className="chart-card pie-chart">
          <div className="card-header">
            <div>
              <h3 className="card-title">Spending Breakdown</h3>
              <p className="card-subtitle">By category</p>
            </div>
          </div>
          <div className="chart-container pie-container">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryBreakdown.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="recent-txn-card" padding={false}>
        <div className="card-header" style={{ padding: '20px 22px 12px' }}>
          <div>
            <h3 className="card-title">Recent Transactions</h3>
            <p className="card-subtitle">Your latest financial activity</p>
          </div>
          <button className="view-all-btn" onClick={() => setPage('transactions')}>
            View All
          </button>
        </div>
        <div className="recent-txn-list">
          {recentTransactions.map((txn) => (
            <div key={txn.id} className="recent-txn-item">
              <div className="txn-icon-wrap" style={{ background: CATEGORIES[txn.category]?.color + '18', color: CATEGORIES[txn.category]?.color }}>
                <span>{CATEGORIES[txn.category]?.icon}</span>
              </div>
              <div className="txn-info">
                <span className="txn-desc">{txn.description}</span>
                <span className="txn-meta">
                  {CATEGORIES[txn.category]?.label} · {format(new Date(txn.date), 'dd MMM yyyy')}
                </span>
              </div>
              <span className={`txn-amount ${txn.type}`}>
                {txn.type === 'income' ? '+' : '-'}{formatFullCurrency(txn.amount)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
