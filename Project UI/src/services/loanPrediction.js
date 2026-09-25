/**
 * Loan Default Prediction API Service
 * Connects the frontend to the live Flask ML Backend on Render
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loan-default-prediction-1-o7xy.onrender.com';

/**
 * All model keys the live backend can return
 */
export const MODEL_KEYS = [
  'logistic_regression',
  'random_forest',
  'decision_tree',
  'adaboost',
  'bagging'
];

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(url, options, timeoutMs = 90000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. The ML server may be starting up — please try again in 30 seconds.');
    }
    throw err;
  }
}

/**
 * Sends applicant data to the Flask ML backend to predict loan default risk.
 * Includes automatic retry for cold-start scenarios on Render free tier.
 * @param {Object} formData - Raw form data collected from the UI
 * @returns {Promise<Object>} Backend API response with predictions & risk status
 */
export async function predictLoan(formData) {
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

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  // Retry logic: Render free tier cold-starts can take 30-60s
  const MAX_RETRIES = 2;
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/predict`, fetchOptions, 90000);

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid response received from ML server.');
      }

      if (!response.ok || data.success === false) {
        const errorMsg = data.error || data.message || `Server error (${response.status})`;
        throw new Error(errorMsg);
      }

      return data;

    } catch (err) {
      lastError = err;
      // Only retry on network/timeout errors, not on server-returned errors
      const isNetworkError = err.message.includes('timed out') || 
                             err.message.includes('Failed to fetch') ||
                             err.message.includes('NetworkError') ||
                             err.message.includes('network') ||
                             err.name === 'TypeError';
      if (!isNetworkError || attempt >= MAX_RETRIES) {
        break;
      }
      // Wait 3 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Final error
  if (lastError) {
    const msg = lastError.message || '';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || lastError.name === 'TypeError') {
      throw new Error(
        'Unable to connect to the ML server. The Render server may be waking up from sleep. ' +
        'Please wait 30-60 seconds and try again.'
      );
    }
    throw lastError;
  }

  throw new Error('An unexpected error occurred.');
}

/**
 * Health Check endpoint to verify Flask API connectivity
 */
export async function checkBackendHealth() {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/`, {}, 30000);
    if (!response.ok) return false;
    const text = await response.text();
    return text.includes('Loan Default Prediction API is running');
  } catch {
    return false;
  }
}
