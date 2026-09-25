import { User, Mail, Shield, Key, Bell, LogOut, Camera } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="page-header">
        <h1>Profile Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-grid">
        <div className="profile-sidebar">
          <div className="profile-card glass-card">
            <div className="profile-image-container">
              <div className="profile-image">
                <User size={48} />
              </div>
              <button className="edit-image-btn">
                <Camera size={16} />
              </button>
            </div>
            <div className="profile-info-center">
              <h2>Sharad Detroja</h2>
              <p className="role-badge">Senior Risk Analyst</p>
              <p className="text-secondary">sharad.detroja@loanai.inc</p>
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
            <button className="nav-btn text-danger">
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
            
            <form className="settings-form" onSubmit={(e) => { e.preventDefault(); alert('Profile updated successfully!'); }}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="glass-input" defaultValue="Sharad" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="glass-input" defaultValue="Detroja" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input type="email" className="glass-input with-icon" defaultValue="sharad.detroja@loanai.inc" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <input type="text" className="glass-input" defaultValue="Senior Risk Analyst" disabled />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>

          <div className="settings-section glass-card">
            <div className="section-header">
              <h3>Change Password</h3>
              <p>Ensure your account is using a long, random password to stay secure.</p>
            </div>
            
            <form className="settings-form" onSubmit={(e) => { e.preventDefault(); alert('Password updated successfully!'); }}>
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
