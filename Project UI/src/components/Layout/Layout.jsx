import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Don't show sidebar/navbar on the login page
  if (location.pathname === '/') {
    return <Outlet />;
  }

  return (
    <div className="layout-container">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className="main-content">
        <div className="content-wrapper">
          <Navbar onMenuClick={toggleSidebar} />
          <div className="page-content">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
