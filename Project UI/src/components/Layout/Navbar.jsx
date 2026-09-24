import { useEffect, useState } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const [userName, setUserName] = useState('Sharad Detroja');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('loan_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.name) {
          setUserName(parsed.name);
        }
      }
    } catch {
      // Fallback default
    }
  }, [location.pathname]);
  
  // Format the path to a readable title
  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path || path === 'dashboard') return 'Dashboard';
    
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="top-navbar glass-panel">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <h2 className="page-title">{getPageTitle()}</h2>
      </div>
      
      <div className="navbar-right">
        <button className="icon-btn relative">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">Risk Analyst</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
