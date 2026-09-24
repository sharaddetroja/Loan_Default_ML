import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import './LoanRecords.css';

// Generate mock data for the table
const generateMockData = (count) => {
  const data = [];
  const riskLevels = ['LOW', 'MEDIUM', 'HIGH'];
  const employmentTypes = ['Full-time', 'Part-time', 'Self-employed'];
  const loanPurposes = ['Auto', 'Home', 'Personal', 'Business'];
  
  for (let i = 0; i < count; i++) {
    const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const isDefault = risk === 'HIGH' ? (Math.random() > 0.4) : (Math.random() > 0.9);
    
    data.push({
      id: `LN-${8000 + i}`,
      age: Math.floor(Math.random() * 40) + 22,
      income: Math.floor(Math.random() * 90000) + 30000,
      loanAmount: Math.floor(Math.random() * 40000) + 5000,
      creditScore: Math.floor(Math.random() * 250) + 550,
      interestRate: (Math.random() * 10 + 3).toFixed(1),
      term: [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)],
      dti: (Math.random() * 30 + 10).toFixed(1),
      employment: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
      purpose: loanPurposes[Math.floor(Math.random() * loanPurposes.length)],
      isDefault: isDefault,
      risk: risk
    });
  }
  return data;
};

const allRecords = generateMockData(50);

const LoanRecords = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Filter records
  const filteredRecords = allRecords.filter(record => 
    record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const getRiskBadge = (risk) => {
    const className = `badge badge-${risk === 'LOW' ? 'success' : risk === 'HIGH' ? 'danger' : 'warning'}`;
    return <span className={className}>{risk}</span>;
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['Loan ID', 'Age', 'Income', 'Loan Amount', 'Credit Score', 'Interest Rate', 'DTI Ratio', 'Purpose', 'Status', 'Risk Level'];
    const csvRows = [headers.join(',')];

    filteredRecords.forEach(record => {
      const row = [
        record.id,
        record.age,
        record.income,
        record.loanAmount,
        record.creditScore,
        record.interestRate,
        record.dti,
        record.purpose,
        record.isDefault ? 'Defaulted' : 'Active',
        record.risk
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan_records.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="records-container">
      <div className="page-header flex-between">
        <div>
          <h1>Loan Records</h1>
          <p>Browse and filter the dataset of 255,347 loan applications</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => alert('Filtering options coming soon...')}>
            <Filter size={18} /> Advanced Filter
          </button>
          <button className="btn-secondary" onClick={handleExportCSV}>
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="records-card glass-card">
        <div className="records-toolbar flex-between">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by ID, Employment, or Purpose..." 
              className="glass-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="records-info">
            Showing {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} records
          </div>
        </div>

        <div className="table-responsive">
          <table className="records-table">
            <thead>
              <tr>
                <th>Loan ID <ArrowUpDown size={14} /></th>
                <th>Age</th>
                <th>Income <ArrowUpDown size={14} /></th>
                <th>Loan Amt <ArrowUpDown size={14} /></th>
                <th>Credit Score <ArrowUpDown size={14} /></th>
                <th>Int. Rate</th>
                <th>DTI Ratio</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr key={record.id} onClick={() => navigate(`/records/${record.id}`)} className="cursor-pointer">
                  <td className="font-medium text-primary">{record.id}</td>
                  <td>{record.age}</td>
                  <td>{formatCurrency(record.income)}</td>
                  <td>{formatCurrency(record.loanAmount)}</td>
                  <td>
                    <span className={record.creditScore < 600 ? 'text-danger' : record.creditScore > 750 ? 'text-success' : ''}>
                      {record.creditScore}
                    </span>
                  </td>
                  <td>{record.interestRate}%</td>
                  <td>{record.dti}%</td>
                  <td>{record.purpose}</td>
                  <td>
                    <span className={`status-dot ${record.isDefault ? 'default' : 'active'}`}></span>
                    {record.isDefault ? 'Defaulted' : 'Active'}
                  </td>
                  <td>{getRiskBadge(record.risk)}</td>
                  <td className="actions-cell">
                    <button className="action-btn">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination flex-between">
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          <div className="pagination-controls">
            <button 
              className="page-btn" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <div className="page-numbers">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  className={`num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              className="page-btn" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanRecords;
