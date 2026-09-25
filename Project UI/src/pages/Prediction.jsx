import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  DollarSign, 
  Briefcase, 
  FileText,
  HelpCircle,
  Activity,
  Cpu,
  Sliders,
  Trees,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { predictLoan } from '../services/loanPrediction';
import './Prediction.css';

const FormSection = ({ title, icon: Icon, children }) => (
  <div className="form-section">
    <div className="section-header">
      <div className="section-icon">
        <Icon size={20} />
      </div>
      <h3>{title}</h3>
    </div>
    <div className="section-content">
      {children}
    </div>
  </div>
);

const Prediction = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const defaultFormState = {
    model: 'both',
    age: 35,
    education: 'Bachelor',
    employmentType: 'Full-time',
    maritalStatus: 'Married',
    hasDependents: 'No',
    income: 85000,
    loanAmount: 25000,
    creditScore: 720,
    interestRate: 5.5,
    dtiRatio: 28.5,
    monthsEmployed: 48,
    numCreditLines: 4,
    loanTerm: 60,
    loanPurpose: 'Personal',
    hasMortgage: 'No',
    hasCoSigner: 'No'
  };

  const [formData, setFormData] = useState(defaultFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSliderChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    if (errorMessage) setErrorMessage('');
  };

  const validateForm = () => {
    if (!formData.age || Number(formData.age) <= 0) return "Age must be a positive number.";
    if (formData.income === '' || Number(formData.income) < 0) return "Annual Income cannot be negative.";
    if (formData.loanAmount === '' || Number(formData.loanAmount) < 0) return "Loan Amount cannot be negative.";
    if (Number(formData.creditScore) < 300 || Number(formData.creditScore) > 850) return "Credit Score must be between 300 and 850.";
    if (formData.monthsEmployed === '' || Number(formData.monthsEmployed) < 0) return "Months Employed cannot be negative.";
    if (formData.numCreditLines === '' || Number(formData.numCreditLines) < 0) return "Number of Credit Lines cannot be negative.";
    if (formData.interestRate === '' || Number(formData.interestRate) < 0) return "Interest Rate cannot be negative.";
    if (!formData.loanTerm || Number(formData.loanTerm) <= 0) return "Loan Term must be a positive number.";
    if (formData.dtiRatio === '' || Number(formData.dtiRatio) < 0) return "DTI Ratio cannot be negative.";
    if (!formData.education) return "Education level is required.";
    if (!formData.employmentType) return "Employment Type is required.";
    if (!formData.maritalStatus) return "Marital Status is required.";
    if (!formData.loanPurpose) return "Loan Purpose is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const valErr = validateForm();
    if (valErr) { setErrorMessage(valErr); return; }

    setIsAnalyzing(true);
    try {
      const mlResult = await predictLoan(formData);
      setIsAnalyzing(false);
      navigate('/result', { state: { formData, mlResult } });
    } catch (err) {
      setIsAnalyzing(false);
      setErrorMessage(err.message || 'Unable to connect to the ML server.');
    }
  };

  const handleReset = () => {
    setFormData(defaultFormState);
    setErrorMessage('');
  };

  if (isAnalyzing) {
    return (
      <div className="analyzing-state">
        <div className="scanning-container">
          <Activity className="scanning-icon text-gradient" size={64} />
          <div className="scanner-line"></div>
        </div>
        <h2>Analyzing Loan Risk...</h2>
        <p>Connecting to live ML API server on Render — this may take up to 60 seconds if the server is waking up</p>
        <div className="processing-steps">
          <div className="step active">Waking up Render ML server</div>
          <div className="step active delay-1">Preprocessing & scaling features</div>
          <div className="step active delay-2">Running ML model inference</div>
        </div>
      </div>
    );
  }

  return (
    <div className="prediction-container">
      <div className="page-header flex-between">
        <div>
          <h1>Loan Default Prediction</h1>
          <p>Enter borrower information to evaluate default risk using our live Flask ML API.</p>
        </div>
        <button type="button" onClick={handleReset} className="btn-secondary reset-top-btn" title="Reset form">
          <RotateCcw size={16} /> Reset Form
        </button>
      </div>

      {errorMessage && (
        <div className="error-banner glass-panel" role="alert">
          <AlertCircle size={22} className="error-icon" />
          <div className="error-content">
            <strong>Prediction Error</strong>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="prediction-form glass-card">
        
        {/* Model Selection */}
        <FormSection title="Select ML Model" icon={Cpu}>
          <div className="model-selection-grid">
            {[
              { value: 'both', icon: Sliders, title: 'All Models (Recommended)', desc: 'Run all 5 ML models: Logistic Regression, Random Forest, Decision Tree, AdaBoost & Bagging.' },
              { value: 'logistic', icon: Activity, title: 'Logistic Regression', desc: 'Linear classifier focusing on log-odds probability.' },
              { value: 'random_forest', icon: Trees, title: 'Random Forest', desc: 'Ensemble of decision trees for complex feature interactions.' },
              { value: 'decision_tree', icon: Trees, title: 'Decision Tree', desc: 'Single tree-based classifier with interpretable rules.' },
              { value: 'adaboost', icon: Activity, title: 'AdaBoost', desc: 'Adaptive boosting ensemble of weak classifiers.' },
              { value: 'bagging', icon: Sliders, title: 'Bagging Classifier', desc: 'Bootstrap aggregating classifier for variance reduction.' }
            ].map(m => (
              <label key={m.value} className={`model-card ${formData.model === m.value ? 'selected' : ''}`}>
                <input type="radio" name="model" value={m.value} checked={formData.model === m.value} onChange={handleChange} className="sr-only" />
                <div className="model-card-header"><m.icon size={20} className="model-icon" /><span className="model-title">{m.title}</span></div>
                <p className="model-desc">{m.desc}</p>
              </label>
            ))}
          </div>
        </FormSection>

        <div className="form-grid">
          <FormSection title="Personal Information" icon={User}>
            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input id="age" type="number" name="age" value={formData.age} onChange={handleChange} className="glass-input" min="18" max="100" required />
            </div>
            <div className="input-group">
              <label htmlFor="education">Education Level</label>
              <select id="education" name="education" value={formData.education} onChange={handleChange} className="glass-input" required>
                <option value="High School">High School</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Master">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="maritalStatus">Marital Status</label>
              <select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="glass-input" required>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="hasDependents">Has Dependents</label>
              <select id="hasDependents" name="hasDependents" value={formData.hasDependents} onChange={handleChange} className="glass-input" required>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </FormSection>

          <FormSection title="Financial Information" icon={DollarSign}>
            <div className="input-group">
              <label htmlFor="income">Annual Income ($) <span className="tooltip-icon" title="Gross annual income before taxes"><HelpCircle size={14} /></span></label>
              <input id="income" type="number" name="income" value={formData.income} onChange={handleChange} className="glass-input" min="0" step="1000" required />
            </div>
            <div className="input-group">
              <label htmlFor="loanAmount">Loan Amount ($)</label>
              <input id="loanAmount" type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} className="glass-input" min="0" step="500" required />
            </div>
            <div className="input-group slider-group">
              <div className="slider-header"><label htmlFor="creditScore">Credit Score</label><span>{formData.creditScore}</span></div>
              <input id="creditScore" type="range" name="creditScore" min="300" max="850" value={formData.creditScore} onChange={(e) => handleSliderChange('creditScore', e.target.value)} className="range-slider" />
            </div>
            <div className="input-group">
              <label htmlFor="dtiRatio">DTI Ratio (%)</label>
              <input id="dtiRatio" type="number" name="dtiRatio" value={formData.dtiRatio} onChange={handleChange} className="glass-input" min="0" step="0.1" required />
            </div>
          </FormSection>

          <FormSection title="Credit & Employment" icon={Briefcase}>
            <div className="input-group">
              <label htmlFor="employmentType">Employment Type</label>
              <select id="employmentType" name="employmentType" value={formData.employmentType} onChange={handleChange} className="glass-input" required>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="monthsEmployed">Months Employed</label>
              <input id="monthsEmployed" type="number" name="monthsEmployed" value={formData.monthsEmployed} onChange={handleChange} className="glass-input" min="0" required />
            </div>
            <div className="input-group">
              <label htmlFor="numCreditLines">Number of Credit Lines</label>
              <input id="numCreditLines" type="number" name="numCreditLines" value={formData.numCreditLines} onChange={handleChange} className="glass-input" min="0" required />
            </div>
            <div className="input-group">
              <label htmlFor="interestRate">Interest Rate (%)</label>
              <input id="interestRate" type="number" name="interestRate" value={formData.interestRate} onChange={handleChange} className="glass-input" min="0" step="0.1" required />
            </div>
          </FormSection>

          <FormSection title="Loan Details" icon={FileText}>
            <div className="input-group">
              <label htmlFor="loanPurpose">Loan Purpose</label>
              <select id="loanPurpose" name="loanPurpose" value={formData.loanPurpose} onChange={handleChange} className="glass-input" required>
                <option value="Personal">Personal</option>
                <option value="Auto">Auto Loan</option>
                <option value="Education">Education</option>
                <option value="Home Improvement">Home Improvement</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="loanTerm">Loan Term (Months)</label>
              <select id="loanTerm" name="loanTerm" value={formData.loanTerm} onChange={handleChange} className="glass-input" required>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="48">48 Months</option>
                <option value="60">60 Months</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="hasMortgage">Has Mortgage</label>
              <select id="hasMortgage" name="hasMortgage" value={formData.hasMortgage} onChange={handleChange} className="glass-input" required>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="hasCoSigner">Has Co-Signer</label>
              <select id="hasCoSigner" name="hasCoSigner" value={formData.hasCoSigner} onChange={handleChange} className="glass-input" required>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </FormSection>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleReset} className="btn-secondary"><RotateCcw size={18} /> Reset</button>
          <button type="submit" className="btn-primary analyze-btn" disabled={isAnalyzing}>
            <Activity size={24} />
            {isAnalyzing ? 'Analyzing Loan...' : 'Predict Loan Risk'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Prediction;
