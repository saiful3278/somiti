import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  PiggyBank, 
  TrendingUp, 
  DollarSign, 
  Bell, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Plus,
  MoreVertical,
  Loader2,
  UserPlus,
  Receipt
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MemberService, TransactionService, FundService } from '../firebase';
import TransactionDetailsCard from './common/TransactionDetailsCard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    members: true,
    transactions: true,
    fundData: true,
    initial: true
  });
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalFunds: 0,
    monthlyDeposits: 0,
    recentTransactions: [],
    monthlyData: []
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionCard, setShowTransactionCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  
  // Add new state for FAB menu
  const [showFabMenu, setShowFabMenu] = useState(false);

  // Generate monthly deposits data from transactions
  const generateMonthlyDepositsData = (transactions) => {
    const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const last6Months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = monthNames[date.getMonth()];
      
      // Calculate deposits for this month
      const monthlyDeposits = transactions
        .filter(t => {
          if (!t.createdAt || t.transactionType !== 'monthly_deposit') return false;
          const transactionDate = new Date(t.createdAt.seconds * 1000);
          return transactionDate.getMonth() === date.getMonth() && 
                 transactionDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      last6Months.push({
        month: monthName,
        deposits: monthlyDeposits
      });
    }
    
    return last6Months;
  };

  // Add handlers for FAB menu
  const handleNewMember = () => {
    setShowFabMenu(false);
    navigate('/member-list', { state: { openAddMemberModal: true } });
  };

  const handleNewTransaction = () => {
    setShowFabMenu(false);
    // Navigate to a page that will open AddTransaction modal
    // Since AddTransaction is a modal component, we need to handle this differently
    // We can create a dedicated page or pass state to open the modal
    navigate('/add-transaction');
  };

  const toggleFabMenu = () => {
    setShowFabMenu(!showFabMenu);
  };

  // Close FAB menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFabMenu && !event.target.closest('.md-fab-container')) {
        setShowFabMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFabMenu]);

  // Load dashboard data from Firebase
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load all data in parallel
        const [memberResult, fundSummary, transactions] = await Promise.all([
          MemberService.getAllMembers().then(result => {
            if (result.success) {
              const members = result.data;
              const activeMembers = members.filter(member => member.status === 'active').length;
              setDashboardData(prev => ({
                ...prev,
                totalMembers: members.length,
                activeMembers
              }));
              setLoading(prev => ({ ...prev, members: false }));
              return members;
            } else {
              console.error('Error loading members:', result.error);
              setLoading(prev => ({ ...prev, members: false }));
              return [];
            }
          }).catch(error => {
            console.error('Error loading members:', error);
            setLoading(prev => ({ ...prev, members: false }));
            return [];
          }),
          
          FundService.getFundSummary().then(result => {
            if (result.success && result.data) {
              const fundSummary = result.data;
              setDashboardData(prev => ({
                ...prev,
                totalFunds: fundSummary.totalAmount || 0,
                monthlyDeposits: fundSummary.monthlyDeposits || 0
              }));
              setLoading(prev => ({ ...prev, fundData: false }));
              return fundSummary;
            } else {
              console.error('Error loading fund summary:', result.error);
              setLoading(prev => ({ ...prev, fundData: false }));
              return {};
            }
          }).catch(error => {
            console.error('Error loading fund summary:', error);
            setLoading(prev => ({ ...prev, fundData: false }));
            return {};
          }),
          
          TransactionService.getAllTransactions().then(result => {
            if (result.success) {
              const allTransactions = result.data || [];
              const recentTransactions = allTransactions.slice(0, 10);
              const monthlyData = generateMonthlyDepositsData(allTransactions);
              
              setDashboardData(prev => ({
                ...prev,
                recentTransactions,
                monthlyData
              }));
              setLoading(prev => ({ ...prev, transactions: false }));
              return allTransactions;
            } else {
              console.error('Error loading transactions:', result.error);
              setLoading(prev => ({ ...prev, transactions: false }));
              return [];
            }
          }).catch(error => {
            console.error('Error loading transactions:', error);
            setLoading(prev => ({ ...prev, transactions: false }));
            return [];
          })
        ]);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    loadDashboardData();
  }, []);

  // Generate summary stats from Firebase data
  const summaryStats = [
    {
      title: 'মোট সদস্য',
      value: dashboardData.totalMembers.toString(),
      change: `+${dashboardData.activeMembers}`,
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'মোট তহবিল',
      value: `৳ ${dashboardData.totalFunds.toLocaleString()}`,
      change: '+১২%',
      changeType: 'increase',
      icon: PiggyBank,
      color: 'bg-green-500',
    },
    {
      title: 'মাসিক জমা',
      value: `৳ ${dashboardData.monthlyDeposits.toLocaleString()}`,
      change: '+৫%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  // Transaction card handlers with position tracking
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

  // Monthly deposits data for chart - using real data from transactions
  const monthlyData = dashboardData.monthlyData || [];



  // Generate recent activities from Firebase data
  const recentActivities = dashboardData.recentTransactions.length > 0 
    ? dashboardData.recentTransactions.map((transaction, index) => {
        // Map transaction types to Bengali labels and determine action
        const getTransactionInfo = (transactionType) => {
          const typeMap = {
            'monthly_deposit': { label: 'মাসিক জমা', action: 'জমা দিয়েছেন', icon: PiggyBank, color: 'text-green-600' },
            'share_purchase': { label: 'শেয়ার ক্রয়', action: 'শেয়ার কিনেছেন', icon: PiggyBank, color: 'text-blue-600' },
            'loan_disbursement': { label: 'ঋণ গ্রহণ', action: 'ঋণ নিয়েছেন', icon: DollarSign, color: 'text-orange-600' },
            'loan_repayment': { label: 'ঋণ পরিশোধ', action: 'ঋণ পরিশোধ করেছেন', icon: PiggyBank, color: 'text-green-600' },
            'profit_distribution': { label: 'লাভ বিতরণ', action: 'লাভ পেয়েছেন', icon: PiggyBank, color: 'text-green-600' },
            'penalty': { label: 'জরিমানা', action: 'জরিমানা দিয়েছেন', icon: DollarSign, color: 'text-red-600' },
            'other': { label: 'অন্যান্য', action: 'লেনদেন করেছেন', icon: DollarSign, color: 'text-gray-600' }
          };
          return typeMap[transactionType] || typeMap['other'];
        };

        const transactionInfo = getTransactionInfo(transaction.transactionType);
        
        // Function to get month name from transaction
        const getMonthName = (transaction) => {
          // If transaction has month name, use it
          if (transaction.monthName) {
            return transaction.monthName;
          }
          
          // Otherwise, extract month from timestamp
          if (transaction.createdAt) {
            const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
            const date = new Date(transaction.createdAt.seconds * 1000);
            return monthNames[date.getMonth()];
          }
          
          return 'এই মাসে';
        };
        
        return {
          id: transaction.id || index,
          type: transaction.transactionType,
          message: `${transaction.memberName || 'সদস্য'} ${transaction.amount.toLocaleString()} টাকা ${transactionInfo.action}`,
          time: getMonthName(transaction),
          icon: transactionInfo.icon,
          color: transactionInfo.color,
          originalTransaction: transaction,
        };
      })
    : [
        {
          id: 1,
          type: 'member_join',
          message: 'নতুন সদস্য মোহাম্মদ রহিম যোগদান করেছেন',
          time: '২ ঘন্টা আগে',
          icon: Users,
          color: 'text-blue-600',
          originalTransaction: {
            id: 'dummy-1',
            memberName: 'মোহাম্মদ রহিম',
            transactionType: 'member_join',
            amount: 0,
            description: 'নতুন সদস্য যোগদান',
            createdAt: new Date()
          }
        },
        {
          id: 2,
          type: 'deposit',
          message: 'ফাতেমা খাতুন ৫,০০০ টাকা জমা দিয়েছেন',
          time: '৪ ঘন্টা আগে',
          icon: PiggyBank,
          color: 'text-green-600',
          originalTransaction: {
            id: 'dummy-2',
            memberName: 'ফাতেমা খাতুন',
            transactionType: 'monthly_deposit',
            amount: 5000,
            description: 'মাসিক জমা',
            createdAt: new Date()
          }
        },

        {
          id: 4,
          type: 'notice',
          message: 'মাসিক সভার নোটিশ প্রকাশিত হয়েছে',
          time: '২ দিন আগে',
          icon: Bell,
          color: 'text-orange-600',
          originalTransaction: {
            id: 'dummy-4',
            memberName: 'সমিতি',
            transactionType: 'other',
            amount: 0,
            description: 'মাসিক সভার নোটিশ',
            createdAt: new Date()
          }
        },
      ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'মাসিক সাধারণ সভা',
      date: '১৫ জুন, ২০২৪',
      time: 'সকাল ১০:০০',
      location: 'কমিউনিটি হল',
    },
    {
      id: 2,
      title: 'নতুন বিনিয়োগ পরিকল্পনা আলোচনা',
      date: '৫ জুলাই, ২০২৪',
      time: 'সকাল ১১:০০',
      location: 'কমিউনিটি হল',
    },
  ];

  // Helper function to create loading skeleton
  const LoadingSkeleton = ({ className = "", height = "h-4" }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${height} ${className}`}></div>
  );

  return (
    <div className="admin-dashboard-mobile">
      <div className="md-surface-container">
        <div className="md-dashboard-content">
          
          {/* Material Design 3 Stats Cards */}
          <div className="md-stats-grid">
            {summaryStats.map((stat, index) => (
              <div key={index} className="md-card md-stats-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="md-card-content">
                  <div className="md-stats-icon-container">
                    <div className={`md-stats-icon ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="md-stats-content">
                    <h3 className="md-title-large">
                      {(index === 0 && loading.members) || (index === 1 && loading.fundData) || (index === 2 && loading.fundData) || (index === 3 && loading.fundData) ? 
                        <LoadingSkeleton className="w-16 h-6" /> : 
                        stat.value
                      }
                    </h3>
                    <p className="md-body-medium">{stat.title}</p>
                    <div className={`md-stats-change ${stat.changeType === 'increase' ? 'positive' : 'negative'}`}>
                      {stat.changeType === 'increase' ? 
                        <ArrowUpRight className="h-4 w-4" /> : 
                        <ArrowDownRight className="h-4 w-4" />
                      }
                      <span className="md-label-medium">
                        {(index === 0 && loading.members) || (index === 1 && loading.fundData) || (index === 2 && loading.fundData) || (index === 3 && loading.fundData) ? 
                          <LoadingSkeleton className="w-8" /> : 
                          stat.change
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Material Design 3 Tab Navigation */}
          <div className="md-tab-container">
            <div className="md-tab-bar">
              <button 
                className={`md-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <TrendingUp className="h-5 w-5" />
                <span className="md-label-medium">সংক্ষিপ্ত</span>
              </button>
              <button 
                className={`md-tab ${activeTab === 'activities' ? 'active' : ''}`}
                onClick={() => setActiveTab('activities')}
              >
                <Bell className="h-5 w-5" />
                <span className="md-label-medium">কার্যক্রম</span>
              </button>
              <button 
                className={`md-tab ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                <Calendar className="h-5 w-5" />
                <span className="md-label-medium">ইভেন্ট</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="md-tab-content">
            {activeTab === 'overview' && (
              <div className="md-overview-content">
                {/* Charts Section */}
                <div className="md-charts-container">
                  {/* Monthly Chart Card */}
                  <div className="md-card md-chart-card">
                    <div className="md-card-header">
                      <div>
                        <h3 className="md-title-medium">মাসিক জমা</h3>
                        <p className="md-body-small">গত ৬ মাসের পরিসংখ্যান</p>
                      </div>
                      <button className="md-text-button">
                        <span className="md-label-large">বিস্তারিত</span>
                      </button>
                    </div>
                    <div className="md-chart-container">
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value) => `৳ ${value.toLocaleString()}`}
                            contentStyle={{
                              backgroundColor: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          />
                          <Bar dataKey="deposits" fill="#6366f1" name="মাসিক জমা" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>


                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="md-activities-content">
                <div className="md-card">
                  <div className="md-card-header">
                    <h3 className="md-title-medium">সাম্প্রতিক কার্যক্রম</h3>
                    <button 
                      className="md-text-button"
                      onClick={() => navigate('/transactions')}
                    >
                      <span className="md-label-large">সব দেখুন</span>
                    </button>
                  </div>
                  <div className="md-list">
                    {recentActivities.map((activity, index) => (
                      <div 
                        key={activity.id} 
                        className="md-list-item" 
                        style={{ animationDelay: `${index * 100}ms`, cursor: 'pointer' }}
                        onClick={(e) => handleTransactionClick(activity.originalTransaction, e)}
                      >
                        <div className="md-list-item-leading">
                          <div className={`md-list-icon ${activity.color}`}>
                            <activity.icon className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="md-list-item-content">
                          <div className="md-list-item-headline">{activity.message}</div>
                          <div className="md-list-item-supporting-text">
                            <span className="md-badge md-badge-month" style={{
                              backgroundColor: '#e3f2fd',
                              color: '#1976d2',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              display: 'inline-block'
                            }}>
                              {activity.time}
                            </span>
                          </div>
                        </div>
                        <div className="md-list-item-trailing">
                          <button className="md-icon-button-small">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="md-events-content">
                <div className="md-card">
                  <div className="md-card-header">
                    <h3 className="md-title-medium">আসন্ন কার্যক্রম</h3>
                    <button 
                      className="md-text-button"
                      onClick={() => navigate('/transactions')}
                    >
                      <span className="md-label-large">সব দেখুন</span>
                    </button>
                  </div>
                  <div className="md-events-list">
                    {upcomingEvents.map((event, index) => (
                      <div key={event.id} className="md-event-card" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="md-event-content">
                          <h4 className="md-title-small">{event.title}</h4>
                          <div className="md-event-details">
                            <div className="md-event-detail">
                              <Calendar className="h-4 w-4" />
                              <span className="md-body-small">{event.date}</span>
                            </div>
                            <div className="md-event-detail">
                              <span className="md-body-small">{event.time}</span>
                            </div>
                            <div className="md-event-detail">
                              <span className="md-body-small">{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <button className="md-icon-button">
                          <ArrowUpRight className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Material Design 3 Floating Action Button with Menu */}
      <div className="md-fab-container">
        {/* FAB Menu Items */}
        {showFabMenu && (
          <div className="md-fab-menu">
            <button 
              className="md-fab md-fab-secondary"
              onClick={handleNewMember}
              title="নতুন সদস্য যোগ করুন"
            >
              <UserPlus className="h-5 w-5" />
              <span className="md-fab-label">নতুন সদস্য</span>
            </button>
            <button 
              className="md-fab md-fab-secondary"
              onClick={handleNewTransaction}
              title="নতুন লেনদেন যোগ করুন"
            >
              <Receipt className="h-5 w-5" />
              <span className="md-fab-label">নতুন লেনদেন</span>
            </button>
          </div>
        )}
        
        {/* Main FAB */}
        <button 
          className={`md-fab md-fab-primary ${showFabMenu ? 'rotated' : ''}`}
          onClick={toggleFabMenu}
          title="নতুন যোগ করুন"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

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

export default AdminDashboard;