import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, monthlyData } from '../../data/mockData';
import Card from '../../components/Card/Card';
import {
  LuTrendingUp,
  LuTrendingDown,
  LuChartBar,
  LuTarget,
  LuCalendar,
  LuAward,
  LuArrowRight,
} from 'react-icons/lu';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import './Insights.css';

const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function Insights() {
  const { transactions } = useApp();

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const incomes = transactions.filter((t) => t.type === 'income');

    // Category totals
    const catMap = {};
    expenses.forEach((t) => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    const categoryList = Object.entries(catMap)
      .map(([key, total]) => ({
        key,
        label: CATEGORIES[key]?.label || key,
        icon: CATEGORIES[key]?.icon || '📌',
        color: CATEGORIES[key]?.color || '#6b7280',
        total,
      }))
      .sort((a, b) => b.total - a.total);

    const highestCategory = categoryList[0] || null;
    const lowestCategory = categoryList[categoryList.length - 1] || null;

    // Total
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);

    // Monthly breakdown from transactions
    const monthMap = {};
    transactions.forEach((t) => {
      const m = t.date.substring(0, 7); // YYYY-MM
      if (!monthMap[m]) monthMap[m] = { income: 0, expense: 0 };
      if (t.type === 'income') monthMap[m].income += t.amount;
      else monthMap[m].expense += t.amount;
    });
    const months = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([m, data]) => {
        const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const idx = parseInt(m.split('-')[1]) - 1;
        return { month: names[idx], ...data, savings: data.income - data.expense };
      });

    // Average daily spend
    const days = new Set(expenses.map((t) => t.date)).size || 1;
    const avgDailySpend = totalExpense / days;

    // Top 3 largest transactions
    const top3 = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 3);

    // Income vs Expense ratio
    const incomeExpenseRatio = totalIncome > 0 ? totalExpense / totalIncome : 0;

    // Category chart data (for bar chart)
    const categoryChartData = categoryList.slice(0, 6).map((c) => ({
      name: c.label.length > 12 ? c.label.substring(0, 12) + '…' : c.label,
      amount: c.total,
      color: c.color,
    }));

    return {
      categoryList,
      highestCategory,
      lowestCategory,
      totalExpense,
      totalIncome,
      months,
      avgDailySpend,
      top3,
      incomeExpenseRatio,
      categoryChartData,
    };
  }, [transactions]);

  return (
    <div className="insights-page fade-in">
      {/* Highlight Cards */}
      <div className="insight-highlights stagger-children">
        <Card className="highlight-card">
          <div className="highlight-icon-wrap" style={{ background: insights.highestCategory?.color + '18', color: insights.highestCategory?.color }}>
            <LuTrendingUp size={22} />
          </div>
          <div className="highlight-content">
            <span className="highlight-label">Highest Spending Category</span>
            <span className="highlight-value">
              {insights.highestCategory?.icon} {insights.highestCategory?.label}
            </span>
            <span className="highlight-amount">{formatCurrency(insights.highestCategory?.total || 0)}</span>
          </div>
        </Card>

        <Card className="highlight-card">
          <div className="highlight-icon-wrap" style={{ background: '#22c55e18', color: '#22c55e' }}>
            <LuCalendar size={22} />
          </div>
          <div className="highlight-content">
            <span className="highlight-label">Average Daily Spending</span>
            <span className="highlight-value">{formatCurrency(Math.round(insights.avgDailySpend))}</span>
            <span className="highlight-sub">across {new Set(transactions.filter(t => t.type === 'expense').map(t => t.date)).size} days</span>
          </div>
        </Card>

        <Card className="highlight-card">
          <div className="highlight-icon-wrap" style={{ background: '#635bff18', color: '#635bff' }}>
            <LuTarget size={22} />
          </div>
          <div className="highlight-content">
            <span className="highlight-label">Income to Expense Ratio</span>
            <span className="highlight-value">{(insights.incomeExpenseRatio * 100).toFixed(1)}%</span>
            <span className="highlight-sub">
              {insights.incomeExpenseRatio < 0.5 ? 'Excellent savings!' : insights.incomeExpenseRatio < 0.7 ? 'Good balance' : 'Consider cutting back'}
            </span>
          </div>
        </Card>

        <Card className="highlight-card">
          <div className="highlight-icon-wrap" style={{ background: '#f9731618', color: '#f97316' }}>
            <LuTrendingDown size={22} />
          </div>
          <div className="highlight-content">
            <span className="highlight-label">Lowest Spending Category</span>
            <span className="highlight-value">
              {insights.lowestCategory?.icon} {insights.lowestCategory?.label}
            </span>
            <span className="highlight-amount">{formatCurrency(insights.lowestCategory?.total || 0)}</span>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="insights-charts-row">
        {/* Monthly Comparison */}
        <Card className="insight-chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Monthly Comparison</h3>
              <p className="card-subtitle">Income vs Expenses by month</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.months} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickFormatter={(v) => '₹' + (v / 1000).toFixed(0) + 'K'} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={28} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Savings Trend */}
        <Card className="insight-chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Savings Trend</h3>
              <p className="card-subtitle">Monthly net savings over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickFormatter={(v) => '₹' + (v / 1000).toFixed(0) + 'K'} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="balance" name="Savings" stroke="#635bff" strokeWidth={3} dot={{ fill: '#635bff', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="insights-bottom-row">
        {/* Category Breakdown */}
        <Card className="insight-chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Category Breakdown</h3>
              <p className="card-subtitle">Top spending categories</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={insights.categoryChartData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} tickFormatter={(v) => '₹' + (v / 1000).toFixed(0) + 'K'} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} width={110} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="amount" name="Spent" radius={[0, 4, 4, 0]} barSize={20}>
                {insights.categoryChartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Transactions & Observations */}
        <div className="insights-side-col">
          <Card className="top-txn-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <LuAward size={18} style={{ marginRight: 6, verticalAlign: 'middle', color: 'var(--accent-orange)' }} />
                  Largest Expenses
                </h3>
              </div>
            </div>
            <div className="top-txn-list">
              {insights.top3.map((txn, i) => (
                <div key={txn.id} className="top-txn-item">
                  <span className="top-txn-rank">#{i + 1}</span>
                  <div className="top-txn-info">
                    <span className="top-txn-desc">{txn.description}</span>
                    <span className="top-txn-meta">{CATEGORIES[txn.category]?.label} · {txn.date}</span>
                  </div>
                  <span className="top-txn-amount">-{formatCurrency(txn.amount)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="observation-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <LuChartBar size={18} style={{ marginRight: 6, verticalAlign: 'middle', color: 'var(--accent-primary)' }} />
                  Key Observations
                </h3>
              </div>
            </div>
            <ul className="observation-list">
              <li>
                <LuArrowRight size={14} />
                <span>Your <strong>{insights.highestCategory?.label}</strong> spending is the highest — consider setting a monthly budget for this category.</span>
              </li>
              <li>
                <LuArrowRight size={14} />
                <span>Monthly savings have been <strong>trending upward</strong> over the past quarter, showing improved financial discipline.</span>
              </li>
              <li>
                <LuArrowRight size={14} />
                <span>You spend about <strong>{formatCurrency(Math.round(insights.avgDailySpend))}</strong> per day on average. Weekday spending tends to be lower than weekends.</span>
              </li>
              {insights.incomeExpenseRatio < 0.5 && (
                <li>
                  <LuArrowRight size={14} />
                  <span>Your expense-to-income ratio of <strong>{(insights.incomeExpenseRatio * 100).toFixed(0)}%</strong> is below 50% — excellent financial health!</span>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

