import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import Card from '../../components/Card/Card';
import EmptyState from '../../components/EmptyState/EmptyState';
import TransactionModal from '../../components/TransactionModal/TransactionModal';
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuFilter,
  LuArrowUpDown,
  LuDownload,
  LuSearch,
  LuX,
  LuChevronUp,
  LuChevronDown,
} from 'react-icons/lu';
import { format } from 'date-fns';
import './Transactions.css';

const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

export default function Transactions() {
  const {
    filteredTransactions,
    filters,
    setFilter,
    resetFilters,
    role,
    addTransaction,
    editTransaction,
    deleteTransaction,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const isAdmin = role === 'admin';

  const handleSort = (col) => {
    if (filters.sortBy === col) {
      setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setFilter('sortBy', col);
      setFilter('sortOrder', 'desc');
    }
  };

  const SortIcon = ({ col }) => {
    if (filters.sortBy !== col) return <LuArrowUpDown size={13} className="sort-icon-dim" />;
    return filters.sortOrder === 'asc' ? (
      <LuChevronUp size={14} className="sort-icon-active" />
    ) : (
      <LuChevronDown size={14} className="sort-icon-active" />
    );
  };

  const handleSave = (txnData) => {
    if (editingTxn) {
      editTransaction(txnData);
    } else {
      addTransaction(txnData);
    }
  };

  const handleExport = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filteredTransactions.map((t) => [
      t.date,
      `"${t.description}"`,
      CATEGORIES[t.category]?.label || t.category,
      t.type,
      t.amount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  }, [filters]);

  const totals = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = filteredTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [filteredTransactions]);

  return (
    <div className="transactions-page fade-in">
      {/* Top Bar */}
      <div className="txn-top-bar">
        <div className="txn-top-left">
          {/* Mobile search */}
          <div className="mobile-search">
            <LuSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="search-input"
            />
          </div>
          <button
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <LuFilter size={16} />
            <span>Filters</span>
            {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
          </button>
        </div>
        <div className="txn-top-right">
          <button className="btn btn-secondary btn-icon" onClick={handleExport}>
            <LuDownload size={16} />
            <span>Export CSV</span>
          </button>
          {isAdmin && (
            <button
              className="btn btn-primary btn-icon"
              onClick={() => {
                setEditingTxn(null);
                setModalOpen(true);
              }}
            >
              <LuPlus size={16} />
              <span>Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="filters-panel fade-in">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilter('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Type</label>
              <select value={filters.type} onChange={(e) => setFilter('type', e.target.value)}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="filter-group">
              <label>From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilter('dateFrom', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilter('dateTo', e.target.value)}
              />
            </div>
          </div>
          {activeFilterCount > 0 && (
            <button className="clear-filters" onClick={resetFilters}>
              <LuX size={14} />
              Clear all filters
            </button>
          )}
        </Card>
      )}

      {/* Summary Row */}
      <div className="txn-summary-row">
        <div className="txn-stat">
          <span className="txn-stat-label">Showing</span>
          <span className="txn-stat-value">{filteredTransactions.length} transactions</span>
        </div>
        <div className="txn-stat">
          <span className="txn-stat-label">Income</span>
          <span className="txn-stat-value income">+{formatCurrency(totals.income)}</span>
        </div>
        <div className="txn-stat">
          <span className="txn-stat-label">Expenses</span>
          <span className="txn-stat-value expense">-{formatCurrency(totals.expense)}</span>
        </div>
        <div className="txn-stat">
          <span className="txn-stat-label">Net</span>
          <span className={`txn-stat-value ${totals.net >= 0 ? 'income' : 'expense'}`}>
            {totals.net >= 0 ? '+' : ''}{formatCurrency(totals.net)}
          </span>
        </div>
      </div>

      {/* Table */}
      <Card padding={false} hover={false} className="txn-table-card">
        {filteredTransactions.length === 0 ? (
          <EmptyState
            title="No transactions found"
            message="Try adjusting your filters or search query to see results."
          />
        ) : (
          <div className="txn-table-wrap">
            <table className="txn-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')} className="sortable">
                    Date <SortIcon col="date" />
                  </th>
                  <th>Description</th>
                  <th onClick={() => handleSort('category')} className="sortable">
                    Category <SortIcon col="category" />
                  </th>
                  <th>Type</th>
                  <th onClick={() => handleSort('amount')} className="sortable right">
                    Amount <SortIcon col="amount" />
                  </th>
                  {isAdmin && <th className="right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id}>
                    <td className="td-date">{format(new Date(txn.date), 'dd MMM yyyy')}</td>
                    <td>
                      <div className="td-desc-wrap">
                        <span className="td-emoji">{CATEGORIES[txn.category]?.icon}</span>
                        <span className="td-desc">{txn.description}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="category-badge"
                        style={{
                          color: CATEGORIES[txn.category]?.color,
                          background: CATEGORIES[txn.category]?.color + '15',
                        }}
                      >
                        {CATEGORIES[txn.category]?.label}
                      </span>
                    </td>
                    <td>
                      <span className={`type-badge ${txn.type}`}>
                        {txn.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className={`td-amount ${txn.type}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </td>
                    {isAdmin && (
                      <td className="td-actions">
                        <button
                          className="action-btn edit"
                          onClick={() => {
                            setEditingTxn(txn);
                            setModalOpen(true);
                          }}
                          title="Edit"
                        >
                          <LuPencil size={15} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => {
                            if (window.confirm('Delete this transaction?')) deleteTransaction(txn.id);
                          }}
                          title="Delete"
                        >
                          <LuTrash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTxn(null);
        }}
        onSave={handleSave}
        transaction={editingTxn}
      />
    </div>
  );
}
