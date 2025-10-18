import React, { useState } from 'react';
import { 
  User, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  CreditCard,
  PieChart,
  Download,
  Eye,
  Clock,
  CheckCircle,
  Award,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Member information (this would come from props or context in real app)
  const memberInfo = {
    id: 'SM-001',
    name: 'মোহাম্মদ রহিম উদ্দিন',
    joinDate: '২০২২-০১-১৫',
    phone: '০১৭১২৩৪৫৬৭৮',
    address: 'ঢাকা, বাংলাদেশ',
    membershipType: 'নিয়মিত সদস্য',
    status: 'সক্রিয়'
  };

  // Financial summary
  const financialSummary = {
    totalShares: 25,
    shareValue: 125000,
    monthlyDeposit: 1200,
    totalDeposits: 28800,
    currentProfit: 15750,
    loanTaken: 50000,
    loanRemaining: 35000,
    nextPaymentDue: '২০২৪-০২-১৫'
  };

  // Monthly deposit history
  const depositHistory = [
    { month: 'আগস্ট ২৩', amount: 1200, status: 'paid' },
    { month: 'সেপ্টেম্বর ২৩', amount: 1200, status: 'paid' },
    { month: 'অক্টোবর ২৩', amount: 1200, status: 'paid' },
    { month: 'নভেম্বর ২৩', amount: 1200, status: 'paid' },
    { month: 'ডিসেম্বর ২৩', amount: 1200, status: 'paid' },
    { month: 'জানুয়ারি ২৪', amount: 1200, status: 'paid' },
    { month: 'ফেব্রুয়ারি ২৪', amount: 1200, status: 'due' }
  ];

  // Profit history
  const profitHistory = [
    { year: '২০২২', profit: 8500, percentage: 8.5 },
    { year: '২০২৩', profit: 12750, percentage: 9.2 },
    { year: '২০২ৄ', profit: 15750, percentage: 10.1 }
  ];

  // Recent transactions
  const recentTransactions = [
    {
      id: 1,
      date: '২০২৪-০১-১৫',
      type: 'monthly_deposit',
      amount: 1200,
      status: 'completed',
      description: 'জানুয়ারি মাসিক জমা'
    },
    {
      id: 2,
      date: '২০২৪-০১-০১',
      type: 'profit_distribution',
      amount: 2500,
      status: 'completed',
      description: '২০২৩ সালের লাভ বিতরণ'
    },
    {
      id: 3,
      date: '২০২৩-১২-১৫',
      type: 'monthly_deposit',
      amount: 1200,
      status: 'completed',
      description: 'ডিসেম্বর মাসিক জমা'
    },
    {
      id: 4,
      date: '২০২৩-১২-০১',
      type: 'loan_payment',
      amount: 5000,
      status: 'completed',
      description: 'ঋণের কিস্তি পরিশোধ'
    },
    {
      id: 5,
      date: '২০২৩-১১-১৫',
      type: 'monthly_deposit',
      amount: 1200,
      status: 'completed',
      description: 'নভেম্বর মাসিক জমা'
    }
  ];

  // Upcoming payments
  const upcomingPayments = [
    {
      id: 1,
      type: 'monthly_deposit',
      amount: 1200,
      dueDate: '২০২৪-০২-১৫',
      description: 'ফেব্রুয়ারি মাসিক জমা',
      priority: 'high'
    },
    {
      id: 2,
      type: 'loan_payment',
      amount: 5000,
      dueDate: '২০২৪-০২-২৮',
      description: 'ঋণের কিস্তি',
      priority: 'medium'
    }
  ];

  // Notices for member
  const memberNotices = [
    {
      id: 1,
      title: 'মাসিক সভার আমন্ত্রণ',
      date: '২০২৪-০২-০১',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      title: 'লাভ বিতরণের ঘোষণা',
      date: '২০২৪-০১-২৮',
      priority: 'medium',
      read: true
    },
    {
      id: 3,
      title: 'নতুন বিনিয়োগ প্রকল্প',
      date: '২০২৪-০১-২৫',
      priority: 'low',
      read: true
    }
  ];

  // Chart data
  const monthlyTrend = [
    { month: 'আগস্ট', deposits: 1200, profit: 850 },
    { month: 'সেপ্টেম্বর', deposits: 1200, profit: 920 },
    { month: 'অক্টোবর', deposits: 1200, profit: 1050 },
    { month: 'নভেম্বর', deposits: 1200, profit: 1180 },
    { month: 'ডিসেম্বর', deposits: 1200, profit: 1250 },
    { month: 'জানুয়ারি', deposits: 1200, profit: 1350 }
  ];

  const shareDistribution = [
    { name: 'মাসিক জমা', value: 28800, color: '#0A6CFF' },
    { name: 'শেয়ার মূল্য', value: 125000, color: '#00C896' },
    { name: 'লাভ', value: 15750, color: '#FFB800' }
  ];

  const getTransactionTypeLabel = (type) => {
    switch(type) {
      case 'monthly_deposit': return 'মাসিক জমা';
      case 'profit_distribution': return 'লাভ বিতরণ';
      case 'loan_payment': return 'ঋণ পরিশোধ';
      case 'share_purchase': return 'শেয়ার ক্রয়';
      default: return type;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'due': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="md-dashboard">

        {/* Member Profile Header */}
        <div className="md-member-profile-header">
          <div className="md-profile-content">
            <div className="md-profile-info">
              <div className="md-avatar-large">
                <User className="h-8 w-8" />
              </div>
              <div className="md-profile-details">
                <h1 className="md-headline-medium">{memberInfo.name}</h1>
                <p className="md-body-medium">সদস্য আইডি: {memberInfo.id}</p>
                <p className="md-body-small">যোগদানের তারিখ: {memberInfo.joinDate}</p>
              </div>
            </div>
            <div className="md-membership-badge">
              <p className="md-label-small">সদস্যপদের ধরন</p>
              <p className="md-label-medium">{memberInfo.membershipType}</p>
            </div>
          </div>
        </div>

        {/* Material Design 3 Stats Cards */}
        <div className="md-stats-grid">
          <div className="md-card md-stats-card">
            <div className="md-stats-content">
              <div className="md-stats-icon">
                <PieChart className="h-6 w-6" />
              </div>
              <div className="md-stats-info">
                <p className="md-label-medium">মোট শেয়ার</p>
                <p className="md-display-small">{financialSummary.totalShares}</p>
                <div className="md-stats-change">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="md-label-small">৳ {financialSummary.shareValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md-card md-stats-card">
            <div className="md-stats-content">
              <div className="md-stats-icon md-stats-icon-success">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="md-stats-info">
                <p className="md-label-medium">বর্তমান লাভ</p>
                <p className="md-display-small">৳ {financialSummary.currentProfit.toLocaleString()}</p>
                <div className="md-stats-change md-stats-change-positive">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="md-label-small">+১০.১% বৃদ্ধি</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md-card md-stats-card">
            <div className="md-stats-content">
              <div className="md-stats-icon md-stats-icon-warning">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="md-stats-info">
                <p className="md-label-medium">মোট জমা</p>
                <p className="md-display-small">৳ {financialSummary.totalDeposits.toLocaleString()}</p>
                <div className="md-stats-change">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="md-label-small">মাসিক ৳ {financialSummary.monthlyDeposit}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md-card md-stats-card">
            <div className="md-stats-content">
              <div className="md-stats-icon md-stats-icon-error">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="md-stats-info">
                <p className="md-label-medium">বকেয়া ঋণ</p>
                <p className="md-display-small">৳ {financialSummary.loanRemaining.toLocaleString()}</p>
                <div className="md-stats-change">
                  <ArrowDownRight className="h-4 w-4" />
                  <span className="md-label-small">মোট ৳ {financialSummary.loanTaken.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Material Design 3 Tab Navigation */}
        <div className="md-tab-navigation">
          <div className="md-tab-bar">
            {[
              { id: 'overview', label: 'সারসংক্ষেপ', icon: PieChart },
              { id: 'transactions', label: 'লেনদেন', icon: DollarSign },
              { id: 'payments', label: 'পেমেন্ট', icon: Calendar },
              { id: 'notices', label: 'নোটিশ', icon: Bell }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`md-tab ${activeTab === tab.id ? 'md-tab-active' : ''}`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="md-label-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="md-tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="md-tab-panel">
              {/* Charts Grid */}
              <div className="md-charts-grid">
                {/* Monthly Trend Chart */}
                <div className="md-card">
                  <div className="md-card-header">
                    <h3 className="md-title-large">মাসিক প্রবণতা</h3>
                  </div>
                  <div className="md-card-content">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `৳ ${value.toLocaleString()}`} />
                        <Line type="monotone" dataKey="deposits" stroke="#0A6CFF" strokeWidth={2} name="জমা" />
                        <Line type="monotone" dataKey="profit" stroke="#00C896" strokeWidth={2} name="লাভ" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Financial Distribution Chart */}
                <div className="md-card">
                  <div className="md-card-header">
                    <h3 className="md-title-large">আর্থিক বিতরণ</h3>
                  </div>
                  <div className="md-card-content">
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={shareDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {shareDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `৳ ${value.toLocaleString()}`} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Profit History */}
              <div className="md-card">
                <div className="md-card-header">
                  <h3 className="md-title-large">বার্ষিক লাভের ইতিহাস</h3>
                </div>
                <div className="md-card-content">
                  <div className="md-profit-history-grid">
                    {profitHistory.map((year, index) => (
                      <div key={index} className="md-profit-card">
                        <div className="md-profit-content">
                          <div className="md-profit-info">
                            <p className="md-label-medium">{year.year}</p>
                            <p className="md-headline-small">৳ {year.profit.toLocaleString()}</p>
                          </div>
                          <div className="md-profit-badge">
                            <p className="md-label-small">{year.percentage}%</p>
                            <Award className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="md-tab-panel">
              <div className="md-card">
                <div className="md-card-header">
                  <div className="md-card-title-section">
                    <h3 className="md-title-large">সাম্প্রতিক লেনদেন</h3>
                    <button className="md-button md-button-filled">
                      <Download className="h-4 w-4" />
                      <span className="md-label-large">রিপোর্ট ডাউনলোড</span>
                    </button>
                  </div>
                </div>
                <div className="md-card-content">
                  <div className="md-list">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="md-list-item">
                        <div className="md-list-item-leading">
                          <div className="md-avatar">
                            {transaction.type === 'monthly_deposit' && <DollarSign className="h-5 w-5" />}
                            {transaction.type === 'profit_distribution' && <TrendingUp className="h-5 w-5" />}
                            {transaction.type === 'loan_payment' && <CreditCard className="h-5 w-5" />}
                          </div>
                        </div>
                        <div className="md-list-item-content">
                          <div className="md-list-item-headline">{transaction.description}</div>
                          <div className="md-list-item-supporting-text">
                            {getTransactionTypeLabel(transaction.type)} • {transaction.date}
                          </div>
                        </div>
                        <div className="md-list-item-trailing">
                          <div className="md-list-item-amount">
                            <p className={`md-label-large ${transaction.type === 'profit_distribution' ? 'md-text-success' : 'md-text-on-surface'}`}>
                              {transaction.type === 'profit_distribution' ? '+' : '-'}৳ {transaction.amount.toLocaleString()}
                            </p>
                            <span className={`md-badge ${transaction.status === 'completed' ? 'md-badge-success' : 'md-badge-warning'}`}>
                              {transaction.status === 'completed' ? 'সম্পন্ন' : 'অপেক্ষমান'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="md-tab-panel">
              {/* Upcoming Payments */}
              <div className="md-card">
                <div className="md-card-header">
                  <h3 className="md-title-large">আসন্ন পেমেন্ট</h3>
                </div>
                <div className="md-card-content">
                  <div className="md-list">
                    {upcomingPayments.map((payment) => (
                      <div key={payment.id} className="md-list-item md-list-item-warning">
                        <div className="md-list-item-leading">
                          <Clock className="h-5 w-5 md-text-warning" />
                        </div>
                        <div className="md-list-item-content">
                          <div className="md-list-item-headline">{payment.description}</div>
                          <div className="md-list-item-supporting-text">
                            নির্ধারিত তারিখ: {payment.dueDate}
                          </div>
                        </div>
                        <div className="md-list-item-trailing">
                          <div className="md-list-item-amount">
                            <p className="md-label-large">৳ {payment.amount.toLocaleString()}</p>
                            <span className={`md-badge ${
                              payment.priority === 'high' ? 'md-badge-error' : 
                              payment.priority === 'medium' ? 'md-badge-warning' : 'md-badge-success'
                            }`}>
                              {payment.priority === 'high' && 'জরুরি'}
                              {payment.priority === 'medium' && 'মাঝারি'}
                              {payment.priority === 'low' && 'কম'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Deposit History */}
              <div className="md-card">
                <div className="md-card-header">
                  <h3 className="md-title-large">মাসিক জমার ইতিহাস</h3>
                </div>
                <div className="md-card-content">
                  <div className="md-deposit-history-grid">
                    {depositHistory.map((deposit, index) => (
                      <div key={index} className={`md-deposit-card ${deposit.status === 'paid' ? 'md-deposit-card-success' : 'md-deposit-card-error'}`}>
                        <div className="md-deposit-content">
                          <div className="md-deposit-info">
                            <p className="md-label-large">{deposit.month}</p>
                            <p className="md-body-medium">৳ {deposit.amount.toLocaleString()}</p>
                          </div>
                          <div className="md-deposit-status">
                            {deposit.status === 'paid' ? (
                              <CheckCircle className="h-5 w-5 md-text-success" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 md-text-error" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notices Tab */}
          {activeTab === 'notices' && (
            <div className="md-tab-panel">
              <div className="md-card">
                <div className="md-card-header">
                  <h3 className="md-title-large">সদস্য নোটিশ</h3>
                </div>
                <div className="md-card-content">
                  <div className="md-list">
                    {memberNotices.map((notice) => (
                      <div key={notice.id} className={`md-list-item md-list-item-three-line ${!notice.read ? 'md-list-item-unread' : ''}`}>
                        <div className="md-list-item-leading">
                          <div className={`md-avatar ${
                            notice.priority === 'high' ? 'md-avatar-error' :
                            notice.priority === 'medium' ? 'md-avatar-warning' :
                            'md-avatar-success'
                          }`}>
                            <Bell className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="md-list-item-content">
                          <div className="md-list-item-headline">{notice.title}</div>
                          <div className="md-list-item-supporting-text md-text-on-surface-variant">
                            <Calendar className="h-4 w-4 mr-1 inline" />
                            {notice.date}
                          </div>
                        </div>
                        <div className="md-list-item-trailing">
                          <div className="md-list-item-actions">
                            <span className={`md-badge ${
                              notice.priority === 'high' ? 'md-badge-error' :
                              notice.priority === 'medium' ? 'md-badge-warning' :
                              'md-badge-success'
                            }`}>
                              {notice.priority === 'high' && 'জরুরি'}
                              {notice.priority === 'medium' && 'মাঝারি'}
                              {notice.priority === 'low' && 'সাধারণ'}
                            </span>
                            <button className="md-icon-button">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <button className="md-fab md-fab-primary">
          <Plus className="h-6 w-6" />
        </button>


      </div>
  );
};

export default MemberDashboard;