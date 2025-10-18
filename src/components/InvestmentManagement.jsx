import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  DollarSign,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  X
} from 'lucide-react';
import SearchInput from './common/SearchInput';
import TableHeader from './common/TableHeader';
import Modal from './common/Modal';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const InvestmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  // Dummy investment data
  const investments = [
    {
      id: 1,
      title: 'N/A',
      amount: 0,
      currentValue: 0,
      status: 'active',
      bank: 'N/A',
      investmentDate: 'N/A',
      maturityDate: 'N/A',
      expectedReturn: 0
    },
    {
      id: 2,
      title: 'N/A',
      amount: 0,
      currentValue: 0,
      status: 'active',
      bank: 'N/A',
      investmentDate: 'N/A',
      maturityDate: 'N/A',
      expectedReturn: 0
    },
    {
      id: 3,
      title: 'N/A',
      amount: 0,
      currentValue: 0,
      status: 'matured',
      bank: 'N/A',
      investmentDate: 'N/A',
      maturityDate: 'N/A',
      expectedReturn: 0
    }
  ];

  // Investment summary data
  const investmentSummary = {
    totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
    currentValue: investments.reduce((sum, inv) => sum + inv.currentValue, 0),
    totalReturn: investments.reduce((sum, inv) => sum + (inv.currentValue - inv.amount), 0)
  };

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investment.bank.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || investment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const [newInvestment, setNewInvestment] = useState({
    title: '',
    amount: '',
    bank: '',
    investmentDate: '',
    maturityDate: '',
    expectedReturn: ''
  });

  const handleAddInvestment = () => {
    // Simple add logic here
    console.log('Adding investment:', newInvestment);
    setShowAddModal(false);
    setNewInvestment({ 
      title: '', 
      amount: '', 
      bank: '',
      investmentDate: '',
      maturityDate: '',
      expectedReturn: ''
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { className: 'investment-status-badge active', label: 'সক্রিয়' },
      matured: { className: 'investment-status-badge matured', label: 'পরিপক্ব' },
      closed: { className: 'investment-status-badge closed', label: 'বন্ধ' }
    };
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={config.className}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">বিনিয়োগ ব্যবস্থাপনা</h1>
          <p className="mt-1 text-sm text-gray-600">সমিতির বিনিয়োগ তথ্য ও পরিচালনা</p>
        </div>
      </div>

      {/* Summary Cards - Reduced to 3 essential ones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="investment-summary-card investment-fade-in">
          <div className="flex items-center">
            <div className="investment-summary-icon blue">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">মোট বিনিয়োগ</p>
              <p className="investment-amount large neutral">৳ {investmentSummary.totalInvested.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="investment-summary-card positive investment-fade-in">
          <div className="flex items-center">
            <div className="investment-summary-icon green">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">বর্তমান মূল্য</p>
              <p className="investment-amount large positive">৳ {investmentSummary.currentValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className={`investment-summary-card ${investmentSummary.totalReturn >= 0 ? 'positive' : 'negative'} investment-fade-in`}>
          <div className="flex items-center">
            <div className={`investment-summary-icon ${investmentSummary.totalReturn >= 0 ? 'green' : 'red'}`}>
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">মোট রিটার্ন</p>
              <p className={`investment-amount large ${investmentSummary.totalReturn >= 0 ? 'positive' : 'negative'}`}>
                ৳ {investmentSummary.totalReturn.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="investment-search-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="বিনিয়োগ বা ব্যাংকের নাম খুঁজুন..."
              className="w-64"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="investment-filter-select"
            >
              <option value="all">সব অবস্থা</option>
              <option value="active">সক্রিয়</option>
              <option value="matured">পরিপক্ব</option>
              <option value="closed">বন্ধ</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            মোট {filteredInvestments.length} টি বিনিয়োগ পাওয়া গেছে
          </div>
        </div>
      </div>

      {/* Simplified Investments Table */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader 
              columns={[
                'বিনিয়োগের বিবরণ',
                'বিনিয়োগের পরিমাণ',
                'বর্তমান মূল্য',
                'অবস্থা',
                'কার্যক্রম'
              ]}
            />
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvestments.map((investment) => (
                <tr key={investment.id} className="investment-table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{investment.title}</div>
                      <div className="text-sm text-gray-500">{investment.bank}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="investment-amount neutral">৳ {investment.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="investment-amount neutral">৳ {investment.currentValue.toLocaleString()}</div>
                    <div className={`text-xs investment-amount ${investment.currentValue >= investment.amount ? 'positive' : 'negative'}`}>
                      {investment.currentValue >= investment.amount ? '+' : ''}
                      ৳ {(investment.currentValue - investment.amount).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(investment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedInvestment(investment);
                          setShowDetailsModal(true);
                        }}
                        className="investment-action-btn view"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="investment-action-btn edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="investment-action-btn delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simplified Add Investment Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="নতুন বিনিয়োগ যোগ করুন">
        <div className="space-y-4">
          <div className="investment-modal-field">
            <label className="investment-modal-label">বিনিয়োগের নাম</label>
            <input
              type="text"
              value={newInvestment.title}
              onChange={(e) => setNewInvestment({...newInvestment, title: e.target.value})}
              className="investment-modal-input"
              placeholder="যেমন: ব্যাংক ফিক্সড ডিপোজিট"
            />
          </div>
          <div className="investment-modal-field">
            <label className="investment-modal-label">বিনিয়োগের পরিমাণ</label>
            <input
              type="number"
              value={newInvestment.amount}
              onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})}
              className="investment-modal-input"
              placeholder="০"
            />
          </div>
          <div className="investment-modal-field">
            <label className="investment-modal-label">ব্যাংক/প্রতিষ্ঠান</label>
            <input
              type="text"
              value={newInvestment.bank}
              onChange={(e) => setNewInvestment({...newInvestment, bank: e.target.value})}
              className="investment-modal-input"
              placeholder="যেমন: ইসলামী ব্যাংক বাংলাদেশ"
            />
          </div>
          <div className="investment-modal-grid">
            <div className="investment-modal-field">
              <label className="investment-modal-label">বিনিয়োগের তারিখ</label>
              <input
                type="date"
                value={newInvestment.investmentDate}
                onChange={(e) => setNewInvestment({...newInvestment, investmentDate: e.target.value})}
                className="investment-modal-input"
              />
            </div>
            <div className="investment-modal-field">
              <label className="investment-modal-label">মেয়াদ শেষের তারিখ</label>
              <input
                type="date"
                value={newInvestment.maturityDate}
                onChange={(e) => setNewInvestment({...newInvestment, maturityDate: e.target.value})}
                className="investment-modal-input"
              />
            </div>
          </div>
          <div className="investment-modal-field">
            <label className="investment-modal-label">প্রত্যাশিত রিটার্ন (%)</label>
            <input
              type="number"
              step="0.1"
              value={newInvestment.expectedReturn}
              onChange={(e) => setNewInvestment({...newInvestment, expectedReturn: e.target.value})}
              className="investment-modal-input"
              placeholder="যেমন: ৮.৪"
            />
          </div>

          <div className="investment-modal-actions">
            <button
              onClick={() => setShowAddModal(false)}
              className="investment-modal-btn-cancel"
            >
              বাতিল
            </button>
            <button
              onClick={handleAddInvestment}
              className="investment-modal-btn-primary"
            >
              যোগ করুন
            </button>
          </div>
        </div>
      </Modal>

      {/* Simple Details Modal */}
      <Modal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
        title="বিনিয়োগের বিস্তারিত"
      >
        {selectedInvestment && (
          <div className="investment-details-modal">
            <div className="investment-details-header">
              <h3 className="investment-details-title">{selectedInvestment.title}</h3>
              <p className="investment-details-bank">{selectedInvestment.bank}</p>
            </div>
            <div className="investment-details-grid">
              <div className="investment-details-item">
                <p className="investment-details-label">বিনিয়োগের পরিমাণ</p>
                <p className="investment-details-value">৳ {selectedInvestment.amount.toLocaleString()}</p>
              </div>
              <div className="investment-details-item">
                <p className="investment-details-label">বর্তমান মূল্য</p>
                <p className="investment-details-value">৳ {selectedInvestment.currentValue.toLocaleString()}</p>
              </div>
              <div className="investment-details-item">
                <p className="investment-details-label">বিনিয়োগের তারিখ</p>
                <p className="investment-details-value">{new Date(selectedInvestment.investmentDate).toLocaleDateString('bn-BD')}</p>
              </div>
              <div className="investment-details-item">
                <p className="investment-details-label">মেয়াদ শেষের তারিখ</p>
                <p className="investment-details-value">
                  {selectedInvestment.maturityDate ? new Date(selectedInvestment.maturityDate).toLocaleDateString('bn-BD') : 'নির্দিষ্ট নেই'}
                </p>
              </div>
            </div>
            <div className="investment-details-grid">
              <div className="investment-details-item">
                <p className="investment-details-label">প্রত্যাশিত রিটার্ন</p>
                <p className="investment-details-value">{selectedInvestment.expectedReturn}%</p>
              </div>
              <div className="investment-details-item">
                <p className="investment-details-label">লাভ/ক্ষতি</p>
                <p className={`investment-details-value ${selectedInvestment.currentValue >= selectedInvestment.amount ? 'profit' : 'loss'}`}>
                  ৳ {(selectedInvestment.currentValue - selectedInvestment.amount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvestmentManagement;