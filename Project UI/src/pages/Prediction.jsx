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
    // Model Selection
    model: 'both',
    // Personal Information
    age: 35,
    education: 'Bachelor',
    employmentType: 'Full-time',
    maritalStatus: 'Married',
    hasDependents: 'No',
    // Financial Information
    income: 85000,
    loanAmount: 25000,
    creditScore: 720,
    interestRate: 5.5,
    dtiRatio: 28.5,
    // Credit & Employment
    monthsEmployed: 48,
    numCreditLines: 4,
    // Loan Details
    loanTerm: 60,
    loanPurpose: 'Personal',
    hasMortgage: 'No',
    hasCoSigner: 'No'
  };

  const [formData, setFormData] = useState(defaultFormState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;
    if (type === 'checkbox') {
      finalValue = checked ? 'Yes' : 'No';
    }
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSliderChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
    if (errorMessage) setErrorMessage('');
  };

  const validateForm = () => {
    const age = Number(formData.age);
    if (!formData.age || isNaN(age) || age <= 0) {
      return "Age must be a positive number.";
    }
    const income = Number(formData.income);
    if (formData.income === '' || isNaN(income) || income < 0) {
      return "Annual Income cannot be negative.";
    }
    const loanAmount = Number(formData.loanAmount);
    if (formData.loanAmount === '' || isNaN(loanAmount) || loanAmount < 0) {
      return "Loan Amount cannot be negative.";
    }
    const creditScore = Number(formData.creditScore);
    if (formData.creditScore === '' || isNaN(creditScore) || creditScore < 300 || creditScore > 850) {
      return "Credit Score must be between 300 and 850.";
    }
    const monthsEmployed = Number(formData.monthsEmployed);
    if (formData.monthsEmployed === '' || isNaN(monthsEmployed) || monthsEmployed < 0) {
      return "Months Employed cannot be negative.";
    }
    const numCreditLines = Number(formData.numCreditLines);
    if (formData.numCreditLines === '' || isNaN(numCreditLines) || numCreditLines < 0) {
      return "Number of Credit Lines cannot be negative.";
    }
    const interestRate = Number(formData.interestRate);
    if (formData.interestRate === '' || isNaN(interestRate) || interestRate < 0) {
      return "Interest Rate cannot be negative.";
    }
    const loanTerm = Number(formData.loanTerm);
    if (!formData.loanTerm || isNaN(loanTerm) || loanTerm <= 0) {
      return "Loan Term must be a positive number.";
    }
    const dtiRatio = Number(formData.dtiRatio);
    if (formData.dtiRatio === '' || isNaN(dtiRatio) || dtiRatio < 0) {
      return "Debt-to-Income (DTI) Ratio cannot be negative.";
    }
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
    if (valErr) {
      setErrorMessage(valErr);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const mlResult = await predictLoan(formData);
      setIsAnalyzing(false);
      navigate('/result', { state: { formData, mlResult } });
    } catch (err) {
      setIsAnalyzing(false);
      console.error('Prediction Submission Error:', err);
      setErrorMessage(err.message || 'Unable to connect to the ML server. Please make sure the Flask backend is running on port 5000.');
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
        <p>Sending applicant parameters to the Machine Learning Flask Backend Server</p>
        
        <div className="processing-steps">
          <div className="step active">Validating applicant features</div>
          <div className="step active delay-1">Preprocessing & scaling features</div>
          <div className="step active delay-2">Executing ML Model Inference</div>
        </div>
      </div>
    );
  }

  return (
    <div className="prediction-container">
      <div className="page-header flex-between">
        <div>
          <h1>Loan Default Prediction</h1>
          <p>Enter borrower information to evaluate default risk using our trained Flask Machine Learning API.</p>
        </div>
        <button type="button" onClick={handleReset} className="btn-secondary reset-top-btn" title="Reset form to defaults">
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
        
        {/* Model Selection Section */}
        <FormSection title="Select ML Model" icon={Cpu}>
          <div className="model-selection-grid">
            <label className={`model-card ${formData.model === 'both' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="model" 
                value="both" 
                checked={formData.model === 'both'} 
                onChange={handleChange}
                className="sr-only"
              />
              <div className="model-card-header">
                <Sliders size={20} className="model-icon" />
                <span className="model-title">Both Models (Recommended)</span>
              </div>
              <p className="model-desc">Run predictions from both Logistic Regression and Random Forest simultaneously.</p>
            </label>

            <label className={`model-card ${formData.model === 'logistic' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="model" 
                value="logistic" 
                checked={formData.model === 'logistic'} 
                onChange={handleChange}
                className="sr-only"
              />
              <div className="model-card-header">
                <Activity size={20} className="model-icon" />
                <span className="model-title">Logistic Regression</span>
              </div>
              <p className="model-desc">Linear classification model focusing on linear relationships.</p>
            </label>

            <label className={`model-card ${formData.model === 'random_forest' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="model" 
                value="random_forest" 
                checked={formData.model === 'random_forest'} 
                onChange={handleChange}
                className="sr-only"
              />
              <div className="model-card-header">
                <Trees size={20} className="model-icon" />
                <span className="model-title">Random Forest</span>
              </div>
              <p className="model-desc">Ensemble tree classifier handling complex non-linear feature interactions.</p>
            </label>
          </div>
        </FormSection>

        <div className="form-grid">
          
          {/* Personal Information */}
          <FormSection title="Personal Information" icon={User}>
            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input 
                id="age"
                type="number" 
                name="age" 
                value={formData.age} 
                onChange={handleChange} 
                className="glass-input" 
                min="18" 
                max="100" 
                required
              />
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

          {/* Financial Information */}
          <FormSection title="Financial Information" icon={DollarSign}>
            <div className="input-group">
              <label htmlFor="income">
                Annual Income ($)
                <span className="tooltip-icon" title="Gross annual income before taxes"><HelpCircle size={14} /></span>
              </label>
              <input id="income" type="number" name="income" value={formData.income} onChange={handleChange} className="glass-input" min="0" step="1000" required />
            </div>
            
            <div className="input-group">
              <label htmlFor="loanAmount">Loan Amount ($)</label>
              <input id="loanAmount" type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} className="glass-input" min="0" step="500" required />
            </div>
            
            <div className="input-group slider-group">
              <div className="slider-header">
                <label htmlFor="creditScore">Credit Score</label>
                <span>{formData.creditScore}</span>
              </div>
              <input 
                id="creditScore"
                type="range" name="creditScore" 
                min="300" max="850" 
                value={formData.creditScore} 
                onChange={(e) => handleSliderChange('creditScore', e.target.value)} 
                className="range-slider" 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="dtiRatio">Debt-To-Income (DTI) Ratio (%)</label>
              <input id="dtiRatio" type="number" name="dtiRatio" value={formData.dtiRatio} onChange={handleChange} className="glass-input" min="0" step="0.1" required />
            </div>
          </FormSection>

          {/* Credit & Employment */}
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

          {/* Loan Details */}
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
          <button type="button" onClick={handleReset} className="btn-secondary">
            <RotateCcw size={18} /> Reset
          </button>
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
