import { useState } from 'react';
import { 
  User, 
  Briefcase, 
  CircleDollarSign, 
  CreditCard, 
  Building2, 
  Percent, 
  Scale, 
  Clock, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import './PredictionForm.css';

export default function PredictionForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    loanAmount: '',
    intent: 'PERSONAL',
    interestRate: '',
    employmentLength: '',
    homeOwnership: 'RENT',
    creditScore: '',
    dti: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass numeric values where appropriate
    const payload = {
      ...formData,
      age: Number(formData.age),
      income: Number(formData.income),
      loanAmount: Number(formData.loanAmount),
      interestRate: Number(formData.interestRate),
      employmentLength: Number(formData.employmentLength),
      creditScore: Number(formData.creditScore),
      dti: Number(formData.dti)
    };
    onSubmit(payload);
  };

  return (
    <div className="glass-panel form-container animate-fade-in">
      <div className="form-header">
        <h2>Applicant Details</h2>
        <p>Enter the applicant's financial and personal information</p>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-grid">
          
          {/* Personal Info */}
          <div className="input-group">
            <label htmlFor="age"><User className="input-icon"/> Age</label>
            <input 
              type="number" 
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 28"
              className="glass-input"
              required 
              min="18"
              max="100"
            />
          </div>

          <div className="input-group">
            <label htmlFor="employmentLength"><Clock className="input-icon"/> Employment Length (Years)</label>
            <input 
              type="number" 
              id="employmentLength"
              name="employmentLength"
              value={formData.employmentLength}
              onChange={handleChange}
              placeholder="e.g. 5"
              className="glass-input"
              required 
              min="0"
              max="60"
            />
          </div>

          {/* Financials */}
          <div className="input-group">
            <label htmlFor="income"><CircleDollarSign className="input-icon"/> Annual Income ($)</label>
            <input 
              type="number" 
              id="income"
              name="income"
              value={formData.income}
              onChange={handleChange}
              placeholder="e.g. 65000"
              className="glass-input"
              required 
              min="0"
            />
          </div>

          <div className="input-group">
            <label htmlFor="creditScore"><CreditCard className="input-icon"/> Credit Score</label>
            <input 
              type="number" 
              id="creditScore"
              name="creditScore"
              value={formData.creditScore}
              onChange={handleChange}
              placeholder="e.g. 720"
              className="glass-input"
              required 
              min="300"
              max="850"
            />
          </div>

          {/* Loan Details */}
          <div className="input-group">
            <label htmlFor="loanAmount"><Building2 className="input-icon"/> Loan Amount ($)</label>
            <input 
              type="number" 
              id="loanAmount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              placeholder="e.g. 15000"
              className="glass-input"
              required 
              min="100"
            />
          </div>

          <div className="input-group">
            <label htmlFor="interestRate"><Percent className="input-icon"/> Interest Rate (%)</label>
            <input 
              type="number" 
              id="interestRate"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              placeholder="e.g. 10.5"
              className="glass-input"
              required 
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className="input-group">
            <label htmlFor="intent"><Briefcase className="input-icon"/> Loan Intent</label>
            <select 
              id="intent"
              name="intent"
              value={formData.intent}
              onChange={handleChange}
              className="glass-input"
            >
              <option value="PERSONAL">Personal</option>
              <option value="EDUCATION">Education</option>
              <option value="MEDICAL">Medical</option>
              <option value="VENTURE">Venture</option>
              <option value="HOMEIMPROVEMENT">Home Improvement</option>
              <option value="DEBTCONSOLIDATION">Debt Consolidation</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="homeOwnership"><Building2 className="input-icon"/> Home Ownership</label>
            <select 
              id="homeOwnership"
              name="homeOwnership"
              value={formData.homeOwnership}
              onChange={handleChange}
              className="glass-input"
            >
              <option value="RENT">Rent</option>
              <option value="MORTGAGE">Mortgage</option>
              <option value="OWN">Own</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="dti"><Scale className="input-icon"/> Debt-to-Income (DTI) Ratio</label>
            <input 
              type="number" 
              id="dti"
              name="dti"
              value={formData.dti}
              onChange={handleChange}
              placeholder="e.g. 0.25 (25%)"
              className="glass-input"
              required 
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="loading-spinner" /> Processing
            </>
          ) : (
            <>
              Predict Risk <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
