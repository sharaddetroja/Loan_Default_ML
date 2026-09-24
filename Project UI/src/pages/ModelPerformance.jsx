import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Target, CheckCircle2, AlertTriangle, Zap, Box, Server, Database, Calendar } from 'lucide-react';
import './ModelPerformance.css';

const featureImportance = [
  { name: 'CreditScore', value: 0.28 },
  { name: 'DTIRatio', value: 0.22 },
  { name: 'Income', value: 0.15 },
  { name: 'LoanAmount', value: 0.12 },
  { name: 'InterestRate', value: 0.08 },
  { name: 'MonthsEmployed', value: 0.06 },
  { name: 'Age', value: 0.05 },
  { name: 'NumCreditLines', value: 0.04 },
];

const rocData = Array.from({ length: 20 }).map((_, i) => ({
  fpr: i / 19,
  tpr: Math.pow(i / 19, 0.4),
  baseline: i / 19
}));

const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className="metric-card glass-card">
    <div className="metric-header">
      <h3 className="metric-title">{title}</h3>
      <div className={`metric-icon ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="metric-value">{value}</div>
    <div className="metric-subtitle">{subtitle}</div>
  </div>
);

const ModelPerformance = () => {
  return (
    <div className="performance-container">
      <div className="page-header">
        <h1>Model Performance</h1>
        <p>Evaluation metrics for the XGBoost Random Forest classifier</p>
      </div>

      <div className="metrics-grid">
        <MetricCard 
          title="Accuracy" 
          value="92.4%" 
          subtitle="+1.2% from prev model"
          icon={Target}
          colorClass="text-primary"
        />
        <MetricCard 
          title="Precision" 
          value="89.1%" 
          subtitle="True positive rate"
          icon={CheckCircle2}
          colorClass="text-success"
        />
        <MetricCard 
          title="Recall" 
          value="85.3%" 
          subtitle="False negative rate: 14.7%"
          icon={AlertTriangle}
          colorClass="text-warning"
        />
        <MetricCard 
          title="F1 Score" 
          value="0.87" 
          subtitle="Harmonic mean"
          icon={Zap}
          colorClass="text-purple"
        />
        <MetricCard 
          title="ROC-AUC" 
          value="0.94" 
          subtitle="Excellent discrimination"
          icon={Box}
          colorClass="text-cyan"
        />
      </div>

      <div className="charts-grid-perf">
        <div className="chart-card glass-card">
          <div className="card-header">
            <h3>Feature Importance</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureImportance} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)', fontSize: 12}} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                  formatter={(value) => [(value * 100).toFixed(1) + '%', 'Importance']}
                />
                <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass-card">
          <div className="card-header">
            <h3>ROC Curve</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={rocData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTpr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--purple)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="fpr" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: 'var(--text-secondary)' }} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }} />
                <Area type="monotone" dataKey="tpr" stroke="var(--purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorTpr)" name="XGBoost" />
                <Line type="linear" dataKey="baseline" stroke="var(--text-tertiary)" strokeDasharray="5 5" dot={false} name="Random" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="model-info-grid">
        <div className="confusion-matrix glass-card">
          <div className="card-header">
            <h3>Confusion Matrix</h3>
          </div>
          <div className="matrix-container">
            <div className="matrix-grid">
              <div className="matrix-cell empty"></div>
              <div className="matrix-cell header">Predicted Negative</div>
              <div className="matrix-cell header">Predicted Positive</div>
              
              <div className="matrix-cell header rotate">Actual Negative</div>
              <div className="matrix-cell tn">
                <span className="value">42,501</span>
                <span className="label">True Negative</span>
              </div>
              <div className="matrix-cell fp">
                <span className="value">1,724</span>
                <span className="label">False Positive</span>
              </div>
              
              <div className="matrix-cell header rotate">Actual Positive</div>
              <div className="matrix-cell fn">
                <span className="value">982</span>
                <span className="label">False Negative</span>
              </div>
              <div className="matrix-cell tp">
                <span className="value">5,862</span>
                <span className="label">True Positive</span>
              </div>
            </div>
          </div>
        </div>

        <div className="model-metadata glass-card">
          <div className="card-header">
            <h3>Model Information</h3>
          </div>
          <div className="metadata-list">
            <div className="metadata-item">
              <div className="meta-icon"><Server size={18} /></div>
              <div className="meta-content">
                <span className="meta-label">Algorithm</span>
                <span className="meta-value">XGBoost Classifier (v1.7.5)</span>
              </div>
            </div>
            <div className="metadata-item">
              <div className="meta-icon"><Database size={18} /></div>
              <div className="meta-content">
                <span className="meta-label">Training Dataset</span>
                <span className="meta-value">Loan_default.csv (80/20 split)</span>
              </div>
            </div>
            <div className="metadata-item">
              <div className="meta-icon"><Box size={18} /></div>
              <div className="meta-content">
                <span className="meta-label">Features / Records</span>
                <span className="meta-value">18 Features / 255,347 Records</span>
              </div>
            </div>
            <div className="metadata-item">
              <div className="meta-icon"><Calendar size={18} /></div>
              <div className="meta-content">
                <span className="meta-label">Last Trained</span>
                <span className="meta-value">October 12, 2024 (2 days ago)</span>
              </div>
            </div>
          </div>
          <button className="btn-secondary w-full mt-4">Retrain Model</button>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformance;
