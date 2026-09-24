import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Briefcase, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import './LoanDetails.css';

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for the selected loan
  const mockRecord = {
    id: id || 'LN-8472',
    borrower: {
      name: 'Rahul Sharma',
      age: 34,
      education: 'Master\'s Degree',
      maritalStatus: 'Married',
      dependents: 2,
    },
    employment: {
      type: 'Full-time',
      title: 'Senior Engineer',
      employer: 'Tech Corp Inc.',
      monthsEmployed: 48,
    },
    financial: {
      income: 125000,
      dti: 24.5,
      netWorth: 350000,
    },
    credit: {
      score: 760,
      historyLength: 120, // months
      activeLines: 5,
      utilization: 15.2,
    },
    loan: {
      amount: 45000,
      term: 60,
      purpose: 'Home Improvement',
      interestRate: 6.5,
      monthlyPayment: 880.45,
    },
    prediction: {
      riskLevel: 'LOW',
      riskScore: 12,
      probability: 8.5,
      factors: ['Strong Credit Score', 'Stable Employment', 'Low DTI Ratio']
    }
  };

  const RiskIcon = mockRecord.prediction.riskLevel === 'LOW' ? ShieldCheck : AlertTriangle;
  const riskColor = mockRecord.prediction.riskLevel === 'LOW' ? 'var(--success)' : 
                    mockRecord.prediction.riskLevel === 'HIGH' ? 'var(--danger)' : 'var(--warning)';

  const handleExportDetails = () => {
    const reportContent = `
LOAN APPLICATION DETAILS
------------------------
Application ID: ${mockRecord.id}

BORROWER
Name: ${mockRecord.borrower.name}
Age: ${mockRecord.borrower.age}
Education: ${mockRecord.borrower.education}
Marital Status: ${mockRecord.borrower.maritalStatus}
Dependents: ${mockRecord.borrower.dependents}

EMPLOYMENT
Title: ${mockRecord.employment.title}
Employer: ${mockRecord.employment.employer}
Time at Job: ${mockRecord.employment.monthsEmployed} Months

FINANCIAL
Annual Income: $${mockRecord.financial.income.toLocaleString()}
DTI Ratio: ${mockRecord.financial.dti}%
Credit Score: ${mockRecord.credit.score}
Active Lines: ${mockRecord.credit.activeLines}

LOAN INFO
Amount Requested: $${mockRecord.loan.amount.toLocaleString()}
Purpose: ${mockRecord.loan.purpose}
Term: ${mockRecord.loan.term} Months
Interest Rate: ${mockRecord.loan.interestRate}%

RISK PREDICTION
Risk Level: ${mockRecord.prediction.riskLevel}
Risk Score: ${mockRecord.prediction.riskScore}/100
Default Probability: ${mockRecord.prediction.probability}%
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan_details_${mockRecord.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="details-container">
      <div className="page-header flex-between">
        <div className="header-left">
          <button onClick={() => navigate('/records')} className="back-btn">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Loan Details</h1>
            <p>Application ID: {mockRecord.id}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleExportDetails}>Export PDF</button>
          <button className="btn-primary" onClick={() => alert('Updating Status...')}>Update Status</button>
        </div>
      </div>

      <div className="details-grid">
        {/* Left Column - Borrower Info */}
        <div className="details-col-left">
          <div className="profile-card glass-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <User size={32} />
              </div>
              <div>
                <h2>{mockRecord.borrower.name}</h2>
                <p className="text-secondary">{mockRecord.employment.title}</p>
              </div>
            </div>
            
            <div className="info-group">
              <div className="info-row">
                <span className="label">Age</span>
                <span className="value">{mockRecord.borrower.age} years</span>
              </div>
              <div className="info-row">
                <span className="label">Education</span>
                <span className="value">{mockRecord.borrower.education}</span>
              </div>
              <div className="info-row">
                <span className="label">Marital Status</span>
                <span className="value">{mockRecord.borrower.maritalStatus}</span>
              </div>
              <div className="info-row">
                <span className="label">Dependents</span>
                <span className="value">{mockRecord.borrower.dependents}</span>
              </div>
            </div>
          </div>

          <div className="info-section glass-card">
            <div className="section-title">
              <Briefcase size={18} className="text-primary" />
              <h3>Employment</h3>
            </div>
            <div className="info-group">
              <div className="info-row">
                <span className="label">Type</span>
                <span className="value">{mockRecord.employment.type}</span>
              </div>
              <div className="info-row">
                <span className="label">Employer</span>
                <span className="value">{mockRecord.employment.employer}</span>
              </div>
              <div className="info-row">
                <span className="label">Time at Job</span>
                <span className="value">{mockRecord.employment.monthsEmployed} Months</span>
              </div>
            </div>
          </div>

          <div className="info-section glass-card">
            <div className="section-title">
              <DollarSign size={18} className="text-primary" />
              <h3>Financial & Credit</h3>
            </div>
            <div className="info-group">
              <div className="info-row">
                <span className="label">Annual Income</span>
                <span className="value">${mockRecord.financial.income.toLocaleString()}</span>
              </div>
              <div className="info-row">
                <span className="label">DTI Ratio</span>
                <span className="value">{mockRecord.financial.dti}%</span>
              </div>
              <div className="info-row">
                <span className="label">Credit Score</span>
                <span className="value text-success font-medium">{mockRecord.credit.score}</span>
              </div>
              <div className="info-row">
                <span className="label">Active Lines</span>
                <span className="value">{mockRecord.credit.activeLines}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Loan & Risk Info */}
        <div className="details-col-right">
          <div className="risk-summary-card glass-card">
            <div className="risk-header">
              <div className="risk-status" style={{ color: riskColor }}>
                <RiskIcon size={32} />
                <h2>{mockRecord.prediction.riskLevel} RISK</h2>
              </div>
              <div className="risk-score">
                <span className="score">{mockRecord.prediction.riskScore}</span>
                <span className="max">/100</span>
              </div>
            </div>
            
            <div className="risk-metrics">
              <div className="metric-box">
                <span className="label">Default Probability</span>
                <span className="value">{mockRecord.prediction.probability}%</span>
              </div>
              <div className="metric-box">
                <span className="label">Key Factors</span>
                <ul className="factors-list-small">
                  {mockRecord.prediction.factors.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="loan-details-card glass-card">
            <div className="section-title">
              <FileText size={18} className="text-primary" />
              <h3>Requested Loan Details</h3>
            </div>
            
            <div className="loan-amount-highlight">
              <span className="label">Amount Requested</span>
              <span className="amount">${mockRecord.loan.amount.toLocaleString()}</span>
            </div>

            <div className="loan-grid">
              <div className="loan-stat">
                <span className="label">Purpose</span>
                <span className="value">{mockRecord.loan.purpose}</span>
              </div>
              <div className="loan-stat">
                <span className="label">Term</span>
                <span className="value">{mockRecord.loan.term} Months</span>
              </div>
              <div className="loan-stat">
                <span className="label">Interest Rate</span>
                <span className="value">{mockRecord.loan.interestRate}%</span>
              </div>
              <div className="loan-stat">
                <span className="label">Est. Monthly</span>
                <span className="value">${mockRecord.loan.monthlyPayment}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;
