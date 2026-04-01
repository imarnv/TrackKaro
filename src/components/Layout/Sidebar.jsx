import { useApp } from '../../context/AppContext';
import {
  LuLayoutDashboard,
  LuArrowLeftRight,
  LuLightbulb,
  LuSun,
  LuMoon,
  LuShield,
  LuEye,
  LuX,
  LuHexagon,
} from 'react-icons/lu';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: LuArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: LuLightbulb },
];

export default function Sidebar() {
  const { currentPage, setPage, role, setRole, theme, toggleTheme, sidebarOpen, toggleSidebar } =
    useApp();

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <span className="rupee-icon">₹</span>
            </div>
            <div className="logo-text">
              <span className="logo-name hindi-logo">
                <span className="logo-track">Track</span> करो
              </span>
              <span className="logo-sub">Finance Dashboard</span>
            </div>
          </div>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <LuX size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-label">Menu</span>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="role-switcher">
            <span className="nav-label">Role</span>
            <div className="role-toggle">
              <button
                className={`role-btn ${role === 'viewer' ? 'active' : ''}`}
                onClick={() => setRole('viewer')}
              >
                <LuEye size={14} />
                <span>Viewer</span>
              </button>
              <button
                className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                onClick={() => setRole('admin')}
              >
                <LuShield size={14} />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <LuMoon size={18} /> : <LuSun size={18} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          <div className="sidebar-profile">
            <div className="profile-avatar">AM</div>
            <div className="profile-info">
              <span className="profile-name">Arnav Mehta</span>
              <span className="profile-role">{role === 'admin' ? 'Administrator' : 'Viewer'}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
