import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  Database, 
  Cpu, 
  Settings, 
  UserCircle, 
  LogOut 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Predict Risk', path: '/predict', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Loan Records', path: '/records', icon: Database },
    { name: 'Model Performance', path: '/model', icon: Cpu },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const bottomItems = [
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Logout', path: '/', icon: LogOut },
  ];

  const NavList = ({ items }) => (
    <ul className="nav-list">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <li key={item.name}>
            <Link 
              to={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <Activity className="logo-icon text-gradient" size={28} />
            <span className="logo-text text-gradient">LoanAI</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavList items={navItems} />
        </nav>

        <div className="sidebar-footer">
          <NavList items={bottomItems} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
