import { useState, useEffect } from 'react';
import { User, Mail, Shield, Key, Bell, LogOut, Camera, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Sharad Detroja');
  const [email, setEmail] = useState('sharad.detroja@loanai.inc');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('loan_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
      }
    } catch {
      // Fallback default
    }
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { name: name.trim(), email: email.trim() };
    localStorage.setItem('loan_user', JSON.stringify(updatedUser));
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('loan_user');
    navigate('/');
  };

  const nameParts = name.split(' ');
  const firstName = nameParts[0] || 'Sharad';
  const lastName = nameParts.slice(1).join(' ') || 'Detroja';

  return (
    <div className="profile-container">
      <div className="page-header">
        <h1>Profile Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      {message && (
        <div className="success-banner flex-center" style={{ gap: '0.5rem', padding: '0.85rem 1.25rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--success)', borderRadius: '10px', color: 'var(--success)', marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      <div className="profile-grid">
        <div className="profile-sidebar">
          <div className="profile-card glass-card">
            <div className="profile-image-container">
              <div className="profile-image">
                <User size={48} />
              </div>
              <button className="edit-image-btn" title="Change Avatar">
                <Camera size={16} />
              </button>
            </div>
            <div className="profile-info-center">
              <h2>{name}</h2>
              <p className="role-badge">Senior Risk Analyst</p>
              <p className="text-secondary">{email}</p>
            </div>
          </div>

          <div className="settings-nav glass-card">
            <button className="nav-btn active">
              <User size={18} /> Personal Information
            </button>
            <button className="nav-btn">
              <Shield size={18} /> Security
            </button>
            <button className="nav-btn">
              <Bell size={18} /> Notifications
            </button>
            <div className="nav-divider"></div>
            <button className="nav-btn text-danger" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <div className="profile-content">
          <div className="settings-section glass-card">
            <div className="section-header">
              <h3>Personal Information</h3>
              <p>Update your personal details and public profile.</p>
            </div>
            
            <form className="settings-form" onSubmit={handleSaveProfile}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    value={firstName} 
                    onChange={(e) => setName(`${e.target.value} ${lastName}`.trim())}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    value={lastName} 
                    onChange={(e) => setName(`${firstName} ${e.target.value}`.trim())}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input 
                    type="email" 
                    className="glass-input with-icon" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <input type="text" className="glass-input" value="Senior Risk Analyst" disabled />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>

          <div className="settings-section glass-card">
            <div className="section-header">
              <h3>Change Password</h3>
              <p>Ensure your account is using a long, random password to stay secure.</p>
            </div>
            
            <form className="settings-form" onSubmit={(e) => { e.preventDefault(); setMessage('Password updated successfully!'); setTimeout(() => setMessage(''), 3000); }}>
              <div className="form-group">
                <label>Current Password</label>
                <div className="input-wrapper">
                  <Key className="input-icon" size={18} />
                  <input type="password" className="glass-input with-icon" placeholder="••••••••" />
                </div>
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <div className="input-wrapper">
                  <Key className="input-icon" size={18} />
                  <input type="password" className="glass-input with-icon" placeholder="••••••••" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-wrapper">
                  <Key className="input-icon" size={18} />
                  <input type="password" className="glass-input with-icon" placeholder="••••••••" />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
