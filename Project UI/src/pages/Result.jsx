import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  Activity,
  Trees,
  Sliders
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './Result.css';

/**
 * Format probability value into a human-readable percentage.
 * Converts 0.1234 -> "12.34%" without double-multiplying values > 1.
 */
const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  const num = Number(val);
  const pct = num <= 1 ? num * 100 : num;
  return `${pct.toFixed(2)}%`;
};

const getNumericPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return 0;
  const num = Number(val);
  return num <= 1 ? num * 100 : num;
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
        <p>Please fill out the loan default prediction form to view results.</p>
        <button onClick={() => navigate('/predict')} className="btn-primary">
          Go to Predict Risk
        </button>
      </div>
    );
  }

  // Extract overall prediction & risk status from backend response
  const isHighRisk = mlResult ? (mlResult.prediction === 1 || mlResult.prediction === '1') : (formData.creditScore < 650);
  const overallRiskStatus = mlResult?.risk_status || (isHighRisk ? 'High Risk (Default)' : 'Low Risk (No Default)');
  
  // Calculate overall risk probability percentage (0 to 100)
  let overallProbNum = 15;
  if (mlResult) {
    if (mlResult.random_forest?.probability !== undefined && mlResult.logistic_regression?.probability !== undefined) {
      const rfProb = getNumericPercent(mlResult.random_forest.probability);
      const lrProb = getNumericPercent(mlResult.logistic_regression.probability);
      overallProbNum = (rfProb + lrProb) / 2;
    } else if (mlResult.random_forest?.probability !== undefined) {
      overallProbNum = getNumericPercent(mlResult.random_forest.probability);
    } else if (mlResult.logistic_regression?.probability !== undefined) {
      overallProbNum = getNumericPercent(mlResult.logistic_regression.probability);
    } else if (mlResult.probability !== undefined) {
      overallProbNum = getNumericPercent(mlResult.probability);
    } else if (mlResult.riskScore !== undefined) {
      overallProbNum = Number(mlResult.riskScore);
    }
  }

  const riskScoreInt = Math.round(overallProbNum);
  const riskColor = isHighRisk ? 'var(--danger)' : 'var(--success)';
  const RiskIcon = isHighRisk ? AlertTriangle : ShieldCheck;

  const gaugeData = [
    { name: 'Risk', value: riskScoreInt, color: riskColor },
    { name: 'Safe', value: Math.max(0, 100 - riskScoreInt), color: 'var(--bg-tertiary)' },
  ];

  const logReg = mlResult?.logistic_regression;
  const rf = mlResult?.random_forest;
  const selectedModel = mlResult?.selected_model || formData.model || 'both';

  const handleDownloadReport = () => {
    const reportContent = `
LOAN DEFAULT PREDICTION REPORT
------------------------------
Date: ${new Date().toLocaleDateString()}
Selected Model: ${selectedModel.toUpperCase()}
Overall Risk Status: ${overallRiskStatus}
Overall Probability: ${formatPercent(overallProbNum)}

MODEL BREAKDOWN:
${logReg ? `1. Logistic Regression:
   - Prediction: ${logReg.prediction} (${logReg.prediction === 1 ? 'Default' : 'No Default'})
   - Probability: ${formatPercent(logReg.probability)}
   - Risk Status: ${logReg.risk_status}` : ''}

${rf ? `2. Random Forest:
   - Prediction: ${rf.prediction} (${rf.prediction === 1 ? 'Default' : 'No Default'})
   - Probability: ${formatPercent(rf.probability)}
   - Risk Status: ${rf.risk_status}` : ''}

BORROWER DETAILS:
- Age: ${formData.age}
- Education: ${formData.education}
- Employment Type: ${formData.employmentType}
- Marital Status: ${formData.maritalStatus}
- Has Dependents: ${formData.hasDependents}
- Annual Income: $${Number(formData.income).toLocaleString()}
- Credit Score: ${formData.creditScore}
- DTI Ratio: ${formData.dtiRatio}%
- Months Employed: ${formData.monthsEmployed}
- Num Credit Lines: ${formData.numCreditLines}

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
      {/* Header */}
      <div className="page-header flex-between">
        <div>
          <h1>AI Loan Risk Result</h1>
          <p>Evaluation results returned from Flask Machine Learning API</p>
        </div>
        <div className="header-actions">
          <Link to="/predict" className="btn-secondary">
            <ArrowLeft size={18} /> New Prediction
          </Link>
          <button className="btn-secondary" onClick={handleDownloadReport}>
            <Download size={18} /> Download Report
          </button>
        </div>
      </div>

      {/* Main Overview Grid */}
      <div className="result-grid">
        {/* Overall Assessment Card */}
        <div className={`main-result glass-card risk-border-${isHighRisk ? 'danger' : 'success'}`}>
          <div className="card-badge">Overall Prediction</div>
          <div className="gauge-container">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="92%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={85}
                  outerRadius={115}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
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
            <div className="metric">
              <span className="label">Prediction Code</span>
              <span className="value badge-code">{mlResult?.prediction ?? (isHighRisk ? 1 : 0)}</span>
            </div>
            <div className="metric">
              <span className="label">Default Probability</span>
              <span className="value">{formatPercent(overallProbNum)}</span>
            </div>
            <div className="metric">
              <span className="label">Selected Model</span>
              <span className="value capitalize">{selectedModel.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Models Breakdown Grid */}
        <div className="models-breakdown-container">
          <h3>Model Evaluation Breakdown</h3>

          <div className="model-cards-wrapper">
            {/* Logistic Regression Card */}
            {(selectedModel === 'both' || selectedModel === 'logistic' || logReg) && (
              <div className="model-result-card glass-card">
                <div className="model-card-top">
                  <div className="model-title-group">
                    <Activity size={20} className="icon-logistic" />
                    <h4>{logReg?.name || 'Logistic Regression'}</h4>
                  </div>
                  <span className={`status-pill ${logReg?.prediction === 1 ? 'danger' : 'success'}`}>
                    {logReg?.risk_status || (isHighRisk ? 'High Risk' : 'Low Risk')}
                  </span>
                </div>
                <div className="model-stats-grid">
                  <div className="model-stat-item">
                    <span className="stat-label">Prediction</span>
                    <strong className="stat-value">{logReg?.prediction ?? (isHighRisk ? 1 : 0)}</strong>
                  </div>
                  <div className="model-stat-item">
                    <span className="stat-label">Probability</span>
                    <strong className="stat-value">{formatPercent(logReg?.probability ?? overallProbNum)}</strong>
                  </div>
                  <div className="model-stat-item">
                    <span className="stat-label">Risk Output</span>
                    <strong className="stat-value">{logReg?.risk_status || (isHighRisk ? 'High Risk (Default)' : 'Low Risk (No Default)')}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Random Forest Card */}
            {(selectedModel === 'both' || selectedModel === 'random_forest' || rf) && (
              <div className="model-result-card glass-card">
                <div className="model-card-top">
                  <div className="model-title-group">
                    <Trees size={20} className="icon-rf" />
                    <h4>{rf?.name || 'Random Forest'}</h4>
                  </div>
                  <span className={`status-pill ${rf?.prediction === 1 ? 'danger' : 'success'}`}>
                    {rf?.risk_status || (isHighRisk ? 'High Risk' : 'Low Risk')}
                  </span>
                </div>
                <div className="model-stats-grid">
                  <div className="model-stat-item">
                    <span className="stat-label">Prediction</span>
                    <strong className="stat-value">{rf?.prediction ?? (isHighRisk ? 1 : 0)}</strong>
                  </div>
                  <div className="model-stat-item">
                    <span className="stat-label">Probability</span>
                    <strong className="stat-value">{formatPercent(rf?.probability ?? overallProbNum)}</strong>
                  </div>
                  <div className="model-stat-item">
                    <span className="stat-label">Risk Output</span>
                    <strong className="stat-value">{rf?.risk_status || (isHighRisk ? 'High Risk (Default)' : 'Low Risk (No Default)')}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Comparison Table Section (when 'both' models are selected) */}
      {(selectedModel === 'both' || (logReg && rf)) && (
        <div className="comparison-section glass-card">
          <div className="card-header">
            <h3><Sliders size={20} /> Model Comparison Table</h3>
            <span className="badge badge-primary">Comparative Analysis</span>
          </div>
          <div className="table-responsive">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Prediction (Code)</th>
                  <th>Default Probability</th>
                  <th>Risk Status Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="table-model-name">
                      <Activity size={18} className="icon-logistic" />
                      <strong>{logReg?.name || 'Logistic Regression'}</strong>
                    </div>
                  </td>
                  <td><code>{logReg?.prediction ?? (isHighRisk ? 1 : 0)}</code></td>
                  <td><strong>{formatPercent(logReg?.probability ?? overallProbNum)}</strong></td>
                  <td>
                    <span className={`status-pill ${logReg?.prediction === 1 ? 'danger' : 'success'}`}>
                      {logReg?.risk_status || (isHighRisk ? 'High Risk (Default)' : 'Low Risk (No Default)')}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="table-model-name">
                      <Trees size={18} className="icon-rf" />
                      <strong>{rf?.name || 'Random Forest'}</strong>
                    </div>
                  </td>
                  <td><code>{rf?.prediction ?? (isHighRisk ? 1 : 0)}</code></td>
                  <td><strong>{formatPercent(rf?.probability ?? overallProbNum)}</strong></td>
                  <td>
                    <span className={`status-pill ${rf?.prediction === 1 ? 'danger' : 'success'}`}>
                      {rf?.risk_status || (isHighRisk ? 'High Risk (Default)' : 'Low Risk (No Default)')}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Borrower Application Summary */}
      <div className="details-card glass-card">
        <div className="card-header">
          <h3><FileText size={20} /> Submitted Borrower Parameters</h3>
        </div>
        <div className="summary-grid">
          <div className="summary-group">
            <h4>Borrower Profile</h4>
            <div className="data-row"><span>Age:</span> <strong>{formData.age} yrs</strong></div>
            <div className="data-row"><span>Education:</span> <strong>{formData.education}</strong></div>
            <div className="data-row"><span>Employment Type:</span> <strong>{formData.employmentType}</strong></div>
            <div className="data-row"><span>Marital Status:</span> <strong>{formData.maritalStatus}</strong></div>
            <div className="data-row"><span>Has Dependents:</span> <strong>{formData.hasDependents}</strong></div>
            <div className="data-row"><span>Months Employed:</span> <strong>{formData.monthsEmployed} mos</strong></div>
          </div>

          <div className="summary-group">
            <h4>Financial Profile</h4>
            <div className="data-row"><span>Annual Income:</span> <strong>${Number(formData.income).toLocaleString()}</strong></div>
            <div className="data-row"><span>Credit Score:</span> <strong>{formData.creditScore}</strong></div>
            <div className="data-row"><span>DTI Ratio:</span> <strong>{formData.dtiRatio}%</strong></div>
            <div className="data-row"><span>Num Credit Lines:</span> <strong>{formData.numCreditLines}</strong></div>
            <div className="data-row"><span>Has Mortgage:</span> <strong>{formData.hasMortgage}</strong></div>
            <div className="data-row"><span>Has Co-Signer:</span> <strong>{formData.hasCoSigner}</strong></div>
          </div>

          <div className="summary-group">
            <h4>Loan Details</h4>
            <div className="data-row"><span>Loan Amount:</span> <strong>${Number(formData.loanAmount).toLocaleString()}</strong></div>
            <div className="data-row"><span>Loan Term:</span> <strong>{formData.loanTerm} Months</strong></div>
            <div className="data-row"><span>Interest Rate:</span> <strong>{formData.interestRate}%</strong></div>
            <div className="data-row"><span>Loan Purpose:</span> <strong>{formData.loanPurpose}</strong></div>
            <div className="data-row"><span>Selected ML Model:</span> <strong>{selectedModel.toUpperCase()}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
