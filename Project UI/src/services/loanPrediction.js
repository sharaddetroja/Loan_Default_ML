/**
 * Loan Default Prediction API Service
 * Connects the frontend to the Flask ML Backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Sends applicant data to the Flask ML backend to predict loan default risk.
 * @param {Object} formData - Raw form data collected from the UI
 * @returns {Promise<Object>} Backend API response with predictions & risk status
 */
export async function predictLoan(formData) {
  // Construct payload with exact field names expected by Flask API backend
  const payload = {
    age: Number(formData.age),
    income: Number(formData.income),
    loanamount: Number(formData.loanAmount ?? formData.loanamount),
    creditscore: Number(formData.creditScore ?? formData.creditscore),
    monthsemployed: Number(formData.monthsEmployed ?? formData.monthsemployed),
    numcreditlines: Number(formData.numCreditLines ?? formData.numcreditlines),
    interestrate: Number(formData.interestRate ?? formData.interestrate),
    loanterm: Number(formData.loanTerm ?? formData.loanterm),
    dtiratio: Number(formData.dtiRatio ?? formData.dtiratio),
    education: String(formData.education),
    employmenttype: String(formData.employmentType ?? formData.employmenttype),
    maritalstatus: String(formData.maritalStatus ?? formData.maritalstatus),
    hasmortgage: formData.hasMortgage === true || formData.hasMortgage === 'Yes' || formData.hasmortgage === 'Yes' ? 'Yes' : 'No',
    hasdependents: formData.hasDependents === true || formData.hasDependents === 'Yes' || formData.hasdependents === 'Yes' ? 'Yes' : 'No',
    loanpurpose: String(formData.loanPurpose ?? formData.loanpurpose),
    hascosigner: formData.hasCoSigner === true || formData.hasCoSigner === 'Yes' || formData.hascosigner === 'Yes' ? 'Yes' : 'No',
    model: formData.model || 'both'
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (netErr) {
    console.error('Network Error connecting to Flask ML backend:', netErr);
    throw new Error('Unable to connect to the ML server. Please make sure the Flask backend is running on port 5000.');
  }

  let data;
  try {
    data = await response.json();
  } catch (jsonErr) {
    throw new Error('Invalid response received from ML server.');
  }

  if (!response.ok || data.success === false) {
    const errorMsg = data.error || data.message || `Server error (${response.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Optional Health Check endpoint to verify Flask API connectivity
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) return false;
    const text = await response.text();
    return text.includes('Loan Default Prediction API is running');
  } catch {
    return false;
  }
}
