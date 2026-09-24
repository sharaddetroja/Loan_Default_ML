import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    
    // Format user account name
    let accountName = name.trim();
    if (!accountName && email) {
      // Derive name from email prefix if signing in without explicit name
      const prefix = email.split('@')[0];
      accountName = prefix.split(/[\._]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    if (!accountName) {
      accountName = 'Sharad Detroja';
    }

    const userData = {
      name: accountName,
      email: email.trim() || 'sharad.detroja@loanai.inc'
    };

    // Store user account session in localStorage
    localStorage.setItem('loan_user', JSON.stringify(userData));

    // Simulate authentication / account creation delay
    setTimeout(() => {
      setIsLoading(false);
      if (isSignUp) {
        setSuccessMessage(`Account created for ${accountName}! Logging in...`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        navigate('/dashboard');
      }
    }, 1000);
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsSignUp(!isSignUp);
    setSuccessMessage('');
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="illustration-wrapper">
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
          <div className="abstract-shape shape-3"></div>
          
          <div className="brand-header">
            <Activity className="logo-icon text-gradient" size={48} />
            <h1 className="brand-title">LoanAI</h1>
          </div>
          
          <div className="illustration-content">
            <h2 className="hero-title">Predict Loan Risk <br />with AI</h2>
            <p className="hero-subtitle">
              Make smarter lending decisions using our advanced machine learning models. 
              Analyze thousands of data points in seconds.
            </p>
          </div>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-card glass-card">
          <div className="login-header">
            <h3>{isSignUp ? 'Create an Account' : 'Welcome Back'}</h3>
            <p>{isSignUp ? 'Enter your details to register a new account' : 'Enter your credentials to access the dashboard'}</p>
          </div>

          {successMessage && (
            <div className="success-banner flex-center" style={{ gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--success)', borderRadius: '8px', color: 'var(--success)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <CheckCircle size={18} />
              <span>{successMessage}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="form-group animate-fade-in">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input 
                    type="text" 
                    className="glass-input with-icon" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input 
                  type="email" 
                  className="glass-input with-icon" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input 
                  type="password" 
                  className="glass-input with-icon" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {!isSignUp && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="forgot-link">Forgot password?</a>
              </div>
            )}
            
            <button type="submit" className="btn-primary login-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            
            <p className="signup-prompt">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={toggleMode} className="text-btn">
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button type="button" onClick={toggleMode} className="text-btn">
                    Create account
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
