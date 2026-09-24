import { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, XOctagon } from 'lucide-react';
import './ResultDashboard.css';

export default function ResultDashboard({ result }) {
  const [animatedProb, setAnimatedProb] = useState(0);

  // Animate the gauge on mount or when result changes
  useEffect(() => {
    if (!result) return;
    
    let start = 0;
    const duration = 1500; // ms
    const increment = (result.probability / duration) * 16; // 60fps ~ 16ms
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= result.probability) {
        setAnimatedProb(result.probability);
        clearInterval(timer);
      } else {
        setAnimatedProb(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [result]);

  if (!result) return null;

  // Determine risk level based on probability
  let riskLevel = 'safe';
  let RiskIcon = ShieldCheck;
  let statusText = 'Low Risk';
  let recommendation = 'This applicant shows a strong profile with low probability of default. Proceed with standard approval process.';

  if (result.probability > 40 && result.probability <= 70) {
    riskLevel = 'warning';
    RiskIcon = AlertTriangle;
    statusText = 'Moderate Risk';
    recommendation = 'This applicant has some risk factors. Consider manual review, requiring a co-signer, or adjusting the interest rate.';
  } else if (result.probability > 70) {
    riskLevel = 'danger';
    RiskIcon = XOctagon;
    statusText = 'High Risk';
    recommendation = 'High probability of default detected. Recommend rejecting the application or requiring significant collateral.';
  }

  // Calculate SVG stroke dash array for the circular gauge
  const strokeDasharray = `${animatedProb}, 100`;

  return (
    <div className="glass-panel result-dashboard animate-slide-in">
      <div className="dashboard-header">
        <h3>Prediction Result</h3>
        <h2>{statusText}</h2>
      </div>

      <div className={`gauge-container risk-${riskLevel}`}>
        <svg viewBox="0 0 36 36" className="circular-chart">
          <path className="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path className="circle"
            strokeDasharray={strokeDasharray}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" className="percentage">{Math.round(animatedProb)}%</text>
          <text x="18" y="25" className="risk-label">DEFAULT PROBABILITY</text>
        </svg>
      </div>

      <div className={`recommendation ${riskLevel}`}>
        <RiskIcon className="recommendation-icon" size={24} />
        <div>
          <strong style={{ color: 'inherit' }}>Analysis & Recommendation</strong>
          <p>{recommendation}</p>
        </div>
      </div>
      
      {/* Mock feature importance or details */}
      <div className="metrics-grid">
        <div className={`metric-card ${result.dti > 0.4 ? 'warning' : 'safe'}`}>
          <span className="metric-label">DTI Ratio</span>
          <span className="metric-value">{(result.dti * 100).toFixed(1)}%</span>
        </div>
        <div className={`metric-card ${result.creditScore < 600 ? 'danger' : 'safe'}`}>
          <span className="metric-label">Credit Score</span>
          <span className="metric-value">{result.creditScore}</span>
        </div>
      </div>
    </div>
  );
}
