import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Result from './pages/Result';
import Analytics from './pages/Analytics';
import LoanRecords from './pages/LoanRecords';
import LoanDetails from './pages/LoanDetails';
import ModelPerformance from './pages/ModelPerformance';
import Profile from './pages/Profile';
import './App.css';

function App() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div className="cursor-glow"></div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/result" element={<Result />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/records" element={<LoanRecords />} />
            <Route path="/records/:id" element={<LoanDetails />} />
            <Route path="/model" element={<ModelPerformance />} />
            <Route path="/settings" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
