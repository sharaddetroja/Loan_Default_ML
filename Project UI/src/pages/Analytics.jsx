import { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Filter } from 'lucide-react';
import './Analytics.css';

// Mock Data
const defaultRatioData = [
  { name: 'Non-Default', value: 221128, color: 'var(--success)' },
  { name: 'Default', value: 34219, color: 'var(--danger)' }
];

const ageData = [
  { age: '18-25', rate: 18.5 },
  { age: '26-35', rate: 14.2 },
  { age: '36-45', rate: 11.8 },
  { age: '46-55', rate: 9.4 },
  { age: '56+', rate: 8.1 }
];

const employmentData = [
  { name: 'Full-time', rate: 10.5 },
  { name: 'Part-time', rate: 16.2 },
  { name: 'Self-employed', rate: 19.8 },
  { name: 'Unemployed', rate: 35.4 }
];

const creditScoreData = [
  { score: '300-500', rate: 45.2 },
  { score: '501-600', rate: 28.5 },
  { score: '601-700', rate: 12.4 },
  { score: '701-800', rate: 4.1 },
  { score: '801-850', rate: 1.2 }
];

const Analytics = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="analytics-container">
      <div className="page-header flex-between">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Explore demographic and financial trends in the dataset</p>
        </div>
        <button className="btn-secondary">
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="kpi-banner glass-panel">
        <div className="kpi-item">
          <span className="kpi-label">Total Records</span>
          <span className="kpi-value">255,347</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Defaulted</span>
          <span className="kpi-value text-danger">34,219</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Non-Defaulted</span>
          <span className="kpi-value text-success">221,128</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Global Default Rate</span>
          <span className="kpi-value">13.4%</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card glass-card">
          <div className="card-header">
            <h3>Default vs Non-Default</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={defaultRatioData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {defaultRatioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass-card">
          <div className="card-header">
            <h3>Default Rate by Credit Score</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={creditScoreData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="score" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="rate" stroke="var(--cyan)" strokeWidth={3} dot={{r: 6, fill: 'var(--bg-card)', strokeWidth: 2}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass-card">
          <div className="card-header">
            <h3>Default Rate by Age Group</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="age" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)', borderRadius: '8px' }}
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                />
                <Bar dataKey="rate" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass-card">
          <div className="card-header">
            <h3>Default Rate by Employment</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employmentData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} unit="%" />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)', borderRadius: '8px' }}
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                />
                <Bar dataKey="rate" fill="var(--purple)" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
