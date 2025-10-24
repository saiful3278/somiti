import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  DollarSign,
  BarChart3,
  Eye,
  Download,
  Users,
  Percent,
  Calculator,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import SearchInput from './common/SearchInput';
import TableHeader from './common/TableHeader';
import Modal from './common/Modal';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const ProfitDistribution = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState(null);

  // Dummy profit distribution data
  const profitDistributions = [
    {
      id: 1,
      year: 2024,
      quarter: 'Q2',
      totalProfit: 125000,
      distributedAmount: 100000,
      reservedAmount: 25000,
      distributionDate: '2024-06-30',
      status: 'distributed',
      profitRate: 12.5,
      memberCount: 71,
      perShareProfit: 1408
    },
    {
      id: 2,
      year: 2024,
      quarter: 'Q1',
      totalProfit: 98000,
      distributedAmount: 78400,
      reservedAmount: 19600,
      distributionDate: '2024-03-31',
      status: 'distributed',
      profitRate: 11.2,
      memberCount: 70,
      perShareProfit: 1120
    },
    {
      id: 3,
      year: 2023,
      quarter: 'Q4',
      totalProfit: 110000,
      distributedAmount: 88000,
      reservedAmount: 22000,
      distributionDate: '2023-12-31',
      status: 'distributed',
      profitRate: 13.8,
      memberCount: 68,
      perShareProfit: 1294
    }
  ];

  // Member profit details
  const memberProfits = [
    {
      id: 1,
      memberName: 'মোহাম্মদ রহিম উদ্দিন',
      memberId: 'SM-001',
      shareCount: 25,
      profitAmount: 35200,
      distributionDate: '2024-06-30',
      status: 'paid',
      paymentMethod: 'bank_transfer'
    },
    {
      id: 2,
      memberName: 'ফাতেমা খাতুন',
      memberId: 'SM-002',
      shareCount: 15,
      profitAmount: 21120,
      distributionDate: '2024-06-30',
      status: 'paid',
      paymentMethod: 'cash'
    },
    {
      id: 3,
      memberName: 'আব্দুল কাদের',
      memberId: 'SM-003',
      shareCount: 10,
      profitAmount: 14080,
      distributionDate: '2024-06-30',
      status: 'pending',
      paymentMethod: null
    },
    {
      id: 4,
      memberName: 'নাসির উদ্দিন আহমেদ',
      memberId: 'SM-004',
      shareCount: 20,
      profitAmount: 28160,
      distributionDate: '2024-06-30',
      status: 'paid',
      paymentMethod: 'mobile_banking'
    }
  ];

  // Yearly profit trend
  const yearlyProfitTrend = [
    { year: '২০২০', profit: 85000, rate: 9.5 },
    { year: '২০২১', profit: 95000, rate: 10.2 },
    { year: '২০২২', profit: 105000, rate: 11.8 },
    { year: '২০২৩', profit: 118000, rate: 12.1 },
    { year: '২০২৪', profit: 125000, rate: 12.5 }
  ];

  // Profit source breakdown
  const profitSources = [
    { source: 'বিনিয়োগ রিটার্ন', amount: 75000, percentage: 60, color: '#0A6CFF' },
    { source: 'ব্যাংক সুদ', amount: 30000, percentage: 24, color: '#00BFA5' },
    { source: 'ব্যবসায়িক লাভ', amount: 15000, percentage: 12, color: '#FF6B35' },
    { source: 'অন্যান্য', amount: 5000, percentage: 4, color: '#8B5CF6' }
  ];

  // Distribution by share range
  const distributionByShare = [
    { range: '১-১০ শেয়ার', members: 25, amount: 35200, avgProfit: 1408 },
    { range: '১১-২৫ শেয়ার', members: 30, amount: 63360, avgProfit: 2112 },
    { range: '২৬-৫০ শেয়ার', members: 12, amount: 50688, avgProfit: 4224 },
    { range: '৫০+ শেয়ার', members: 4, amount: 28160, avgProfit: 7040 }
  ];

  const currentDistribution = profitDistributions[0];
  const totalDistributed = memberProfits.filter(m => m.status === 'paid').reduce((sum, m) => sum + m.profitAmount, 0);
  const pendingDistribution = memberProfits.filter(m => m.status === 'pending').reduce((sum, m) => sum + m.profitAmount, 0);

  const filteredMembers = memberProfits.filter(member =>
    member.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [newDistribution, setNewDistribution] = useState({
    quarter: 'Q3',
    year: '2024',
    totalProfit: '',
    distributionPercentage: 80,
    reservePercentage: 20,
    distributionDate: new Date().toISOString().split('T')[0]
  });

  const handleDistributeProfit = () => {
    console.log('Distributing profit:', newDistribution);
    setShowDistributeModal(false);
    setNewDistribution({
      quarter: 'Q3',
      year: '2024',
      totalProfit: '',
      distributionPercentage: 80,
      reservePercentage: 20,
      distributionDate: new Date().toISOString().split('T')[0]
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">লাভ বিতরণ ব্যবস্থাপনা</h1>
          <p className="text-gray-600 mt-1">সদস্যদের মধ্যে লাভ বিতরণ ও ট্র্যাকিং</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDistributeModal(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            লাভ বিতরণ করুন
          </button>
          <button className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-teal-600 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            রিপোর্ট ডাউনলোড
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">মোট লাভ</p>
              <p className="text-2xl font-bold text-gray-900">৳ {currentDistribution.totalProfit.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">বিতরণকৃত</p>
              <p className="text-2xl font-bold text-gray-900">৳ {totalDistributed.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">বকেয়া</p>
              <p className="text-2xl font-bold text-gray-900">৳ {pendingDistribution.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Percent className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">লাভের হার</p>
              <p className="text-2xl font-bold text-gray-900">{currentDistribution.profitRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">মোট সদস্য</p>
              <p className="text-2xl font-bold text-gray-900">{currentDistribution.memberCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Yearly Profit Trend */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">বার্ষিক লাভের ট্রেন্ড</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={yearlyProfitTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => `৳ ${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="profit" stroke="#0A6CFF" strokeWidth={2} name="লাভ" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Sources */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">লাভের উৎস</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={profitSources}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="amount"
              >
                {profitSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `৳ ${value.toLocaleString()}`} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {profitSources.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2`} style={{backgroundColor: item.color}}></div>
                  <span className="text-sm text-gray-600">{item.source}</span>
                </div>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution by Share Range */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">শেয়ার অনুযায়ী বিতরণ</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distributionByShare}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip formatter={(value) => `৳ ${value.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#0A6CFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Distributions */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">সাম্প্রতিক লাভ বিতরণ</h3>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="2024">২০২৪</option>
            <option value="2023">২০২৩</option>
            <option value="2022">২০২২</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  সময়কাল
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  মোট লাভ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  বিতরণকৃত
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  রিজার্ভ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  লাভের হার
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  অবস্থা
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  কার্যক্রম
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profitDistributions.map((distribution) => (
                <tr key={distribution.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{distribution.quarter} {distribution.year}</div>
                      <div className="text-sm text-gray-500">{distribution.distributionDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">৳ {distribution.totalProfit.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">৳ {distribution.distributedAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">৳ {distribution.reservedAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{distribution.profitRate}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(distribution.status)}`}>
                      {distribution.status === 'distributed' && 'বিতরণ সম্পন্ন'}
                      {distribution.status === 'processing' && 'প্রক্রিয়াধীন'}
                      {distribution.status === 'pending' && 'অপেক্ষমান'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedDistribution(distribution);
                        setShowDetailsModal(true);
                      }}
                      className="text-primary hover:text-blue-600 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-secondary hover:text-teal-600">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Profit Details */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">সদস্যদের লাভ বিতরণের বিবরণ</h3>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="সদস্যের নাম বা আইডি খুঁজুন..."
            className="w-64"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader 
              columns={[
                'সদস্যের তথ্য',
                'শেয়ার সংখ্যা',
                'লাভের পরিমাণ',
                'পেমেন্ট পদ্ধতি',
                'অবস্থা',
                'কার্যক্রম'
              ]}
            />
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.memberName}</div>
                      <div className="text-sm text-gray-500">আইডি: {member.somiti_user_id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.shareCount} টি</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">৳ {member.profitAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {member.paymentMethod === 'bank_transfer' && 'ব্যাংক ট্রান্সফার'}
                      {member.paymentMethod === 'cash' && 'নগদ'}
                      {member.paymentMethod === 'mobile_banking' && 'মোবাইল ব্যাংকিং'}
                      {!member.paymentMethod && '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                      {member.status === 'paid' && 'পরিশোধিত'}
                      {member.status === 'pending' && 'অপেক্ষমান'}
                      {member.status === 'processing' && 'প্রক্রিয়াধীন'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {member.status === 'pending' && (
                      <button className="text-green-600 hover:text-green-800 mr-3">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button className="text-primary hover:text-blue-600">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribute Profit Modal */}
      {showDistributeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">নতুন লাভ বিতরণ</h2>
              <button
                onClick={() => setShowDistributeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleDistributeProfit(); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">কোয়ার্টার *</label>
                  <select
                    required
                    value={newDistribution.quarter}
                    onChange={(e) => setNewDistribution({...newDistribution, quarter: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Q1">প্রথম কোয়ার্টার (Q1)</option>
                    <option value="Q2">দ্বিতীয় কোয়ার্টার (Q2)</option>
                    <option value="Q3">তৃতীয় কোয়ার্টার (Q3)</option>
                    <option value="Q4">চতুর্থ কোয়ার্টার (Q4)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">বছর *</label>
                  <select
                    required
                    value={newDistribution.year}
                    onChange={(e) => setNewDistribution({...newDistribution, year: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="2024">২০২৪</option>
                    <option value="2023">২০২৩</option>
                    <option value="2022">২০২২</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">মোট লাভের পরিমাণ (৳) *</label>
                <input
                  type="number"
                  required
                  value={newDistribution.totalProfit}
                  onChange={(e) => setNewDistribution({...newDistribution, totalProfit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="মোট লাভের পরিমাণ লিখুন"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">বিতরণের শতাংশ *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={newDistribution.distributionPercentage}
                    onChange={(e) => {
                      const dist = parseInt(e.target.value);
                      setNewDistribution({
                        ...newDistribution, 
                        distributionPercentage: dist,
                        reservePercentage: 100 - dist
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">রিজার্ভের শতাংশ</label>
                  <input
                    type="number"
                    value={newDistribution.reservePercentage}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">বিতরণের তারিখ *</label>
                <input
                  type="date"
                  required
                  value={newDistribution.distributionDate}
                  onChange={(e) => setNewDistribution({...newDistribution, distributionDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              {/* Calculation Preview */}
              {newDistribution.totalProfit && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">গণনার পূর্বরূপ</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">বিতরণযোগ্য পরিমাণ:</span>
                      <p className="font-medium">৳ {((newDistribution.totalProfit * newDistribution.distributionPercentage) / 100).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">রিজার্ভ পরিমাণ:</span>
                      <p className="font-medium">৳ {((newDistribution.totalProfit * newDistribution.reservePercentage) / 100).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">প্রতি শেয়ার লাভ:</span>
                      <p className="font-medium">৳ {Math.round((newDistribution.totalProfit * newDistribution.distributionPercentage) / 100 / 71).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">মোট সদস্য:</span>
                      <p className="font-medium">৭১ জন</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDistributeModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                >
                  লাভ বিতরণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Distribution Details Modal */}
      {showDetailsModal && selectedDistribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedDistribution.quarter} {selectedDistribution.year} - লাভ বিতরণের বিস্তারিত
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">মোট লাভ</p>
                      <p className="text-xl font-bold text-blue-900">৳ {selectedDistribution.totalProfit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">বিতরণকৃত</p>
                      <p className="text-xl font-bold text-green-900">৳ {selectedDistribution.distributedAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <PieChart className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-600">রিজার্ভ</p>
                      <p className="text-xl font-bold text-purple-900">৳ {selectedDistribution.reservedAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">বিতরণের তথ্য</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">বিতরণের তারিখ:</span>
                      <span className="font-medium">{selectedDistribution.distributionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">লাভের হার:</span>
                      <span className="font-medium">{selectedDistribution.profitRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">মোট সদস্য:</span>
                      <span className="font-medium">{selectedDistribution.memberCount} জন</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">প্রতি শেয়ার লাভ:</span>
                      <span className="font-medium">৳ {selectedDistribution.perShareProfit}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">বিতরণের অনুপাত</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">বিতরণ:</span>
                      <span className="font-medium">{((selectedDistribution.distributedAmount / selectedDistribution.totalProfit) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">রিজার্ভ:</span>
                      <span className="font-medium">{((selectedDistribution.reservedAmount / selectedDistribution.totalProfit) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full" 
                        style={{width: `${(selectedDistribution.distributedAmount / selectedDistribution.totalProfit) * 100}%`}}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>বিতরণকৃত</span>
                      <span>রিজার্ভ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                বন্ধ করুন
              </button>
              <button className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-teal-600">
                রিপোর্ট ডাউনলোড
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitDistribution;