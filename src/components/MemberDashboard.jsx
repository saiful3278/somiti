import React, { useState, useEffect } from 'react';
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
import { MemberService } from '../firebase/memberService';
import { TransactionService, FundService } from '../firebase/transactionService';

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState({
    member: true,
    transactions: true,
    fundData: true,
    initial: true
  });
  const [error, setError] = useState(null);

  // State for real data
  const [memberInfo, setMemberInfo] = useState({
    id: 'SM-001',
    name: 'মোহাম্মদ রহিম উদ্দিন',
    joinDate: '২০২২-০১-১৫',
    phone: '০১৭১২৩৪৫৬৭৮',
    address: 'ঢাকা, বাংলাদেশ',
    membershipType: 'নিয়মিত সদস্য',
    status: 'সক্রিয়'
  });

  const [financialSummary, setFinancialSummary] = useState({
    totalShares: 0,
    shareValue: 0,
    monthlyDeposit: 0,
    totalDeposits: 0,
    currentProfit: 0,
    loanTaken: 0,
    loanRemaining: 0,
    nextPaymentDue: '২০২৪-০২-১৫'
  });

  const [transactions, setTransactions] = useState([]);
  const [fundData, setFundData] = useState({});

  // Load data from Firebase
  useEffect(() => {
    const loadMemberData = async () => {
      try {
        setLoading(prev => ({ ...prev, initial: true }));
        setError(null);

        // Load all data in parallel
        const [membersResult, transactionsResult, fundResult] = await Promise.all([
          MemberService.getAllMembers().then(result => {
            if (result.success && result.data.length > 0) {
              // For demo, use first member or find specific member
              const currentMember = result.data[0]; // In real app, this would be based on logged-in user
              setMemberInfo({
                id: currentMember.id || 'SM-001',
                name: currentMember.name || 'মোহাম্মদ রহিম উদ্দিন',
                joinDate: currentMember.joinDate || '২০২২-০১-১৫',
                phone: currentMember.phone || '০১৭১২৩৪৫৬৭৮',
                address: currentMember.address || 'ঢাকা, বাংলাদেশ',
                membershipType: currentMember.membershipType || 'নিয়মিত সদস্য',
                status: currentMember.status || 'সক্রিয়',
                shareCount: currentMember.shareCount || 0,
                totalShares: currentMember.totalShares || 0
              });
            }
            setLoading(prev => ({ ...prev, member: false }));
            return result;
          }).catch(error => {
            console.error('সদস্য তথ্য লোড করতে ত্রুটি:', error);
            setLoading(prev => ({ ...prev, member: false }));
            return { success: false, error };
          }),

          TransactionService.getAllTransactions().then(result => {
            if (result.success) {
              setTransactions(result.data || []);
            }
            setLoading(prev => ({ ...prev, transactions: false }));
            return result;
          }).catch(error => {
            console.error('লেনদেন তথ্য লোড করতে ত্রুটি:', error);
            setLoading(prev => ({ ...prev, transactions: false }));
            return { success: false, error };
          }),

          FundService.getFundSummary().then(result => {
            if (result.success && result.data) {
              setFundData(result.data);
            }
            setLoading(prev => ({ ...prev, fundData: false }));
            return result;
          }).catch(error => {
            console.error('তহবিল তথ্য লোড করতে ত্রুটি:', error);
            setLoading(prev => ({ ...prev, fundData: false }));
            return { success: false, error };
          })
        ]);

      } catch (error) {
        console.error('ডেটা লোড করতে ত্রুটি:', error);
        setError('ডেটা লোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    loadMemberData();
  }, []);

  // Calculate financial summary from real data
  useEffect(() => {
    if (transactions.length > 0 && fundData && Object.keys(fundData).length > 0) {
      // Calculate member-specific financial data from transactions
      const memberDeposits = transactions
        .filter(t => t.transactionType === 'monthly_deposit' || t.transactionType === 'share_purchase')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const memberLoans = transactions
        .filter(t => t.transactionType === 'loan_disbursement')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const loanRepayments = transactions
        .filter(t => t.transactionType === 'loan_repayment')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      // Calculate average monthly deposit
      const monthlyDepositTransactions = transactions.filter(t => t.transactionType === 'monthly_deposit');
      const avgMonthlyDeposit = monthlyDepositTransactions.length > 0 
        ? Math.round(monthlyDepositTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) / monthlyDepositTransactions.length)
        : 0;

      const calculatedShares = memberInfo.shareCount || memberInfo.totalShares || 0;
      
      setFinancialSummary(prev => ({
        ...prev,
        totalShares: calculatedShares, // Use actual share count from member data
        shareValue: memberDeposits,
        monthlyDeposit: avgMonthlyDeposit,
        totalDeposits: memberDeposits,
        loanTaken: memberLoans,
        loanRemaining: memberLoans - loanRepayments
      }));
    }
  }, [transactions, fundData, memberInfo]);

  // Generate deposit history from real transactions
  const depositHistory = React.useMemo(() => {
    const monthlyDeposits = transactions
      .filter(t => t.transactionType === 'monthly_deposit')
      .sort((a, b) => new Date(b.createdAt?.seconds * 1000) - new Date(a.createdAt?.seconds * 1000))
      .slice(0, 7)
      .map(t => {
        const date = new Date(t.createdAt?.seconds * 1000);
        const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear().toString().slice(-2);
        return {
          month: `${month} ${year}`,
          amount: t.amount || 0,
          status: 'paid'
        };
      });
    
    // Add current month as due if not found
    const currentDate = new Date();
    const currentMonthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const currentMonth = `${currentMonthNames[currentDate.getMonth()]} ${currentDate.getFullYear().toString().slice(-2)}`;
    
    if (!monthlyDeposits.some(d => d.month === currentMonth)) {
      // Use average monthly deposit or 0 if no data
      const avgAmount = monthlyDeposits.length > 0 
        ? Math.round(monthlyDeposits.reduce((sum, d) => sum + d.amount, 0) / monthlyDeposits.length)
        : 0;
      
      monthlyDeposits.unshift({
        month: currentMonth,
        amount: avgAmount,
        status: 'due'
      });
    }
    
    return monthlyDeposits.slice(0, 7);
  }, [transactions]);



  // Generate recent transactions from real data
  const recentTransactions = React.useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.createdAt?.seconds * 1000) - new Date(a.createdAt?.seconds * 1000))
      .slice(0, 5)
      .map(t => {
        const date = new Date(t.createdAt?.seconds * 1000);
        const typeMap = {
          'monthly_deposit': 'মাসিক জমা',
          'share_purchase': 'শেয়ার ক্রয়',
          'loan_disbursement': 'ঋণ গ্রহণ',
          'loan_repayment': 'ঋণ পরিশোধ'
        };
        
        return {
          id: t.id,
          date: date.toLocaleDateString('bn-BD'),
          type: t.transactionType,
          amount: t.amount || 0,
          status: 'completed',
          description: `${typeMap[t.transactionType] || t.transactionType} - ${t.memberName || 'সদস্য'}`
        };
      });
  }, [transactions]);

  // Upcoming payments based on real data
  const upcomingPayments = React.useMemo(() => {
    const payments = [];
    
    // Add monthly deposit if there's a monthly deposit amount
    if (financialSummary.monthlyDeposit > 0) {
      payments.push({
        id: 1,
        type: 'monthly_deposit',
        amount: financialSummary.monthlyDeposit,
        dueDate: '২০২৪-০২-১৫',
        description: 'ফেব্রুয়ারি মাসিক জমা',
        priority: 'high'
      });
    }
    
    // Add loan payment if there's remaining loan
    if (financialSummary.loanRemaining > 0) {
      const monthlyLoanPayment = Math.min(financialSummary.loanRemaining, Math.round(financialSummary.loanRemaining / 12));
      payments.push({
        id: 2,
        type: 'loan_payment',
        amount: monthlyLoanPayment,
        dueDate: '২০২৪-০২-২৮',
        description: 'ঋণের কিস্তি',
        priority: 'medium'
      });
    }
    
    return payments;
  }, [financialSummary]);

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
      title: 'নতুন বিনিয়োগ প্রকল্প',
      date: '২০২৪-০১-২৫',
      priority: 'low',
      read: true
    }
  ];

  // Generate chart data from real transactions
  const monthlyTrend = React.useMemo(() => {
    const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const last6Months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];
      
      // Calculate deposits for this month
      const monthlyDeposits = transactions
        .filter(t => {
          if (!t.createdAt) return false;
          const transactionDate = new Date(t.createdAt.seconds * 1000);
          return transactionDate.getMonth() === date.getMonth() && 
                 transactionDate.getFullYear() === date.getFullYear() &&
                 t.transactionType === 'monthly_deposit';
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      last6Months.push({
        month: monthName,
        deposits: monthlyDeposits
      });
    }
    
    return last6Months;
  }, [transactions]);

  const shareDistribution = React.useMemo(() => {
    return [
      { name: 'মাসিক জমা', value: financialSummary.totalDeposits, color: '#0A6CFF' },
      { name: 'শেয়ার মূল্য', value: financialSummary.shareValue, color: '#00C896' }
    ];
  }, [financialSummary]);

  const getTransactionTypeLabel = (type) => {
    switch(type) {
      case 'monthly_deposit': return 'মাসিক জমা';
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

  // Helper function to create loading skeleton
  const LoadingSkeleton = ({ className = "", height = "h-4" }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${height} ${className}`}></div>
  );

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
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <AlertTriangle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="md-stats-grid">
          <div className="md-card md-stats-card">
            <div className="md-stats-content">
              <div className="md-stats-icon">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="md-stats-info">
                <p className="md-label-medium">মোট তহবিল</p>
                <p className="md-display-small">
                  {loading.fundData ? 
                    <LoadingSkeleton className="w-24 h-8" /> : 
                    `৳ ${(fundData.totalBalance || fundData.totalAmount || 0).toLocaleString()}`
                  }
                </p>
                <div className="md-stats-change">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="md-label-small">সমিতির মোট তহবিল</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md-card md-stats-card">
            <div className="md-stats-content">
              <div className="md-stats-icon">
                <PieChart className="h-6 w-6" />
              </div>
              <div className="md-stats-info">
                <p className="md-label-medium">মোট শেয়ার</p>
                <p className="md-display-small">
                  {loading.member || loading.transactions ? 
                    <LoadingSkeleton className="w-16 h-8" /> : 
                    financialSummary.totalShares
                  }
                </p>
                <div className="md-stats-change">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="md-label-small">
                    {loading.member || loading.transactions ? 
                      <LoadingSkeleton className="w-20 h-4" /> : 
                      `৳ ${financialSummary.shareValue.toLocaleString()}`
                    }
                  </span>
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
                <p className="md-display-small">
                  {loading.transactions ? 
                    <LoadingSkeleton className="w-24 h-8" /> : 
                    `৳ ${financialSummary.totalDeposits.toLocaleString()}`
                  }
                </p>
                <div className="md-stats-change">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="md-label-small">
                    {loading.transactions ? 
                      <LoadingSkeleton className="w-16 h-4" /> : 
                      `মাসিক ৳ ${financialSummary.monthlyDeposit}`
                    }
                  </span>
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
                <p className="md-display-small">
                  {loading.transactions ? 
                    <LoadingSkeleton className="w-20 h-8" /> : 
                    `৳ ${financialSummary.loanRemaining.toLocaleString()}`
                  }
                </p>
                <div className="md-stats-change">
                  <ArrowDownRight className="h-4 w-4" />
                  <span className="md-label-small">
                    {loading.transactions ? 
                      <LoadingSkeleton className="w-24 h-4" /> : 
                      `মোট ৳ ${financialSummary.loanTaken.toLocaleString()}`
                    }
                  </span>
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
                    {loading.transactions ? (
                      <div className="space-y-4">
                        <LoadingSkeleton className="w-full h-6" />
                        <LoadingSkeleton className="w-full h-48" />
                        <div className="flex space-x-4">
                          <LoadingSkeleton className="w-16 h-4" />
                          <LoadingSkeleton className="w-16 h-4" />
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlyTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => `৳ ${value.toLocaleString()}`} />
                          <Line type="monotone" dataKey="deposits" stroke="#0A6CFF" strokeWidth={2} name="জমা" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Financial Distribution Chart */}
                <div className="md-card">
                  <div className="md-card-header">
                    <h3 className="md-title-large">আর্থিক বিতরণ</h3>
                  </div>
                  <div className="md-card-content">
                    {loading.transactions || loading.fundData ? (
                      <div className="space-y-4">
                        <LoadingSkeleton className="w-full h-6" />
                        <div className="flex justify-center">
                          <LoadingSkeleton className="w-48 h-48 rounded-full" />
                        </div>
                        <div className="flex justify-center space-x-4">
                          <LoadingSkeleton className="w-20 h-4" />
                          <LoadingSkeleton className="w-20 h-4" />
                          <LoadingSkeleton className="w-20 h-4" />
                        </div>
                      </div>
                    ) : (
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
                    )}
                  </div>
                </div>
              </div>

              {/* Profit History */}

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
                    {loading.transactions ? (
                      <>
                        {[1, 2, 3, 4, 5].map((index) => (
                          <div key={index} className="md-list-item">
                            <div className="md-list-item-leading">
                              <LoadingSkeleton className="w-10 h-10 rounded-full" />
                            </div>
                            <div className="md-list-item-content">
                              <LoadingSkeleton className="w-48 h-4 mb-2" />
                              <LoadingSkeleton className="w-32 h-3" />
                            </div>
                            <div className="md-list-item-trailing">
                              <div className="md-list-item-amount">
                                <LoadingSkeleton className="w-20 h-4 mb-2" />
                                <LoadingSkeleton className="w-16 h-5 rounded-full" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="md-list-item">
                          <div className="md-list-item-leading">
                            <div className="md-avatar">
                              {transaction.type === 'monthly_deposit' && <DollarSign className="h-5 w-5" />}
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
                              <p className="md-label-large md-text-on-surface">
                                -৳ {transaction.amount.toLocaleString()}
                              </p>
                              <span className={`md-badge ${transaction.status === 'completed' ? 'md-badge-success' : 'md-badge-warning'}`}>
                                {transaction.status === 'completed' ? 'সম্পন্ন' : 'অপেক্ষমান'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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
                    {loading.transactions ? (
                      <>
                        {[1, 2].map((index) => (
                          <div key={index} className="md-list-item md-list-item-warning">
                            <div className="md-list-item-leading">
                              <LoadingSkeleton className="w-5 h-5 rounded-full" />
                            </div>
                            <div className="md-list-item-content">
                              <LoadingSkeleton className="w-40 h-4 mb-2" />
                              <LoadingSkeleton className="w-32 h-3" />
                            </div>
                            <div className="md-list-item-trailing">
                              <div className="md-list-item-amount">
                                <LoadingSkeleton className="w-20 h-4 mb-2" />
                                <LoadingSkeleton className="w-16 h-5 rounded-full" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      upcomingPayments.map((payment) => (
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
                      ))
                    )}
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
                    {loading.transactions ? (
                      <>
                        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                          <div key={index} className="md-deposit-card">
                            <div className="md-deposit-content">
                              <div className="md-deposit-info">
                                <LoadingSkeleton className="w-20 h-4 mb-2" />
                                <LoadingSkeleton className="w-16 h-4" />
                              </div>
                              <div className="md-deposit-status">
                                <LoadingSkeleton className="w-5 h-5 rounded-full" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      depositHistory.map((deposit, index) => (
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
                      ))
                    )}
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
                    {loading.initial ? (
                      <>
                        {[1, 2, 3, 4].map((index) => (
                          <div key={index} className="md-list-item md-list-item-three-line">
                            <div className="md-list-item-leading">
                              <LoadingSkeleton className="w-10 h-10 rounded-full" />
                            </div>
                            <div className="md-list-item-content">
                              <LoadingSkeleton className="w-48 h-4 mb-2" />
                              <LoadingSkeleton className="w-32 h-3" />
                            </div>
                            <div className="md-list-item-trailing">
                              <div className="md-list-item-actions">
                                <LoadingSkeleton className="w-16 h-5 rounded-full mb-2" />
                                <LoadingSkeleton className="w-8 h-8 rounded-full" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      memberNotices.map((notice) => (
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
                      ))
                    )}
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