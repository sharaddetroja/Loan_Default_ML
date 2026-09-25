import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Download, FileText, ShieldCheck, AlertTriangle,
  Activity, Trees, Sliders
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MODEL_KEYS } from '../services/loanPrediction';
import './Result.css';

const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  const num = Number(val);
  return num <= 1 ? `${(num * 100).toFixed(2)}%` : `${num.toFixed(2)}%`;
};

const getNumericPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return 0;
  const num = Number(val);
  return num <= 1 ? num * 100 : num;
};

const MODEL_ICONS = {
  logistic_regression: Activity,
  random_forest: Trees,
  decision_tree: Trees,
  adaboost: Activity,
  bagging: Sliders
};

const MODEL_ICON_CLASS = {
  logistic_regression: 'icon-logistic',
  random_forest: 'icon-rf',
  decision_tree: 'icon-dt',
  adaboost: 'icon-ada',
  bagging: 'icon-bag'
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const mlResult = location.state?.mlResult;

  if (!formData) {
    return (
      <div className="no-data glass-panel">
        <h2>No prediction data found</h2>
        <p>Please fill out the prediction form first.</p>
        <button onClick={() => navigate('/predict')} className="btn-primary">Go to Predict Risk</button>
      </div>
    );
  }

  const isHighRisk = mlResult ? mlResult.prediction === 1 : false;
  const overallRiskStatus = mlResult?.risk_status || (isHighRisk ? 'High Risk (Default)' : 'Low Risk (No Default)');
  const selectedModel = mlResult?.selected_model || formData.model || 'both';

  // Collect all model results from backend response
  const modelResults = [];
  for (const key of MODEL_KEYS) {
    if (mlResult?.[key]) {
      modelResults.push({ key, ...mlResult[key] });
    }
  }

  // Calculate overall probability from available models
  let overallProbNum = 0;
  if (modelResults.length > 0) {
    const sum = modelResults.reduce((acc, m) => acc + getNumericPercent(m.probability), 0);
    overallProbNum = sum / modelResults.length;
  }

  const riskScoreInt = Math.round(overallProbNum);
  const riskColor = isHighRisk ? 'var(--danger)' : 'var(--success)';
  const RiskIcon = isHighRisk ? AlertTriangle : ShieldCheck;
  const gaugeData = [
    { name: 'Risk', value: riskScoreInt, color: riskColor },
    { name: 'Safe', value: Math.max(0, 100 - riskScoreInt), color: 'var(--bg-tertiary)' },
  ];

  const handleDownloadReport = () => {
    let modelsText = '';
    modelResults.forEach((m, i) => {
      modelsText += `\n${i + 1}. ${m.name}:\n   - Prediction: ${m.prediction} (${m.prediction === 1 ? 'Default' : 'No Default'})\n   - Probability: ${formatPercent(m.probability)}\n   - Risk Status: ${m.risk_status}\n`;
    });

    const reportContent = `
LOAN DEFAULT PREDICTION REPORT
------------------------------
Date: ${new Date().toLocaleDateString()}
Selected Model: ${selectedModel.toUpperCase()}
Overall Risk Status: ${overallRiskStatus}
Overall Avg Probability: ${formatPercent(overallProbNum)}

MODEL BREAKDOWN:${modelsText}
BORROWER DETAILS:
- Age: ${formData.age}
- Education: ${formData.education}
- Employment: ${formData.employmentType}
- Marital Status: ${formData.maritalStatus}
- Has Dependents: ${formData.hasDependents}
- Annual Income: $${Number(formData.income).toLocaleString()}
- Credit Score: ${formData.creditScore}
- DTI Ratio: ${formData.dtiRatio}%
- Months Employed: ${formData.monthsEmployed}
- Credit Lines: ${formData.numCreditLines}

LOAN DETAILS:
- Amount: $${Number(formData.loanAmount).toLocaleString()}
- Term: ${formData.loanTerm} Months
- Interest Rate: ${formData.interestRate}%
- Purpose: ${formData.loanPurpose}
- Has Mortgage: ${formData.hasMortgage}
- Has Co-Signer: ${formData.hasCoSigner}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan_prediction_report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="result-container animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>AI Loan Risk Result</h1>
          <p>Evaluation results from live Flask ML API on Render</p>
        </div>
        <div className="header-actions">
          <Link to="/predict" className="btn-secondary"><ArrowLeft size={18} /> New Prediction</Link>
          <button className="btn-secondary" onClick={handleDownloadReport}><Download size={18} /> Download Report</button>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="result-grid">
        <div className={`main-result glass-card risk-border-${isHighRisk ? 'danger' : 'success'}`}>
          <div className="card-badge">Overall Prediction</div>
          <div className="gauge-container">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie data={gaugeData} cx="50%" cy="92%" startAngle={180} endAngle={0} innerRadius={85} outerRadius={115} paddingAngle={0} dataKey="value" stroke="none" cornerRadius={4}>
                  {gaugeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="gauge-value">
              <span className="score">{riskScoreInt}</span>
              <span className="max">/ 100</span>
            </div>
          </div>
          <div className="result-status" style={{ color: riskColor }}>
            <RiskIcon size={44} className="status-icon" />
            <h2>{overallRiskStatus.toUpperCase()}</h2>
          </div>
          <div className="metrics-row">
            <div className="metric"><span className="label">Prediction</span><span className="value badge-code">{mlResult?.prediction ?? '–'}</span></div>
            <div className="metric"><span className="label">Avg Probability</span><span className="value">{formatPercent(overallProbNum)}</span></div>
            <div className="metric"><span className="label">Selected</span><span className="value capitalize">{selectedModel === 'all' ? 'All Models' : selectedModel.replace('_', ' ')}</span></div>
          </div>
        </div>

        {/* Model Cards */}
        <div className="models-breakdown-container">
          <h3>Model Evaluation ({modelResults.length} model{modelResults.length !== 1 ? 's' : ''})</h3>
          <div className="model-cards-wrapper">
            {modelResults.map((m) => {
              const MIcon = MODEL_ICONS[m.key] || Activity;
              const iconClass = MODEL_ICON_CLASS[m.key] || 'icon-logistic';
              return (
                <div key={m.key} className="model-result-card glass-card">
                  <div className="model-card-top">
                    <div className="model-title-group"><MIcon size={20} className={iconClass} /><h4>{m.name}</h4></div>
                    <span className={`status-pill ${m.prediction === 1 ? 'danger' : 'success'}`}>{m.risk_status}</span>
                  </div>
                  <div className="model-stats-grid">
                    <div className="model-stat-item"><span className="stat-label">Prediction</span><strong className="stat-value">{m.prediction}</strong></div>
                    <div className="model-stat-item"><span className="stat-label">Probability</span><strong className="stat-value">{formatPercent(m.probability)}</strong></div>
                    <div className="model-stat-item"><span className="stat-label">Risk</span><strong className="stat-value">{m.risk_status}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {modelResults.length > 1 && (
        <div className="comparison-section glass-card">
          <div className="card-header">
            <h3><Sliders size={20} /> Model Comparison Table</h3>
            <span className="badge badge-primary">Comparative Analysis</span>
          </div>
          <div className="table-responsive">
            <table className="comparison-table">
              <thead>
                <tr><th>Model</th><th>Prediction</th><th>Default Probability</th><th>Risk Status</th></tr>
              </thead>
              <tbody>
                {modelResults.map((m) => {
                  const MIcon = MODEL_ICONS[m.key] || Activity;
                  const iconClass = MODEL_ICON_CLASS[m.key] || 'icon-logistic';
                  return (
                    <tr key={m.key}>
                      <td><div className="table-model-name"><MIcon size={18} className={iconClass} /><strong>{m.name}</strong></div></td>
                      <td><code>{m.prediction}</code></td>
                      <td><strong>{formatPercent(m.probability)}</strong></td>
                      <td><span className={`status-pill ${m.prediction === 1 ? 'danger' : 'success'}`}>{m.risk_status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Borrower Summary */}
      <div className="details-card glass-card">
        <div className="card-header"><h3><FileText size={20} /> Submitted Borrower Parameters</h3></div>
        <div className="summary-grid">
          <div className="summary-group">
            <h4>Borrower Profile</h4>
            <div className="data-row"><span>Age:</span> <strong>{formData.age} yrs</strong></div>
            <div className="data-row"><span>Education:</span> <strong>{formData.education}</strong></div>
            <div className="data-row"><span>Employment:</span> <strong>{formData.employmentType}</strong></div>
            <div className="data-row"><span>Marital Status:</span> <strong>{formData.maritalStatus}</strong></div>
            <div className="data-row"><span>Dependents:</span> <strong>{formData.hasDependents}</strong></div>
            <div className="data-row"><span>Months Employed:</span> <strong>{formData.monthsEmployed}</strong></div>
          </div>
          <div className="summary-group">
            <h4>Financial Profile</h4>
            <div className="data-row"><span>Income:</span> <strong>${Number(formData.income).toLocaleString()}</strong></div>
            <div className="data-row"><span>Credit Score:</span> <strong>{formData.creditScore}</strong></div>
            <div className="data-row"><span>DTI Ratio:</span> <strong>{formData.dtiRatio}%</strong></div>
            <div className="data-row"><span>Credit Lines:</span> <strong>{formData.numCreditLines}</strong></div>
            <div className="data-row"><span>Mortgage:</span> <strong>{formData.hasMortgage}</strong></div>
            <div className="data-row"><span>Co-Signer:</span> <strong>{formData.hasCoSigner}</strong></div>
          </div>
          <div className="summary-group">
            <h4>Loan Details</h4>
            <div className="data-row"><span>Amount:</span> <strong>${Number(formData.loanAmount).toLocaleString()}</strong></div>
            <div className="data-row"><span>Term:</span> <strong>{formData.loanTerm} Months</strong></div>
            <div className="data-row"><span>Interest Rate:</span> <strong>{formData.interestRate}%</strong></div>
            <div className="data-row"><span>Purpose:</span> <strong>{formData.loanPurpose}</strong></div>
            <div className="data-row"><span>ML Model:</span> <strong>{selectedModel === 'all' ? 'All Models' : selectedModel.toUpperCase()}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
