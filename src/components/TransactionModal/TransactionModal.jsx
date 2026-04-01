import { useState, useEffect } from 'react';
import { LuX } from 'react-icons/lu';
import { CATEGORIES } from '../../data/mockData';
import './TransactionModal.css';

const expenseCategories = ['food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'investment', 'other'];
const incomeCategories = ['salary', 'freelance', 'investment', 'other'];

export default function TransactionModal({ isOpen, onClose, onSave, transaction = null }) {
  const isEdit = !!transaction;
  const [form, setForm] = useState({
    date: '',
    description: '',
    category: 'food',
    type: 'expense',
    amount: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
        amount: String(transaction.amount),
      });
    } else {
      setForm({ date: new Date().toISOString().split('T')[0], description: '', category: 'food', type: 'expense', amount: '' });
    }
    setErrors({});
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const categories = form.type === 'income' ? incomeCategories : expenseCategories;

  const validate = () => {
    const errs = {};
    if (!form.date) errs.date = 'Date is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid amount';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...(transaction || {}),
      date: form.date,
      description: form.description.trim(),
      category: form.category,
      type: form.type,
      amount: Number(form.amount),
    });
    onClose();
  };

  const handleTypeChange = (type) => {
    const cats = type === 'income' ? incomeCategories : expenseCategories;
    setForm((f) => ({
      ...f,
      type,
      category: cats.includes(f.category) ? f.category : cats[0],
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="modal-close" onClick={onClose}>
            <LuX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={`type-btn expense ${form.type === 'expense' ? 'active' : ''}`}
                  onClick={() => handleTypeChange('expense')}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`type-btn income ${form.type === 'income' ? 'active' : ''}`}
                  onClick={() => handleTypeChange('income')}
                >
                  Income
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="e.g., Grocery shopping"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
