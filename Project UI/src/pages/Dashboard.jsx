import { Link } from 'react-router-dom';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  CreditCard, 
  ArrowRight,
  Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const data = [
  { name: 'Jan', applications: 4000, defaults: 400 },
  { name: 'Feb', applications: 3000, defaults: 350 },
  { name: 'Mar', applications: 5000, defaults: 450 },
  { name: 'Apr', applications: 4500, defaults: 420 },
  { name: 'May', applications: 6000, defaults: 500 },
  { name: 'Jun', applications: 5500, defaults: 480 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendUp, colorClass }) => (
  <div className="stat-card glass-card">
    <div className="stat-header">
      <div className={`stat-icon-wrapper ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div className={`stat-trend ${trendUp ? 'positive' : 'negative'}`}>
        {trendUp ? '↑' : '↓'} {trend}
      </div>
    </div>
    <div className="stat-content">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="hero-section glass-panel">
        <div className="hero-content">
          <h1>AI-Powered Loan Risk Assessment</h1>
          <p>Analyze borrower information and predict the probability of loan default using our advanced machine learning model trained on 255,000+ records.</p>
          <Link to="/predict" className="btn-primary">
            <Activity size={20} />
            Predict Loan Risk
          </Link>
        </div>
        <div className="hero-illustration">
          <div className="pulse-ring"></div>
          <div className="pulse-ring delay-1"></div>
          <div className="pulse-ring delay-2"></div>
          <Activity size={48} className="hero-icon text-gradient" />
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Applications" 
          value="255,347" 
          icon={Users} 
          trend="12.5%" 
          trendUp={true}
          colorClass="icon-primary"
        />
        <StatCard 
          title="Defaulted Loans" 
          value="34,219" 
          icon={AlertTriangle} 
          trend="2.1%" 
          trendUp={false}
          colorClass="icon-danger"
        />
        <StatCard 
          title="Default Rate" 
          value="13.4%" 
          icon={TrendingUp} 
          trend="0.5%" 
          trendUp={true}
          colorClass="icon-warning"
        />
        <StatCard 
          title="Avg Credit Score" 
          value="685" 
          icon={CreditCard} 
          trend="15 pts" 
          trendUp={true}
          colorClass="icon-success"
        />
      </div>

      <div className="dashboard-grid">
        <div className="chart-card glass-card">
          <div className="card-header">
            <h3>Application Volume</h3>
            <span className="badge badge-primary">Last 6 Months</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="applications" stroke="var(--primary)" fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-activity-card glass-card">
          <div className="card-header flex-between">
            <h3>Recent Predictions</h3>
            <Link to="/records" className="view-all">View All <ArrowRight size={16} /></Link>
          </div>
          <div className="activity-list">
            {[
              { id: 'LN-8472', risk: 'LOW', score: 12, amount: '$45,000' },
              { id: 'LN-8471', risk: 'HIGH', score: 87, amount: '$12,500' },
              { id: 'LN-8470', risk: 'MEDIUM', score: 45, amount: '$28,000' },
              { id: 'LN-8469', risk: 'LOW', score: 8, amount: '$150,000' },
            ].map((item, i) => (
              <div key={i} className="activity-item">
                <div className="activity-info">
                  <div className="activity-id">{item.id}</div>
                  <div className="activity-amount">{item.amount}</div>
                </div>
                <div className={`badge badge-${item.risk === 'LOW' ? 'success' : item.risk === 'HIGH' ? 'danger' : 'warning'}`}>
                  {item.risk} RISK
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
