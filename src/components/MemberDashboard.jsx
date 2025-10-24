import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import { MemberService } from '../firebase/memberService';
import { TransactionService, FundService } from '../firebase/transactionService';
import TransactionDetailsCard from './common/TransactionDetailsCard';
import LoadingAnimation from './common/LoadingAnimation';
import { useUser } from '../contexts/UserContext';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, loading: userLoading, error: userError } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState({
    transactions: true,
    fundData: true,
    initial: true
  });
  const [error, setError] = useState(null);
  const [somitiUserId, setSomitiUserId] = useState('');
  const [joiningDate, setJoiningDate] = useState('');

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

  // Transaction Details Card states (replacing modal states)
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionCard, setShowTransactionCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  // Load data from Firebase
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(prev => ({ ...prev, initial: true }));
        setError(null);

        // Load transactions, fund data, and calculate somiti_user_id in parallel
        const [transactionsResult, fundResult, membersResult] = await Promise.all([
          TransactionService.getTransactionsByUserId(currentUser.uid).then(result => {
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
          }),

          // Calculate somiti_user_id
          MemberService.getActiveMembers().then(result => {
            if (result.success && result.data) {
              const allMembers = result.data;
              
              const sortedMembers = allMembers.sort((a, b) => {
                // Ensure we have valid dates
                const joiningDateA = a.joiningDate || a.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0];
                const joiningDateB = b.joiningDate || b.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0];
                
                const dateA = new Date(joiningDateA);
                const dateB = new Date(joiningDateB);
                
                // First sort by joining date
                if (dateA.getTime() !== dateB.getTime()) {
                  return dateA - dateB;
                }
                
                // If joining dates are same, sort by createdAt timestamp
                const createdA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
                const createdB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
                
                // If creation times are also same, sort by document ID for consistency
                if (createdA.getTime() === createdB.getTime()) {
                  return a.id.localeCompare(b.id);
                }
                
                return createdA - createdB;
              });
              
              const currentUserIndex = sortedMembers.findIndex(member => member.id === currentUser.uid);
              const calculatedSomitiUserId = currentUserIndex !== -1 ? currentUserIndex + 1 : '';
              setSomitiUserId(calculatedSomitiUserId);
               
               // Also get the actual joining date for the current user
               const currentUserData = sortedMembers.find(member => member.id === currentUser.uid);
               if (currentUserData) {
                 const actualJoiningDate = currentUserData.joiningDate || currentUserData.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || '';
                 setJoiningDate(actualJoiningDate);
               }
            }
            return result;
          }).catch(error => {
            console.error('সদস্য তথ্য লোড করতে ত্রুটি:', error);
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

    loadDashboardData();
  }, [currentUser]);

  // Handle transaction click with position tracking
  const handleTransactionClick = (transaction, event) => {
    // Ensure we have a valid transaction object
    if (!transaction) {
      console.error('No transaction data provided');
      return;
    }
    
    // Get click position for floating card
    setCardPosition({
      x: event.clientX,
      y: event.clientY
    });
    
    // Create a safe transaction object with defaults
    const safeTransaction = {
      id: transaction.id || 'N/A',
      memberName: transaction.memberName || 'অজানা সদস্য',
      transactionType: transaction.transactionType || transaction.type || 'other',
      type: transaction.type || transaction.transactionType || 'other',
      amount: transaction.amount || 0,
      date: transaction.date || transaction.createdAt || null,
      createdAt: transaction.createdAt || null,
      description: transaction.description || '',
      transactionId: transaction.transactionId || transaction.id || 'N/A',
      status: transaction.status || 'completed',
      paymentMethod: transaction.paymentMethod || 'cash',
      month: transaction.month,
      monthName: transaction.monthName || '',
      reference: transaction.reference,
      processedBy: transaction.processedBy,
      ...transaction // Spread the original transaction to preserve any additional fields
    };
    
    setSelectedTransaction(safeTransaction);
    setShowTransactionCard(true);
  };

  const closeTransactionCard = () => {
    setShowTransactionCard(false);
    setSelectedTransaction(null);
  };

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

      const calculatedShares = currentUser?.shareCount || currentUser?.totalShares || 0;
      const sharePrice = 500; // Fixed share price of 500 tk per share

      // Calculate Outstanding Loan (বকেয়া ঋণ) based on missed monthly payments
      const calculateOutstandingDue = () => {
        const currentDate = new Date();
        const memberJoinDate = currentUser?.joinDate ? new Date(currentUser.joinDate.seconds * 1000) : new Date(currentDate.getFullYear(), 0, 1); // Default to start of current year
        
        // Get all months from join date to current month
        const monthsFromJoin = [];
        const startDate = new Date(memberJoinDate.getFullYear(), memberJoinDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
          monthsFromJoin.push(new Date(d));
        }
        
        // Get months with successful payments
        const paidMonths = monthlyDepositTransactions.map(t => {
          const transactionDate = new Date(t.createdAt?.seconds * 1000);
          return `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`;
        });
        
        // Find missed months
        const missedMonths = monthsFromJoin.filter(month => {
          const monthKey = `${month.getFullYear()}-${month.getMonth()}`;
          return !paidMonths.includes(monthKey) && month < new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        });
        
        // Calculate total due amount (missed months × share value)
        const totalDue = missedMonths.length * sharePrice;
        
        return {
          totalDue,
          missedMonthsCount: missedMonths.length,
          hasDue: totalDue > 0
        };
      };

      const outstandingInfo = calculateOutstandingDue();
      
      setFinancialSummary(prev => ({
        ...prev,
        totalShares: calculatedShares, // Use actual share count from member data
        shareValue: calculatedShares * sharePrice, // Calculate share value: shares × 500
        monthlyDeposit: avgMonthlyDeposit,
        totalDeposits: memberDeposits,
        loanTaken: memberLoans,
        loanRemaining: outstandingInfo.totalDue, // Use calculated due amount instead of loan remaining
        outstandingDue: outstandingInfo.totalDue,
        missedPayments: outstandingInfo.missedMonthsCount,
        hasDue: outstandingInfo.hasDue
      }));
    }
  }, [transactions, fundData, currentUser]);

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
        
        // Function to get month name from transaction
        const getMonthName = (transaction, date) => {
          // If transaction has month name, use it
          if (transaction.monthName) {
            return transaction.monthName;
          }
          
          // Otherwise, extract month from date
          const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
          return monthNames[date.getMonth()];
        };
        
        return {
          id: t.id,
          date: getMonthName(t, date),
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

  // Show loading animation if user is still loading or initial data is loading
  if (userLoading || loading.initial) {
    return <LoadingAnimation />;
  }

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
                <h1 className="md-headline-medium">{currentUser?.name || 'লোড হচ্ছে...'}</h1>
                <p className="md-body-medium">সদস্য আইডি: {somitiUserId || 'লোড হচ্ছে...'}</p>
                <p className="md-body-small">যোগদানের তারিখ: {joiningDate || 'লোড হচ্ছে...'}</p>
              </div>
            </div>
            <div className="md-membership-badge">
              <p className="md-label-small">সদস্যপদের ধরন</p>
              <p className="md-label-medium">{currentUser?.membershipType || 'নিয়মিত সদস্য'}</p>
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
                <p className="md-label-medium">আমার শেয়ার</p>
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
                    `৳ ${financialSummary.shareValue.toLocaleString()}`
                  }
                </p>
                <div className="md-stats-change">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="md-label-small">
                    {loading.transactions ? 
                      <LoadingSkeleton className="w-16 h-4" /> : 
                      `মাসিক = ৳${financialSummary.shareValue.toLocaleString()}`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="md-card md-stats-card">
            <div className="md-stats-content">
              <div className={`md-stats-icon ${financialSummary.hasDue ? 'md-stats-icon-error' : 'md-stats-icon-success'}`}>
                {financialSummary.hasDue ? (
                  <AlertTriangle className="h-6 w-6" />
                ) : (
                  <CreditCard className="h-6 w-6" />
                )}
              </div>
              <div className="md-stats-info">
                <p className="md-label-medium">বকেয়া ঋণ</p>
                <p className={`md-display-small ${financialSummary.hasDue ? 'text-red-600' : ''}`}>
                  {loading.transactions ? 
                    <LoadingSkeleton className="w-20 h-8" /> : 
                    `৳ ${financialSummary.loanRemaining.toLocaleString()}`
                  }
                </p>
                <div className="md-stats-change">
                  {financialSummary.hasDue ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className={`md-label-small ${financialSummary.hasDue ? 'text-red-600' : ''}`}>
                    {loading.transactions ? 
                      <LoadingSkeleton className="w-24 h-4" /> : 
                      financialSummary.hasDue ? 
                        `${financialSummary.missedPayments} মাস বকেয়া` :
                        'কোনো বকেয়া নেই'
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
                        <div 
                          key={transaction.id} 
                          className="md-list-item" 
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => handleTransactionClick(transaction, e)}
                        >
                          <div className="md-list-item-leading">
                            <div className="md-avatar">
                              {transaction.type === 'monthly_deposit' && <DollarSign className="h-5 w-5" />}
                              {transaction.type === 'loan_payment' && <CreditCard className="h-5 w-5" />}
                            </div>
                          </div>
                          <div className="md-list-item-content">
                            <div className="md-list-item-headline">{transaction.description}</div>
                            <div className="md-list-item-supporting-text">
                              {getTransactionTypeLabel(transaction.type)} • 
                              <span className="month-badge" style={{
                                backgroundColor: '#fff3e0',
                                color: '#f57c00',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontSize: '11px',
                                fontWeight: '600',
                                display: 'inline-block',
                                marginLeft: '4px',
                                border: '1px solid #ffcc02'
                              }}>
                                {transaction.date}
                              </span>
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
                  
                  {/* See More Button */}
                  {!loading.transactions && recentTransactions.length > 0 && (
                    <div className="mt-6 text-center">
                      <button 
                        onClick={() => navigate('/transactions')}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:shadow-sm transition-all duration-300 group"
                      >
                        <span>সব লেনদেন দেখুন</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
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

        {/* Transaction Details Floating Card */}
        <TransactionDetailsCard
          transaction={selectedTransaction}
          isVisible={showTransactionCard}
          onClose={closeTransactionCard}
          position={cardPosition}
        />

      </div>
  );
};

export default MemberDashboard;