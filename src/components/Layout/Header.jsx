import { useApp } from '../../context/AppContext';
import { LuMenu, LuBell, LuSearch } from 'react-icons/lu';
import './Header.css';

const pageTitles = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
};

const pageDescriptions = {
  dashboard: 'Welcome back! Here\'s your financial overview.',
  transactions: 'Manage and track all your transactions.',
  insights: 'Understand your spending patterns and trends.',
};

export default function Header() {
  const { currentPage, toggleSidebar, filters, setFilter } = useApp();

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <LuMenu size={22} />
        </button>
        <div className="header-title-group">
          <h1 className="header-title">{pageTitles[currentPage]}</h1>
          <p className="header-subtitle">{pageDescriptions[currentPage]}</p>
        </div>
      </div>

      <div className="header-right">
        {currentPage === 'transactions' && (
          <div className="header-search">
            <LuSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="search-input"
            />
          </div>
        )}
        <button className="header-icon-btn notification-btn">
          <LuBell size={20} />
          <span className="notification-dot" />
        </button>
      </div>
    </header>
  );
}
