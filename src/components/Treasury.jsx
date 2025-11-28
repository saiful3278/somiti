import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PiggyBank, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Calendar,
  Users,
  Loader2,
  Clock,
  Star,
  ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FundService, TransactionService } from '../firebase';
import TransactionDetailsCard from './common/TransactionDetailsCard';
import LoadingAnimation from './common/LoadingAnimation';
import '../styles/components/treasury.css';

const Treasury = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    fundData: true,
    transactions: true
  });
  
  const [treasuryData, setTreasuryData] = useState({
    totalFunds: 0,
    monthlyDeposits: 0,
    totalWithdrawals: 0,
    recentTransactions: [],
    monthlyData: []
  });

  // Transaction Details Card states (replacing modal states)
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionCard, setShowTransactionCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  // Load treasury data from Firebase
  useEffect(() => {
    const loadTreasuryData = async () => {
      try {
        setLoading(prev => ({ ...prev, fundData: true, transactions: true }));
        
        // Load fund summary
        const fundResult = await FundService.getFundSummary();
        if (fundResult.success) {
          const fundSummary = fundResult.data;
          setTreasuryData(prev => ({
            ...prev,
            totalFunds: fundSummary.totalAmount || 0,
            monthlyDeposits: fundSummary.monthlyDeposits || 0,
            totalWithdrawals: fundSummary.totalWithdrawals || 0
          }));
          setLoading(prev => ({ ...prev, fundData: false }));
        } else {
          console.error('Error loading fund summary:', fundResult.error);
          setLoading(prev => ({ ...prev, fundData: false }));
        }
        
        // Load recent transactions
        const transactionResult = await TransactionService.getRecentTransactions(10);
        if (transactionResult.success) {
          const transactions = transactionResult.data;
          setTreasuryData(prev => ({
            ...prev,
            recentTransactions: transactions
          }));
          setLoading(prev => ({ ...prev, transactions: false }));
        } else {
          console.error('Error loading transactions:', transactionResult.error);
          setLoading(prev => ({ ...prev, transactions: false }));
        }
        
      } catch (error) {
        console.error('Error loading treasury data:', error);
        setLoading(prev => ({ ...prev, fundData: false, transactions: false }));
      }
    };

    loadTreasuryData();
  }, []);

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

  // Calculate net balance
  const netBalance = treasuryData.totalFunds - treasuryData.totalWithdrawals;

  // Summary cards data
  const summaryCards = [
    {
      title: 'সঞ্চিত অর্থ',
      value: treasuryData.totalFunds,
      change: '+১২%',
      changeType: 'increase',
      icon: PiggyBank,
      color: 'bg-blue-500',
      loading: loading.fundData
    },
    {
      title: 'মাসিক জমা',
      value: treasuryData.monthlyDeposits,
      change: '+৮%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-green-500',
      loading: loading.fundData
    },
    {
      title: 'বর্তমান তহবিল',
      value: netBalance,
      change: '+৫%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-purple-500',
      loading: loading.fundData
    }
  ];

  // Get month name for display
  const getMonthName = (transaction) => {
    // If transaction has monthName field, use it
    if (transaction.monthName) {
      return transaction.monthName;
    }
    
    // Otherwise, extract month from date
    const bengaliMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    
    const date = new Date(transaction.date?.seconds * 1000 || transaction.createdAt?.seconds * 1000 || Date.now());
    return bengaliMonths[date.getMonth()] || 'এই মাসে';
  };

  // Format transaction for display
  const formatTransaction = (transaction) => {
    const typeMap = {
      'monthly_deposit': 'মাসিক জমা',
      'share_purchase': 'শেয়ার ক্রয়',
      'loan_disbursement': 'ঋণ প্রদান',
      'loan_repayment': 'ঋণ পরিশোধ',
      'profit_distribution': 'লাভ বিতরণ',
      'penalty': 'জরিমানা',
      'other': 'অন্যান্য'
    };

    // Income transactions: money coming into the fund
    const incomeTypes = ['monthly_deposit', 'share_purchase', 'loan_repayment', 'penalty'];
    // Expense transactions: money going out of the fund
    const expenseTypes = ['loan_disbursement', 'profit_distribution'];

    return {
      id: transaction.id,
      type: typeMap[transaction.transactionType] || transaction.transactionType,
      amount: transaction.amount,
      memberName: transaction.memberName || 'অজানা সদস্য',
      monthName: getMonthName(transaction),
      isIncome: incomeTypes.includes(transaction.transactionType)
    };
  };

  // Loading skeleton component
  const LoadingSkeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );

  return (
    <div className="treasury-container">
      {/* Header */}
      <div className="treasury-header">
        <h1 className="treasury-title">কোষাগার</h1>
        <p className="treasury-subtitle">সমিতির আর্থিক তথ্য ও লেনদেন</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="treasury-summary-grid">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="treasury-card">
                <div className="treasury-card-header">
                  <h3 className="treasury-card-title">{card.title}</h3>
                  <div className={`treasury-card-icon ${card.color === 'bg-green-500' ? 'green' : card.color === 'bg-purple-500' ? 'purple' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  {card.loading ? (
                    <LoadingSkeleton className="w-20 h-6 mt-1" />
                  ) : (
                    <p className="treasury-card-value">
                      ৳ {card.value.toLocaleString('bn-BD')}
                    </p>
                  )}
                  <div className={`treasury-card-change ${card.changeType === 'increase' ? 'positive' : 'negative'}`}>
                    {card.changeType === 'increase' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{card.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <div className="treasury-transactions">
          <div className="treasury-transactions-header">
            <h2 className="treasury-transactions-title">
              <Clock className="w-5 h-5" />
              সাম্প্রতিক লেনদেন
            </h2>
          </div>
          <div>
            {loading.transactions ? (
              <LoadingAnimation />
            ) : treasuryData.recentTransactions.length > 0 ? (
              <div className="treasury-transactions-list">
                {treasuryData.recentTransactions.map((transaction) => {
                  const formattedTransaction = formatTransaction(transaction);
                  return (
                    <div 
                      key={formattedTransaction.id} 
                      className="treasury-transaction-item"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => handleTransactionClick(transaction, e)}
                    >
                      <div className={`treasury-transaction-icon ${formattedTransaction.isIncome ? 'deposit' : 'withdrawal'}`}>
                        {formattedTransaction.isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="treasury-transaction-details">
                        <p className="treasury-transaction-description">{formattedTransaction.type}</p>
                        <p className="treasury-transaction-time">
                          {formattedTransaction.memberName} • 
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
                            {formattedTransaction.monthName}
                          </span>
                        </p>
                      </div>
                      <span className={`treasury-transaction-amount ${formattedTransaction.isIncome ? 'positive' : 'negative'}`}>
                        {formattedTransaction.isIncome ? '+' : '-'}৳ {(formattedTransaction.amount || 0).toLocaleString('bn-BD')}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="treasury-empty">
                <Clock className="treasury-empty-icon" />
                <p className="treasury-empty-title">কোনো লেনদেন পাওয়া যায়নি</p>
                <p className="treasury-empty-description">এখনো কোনো লেনদেন রেকর্ড করা হয়নি</p>
              </div>
            )}
            
            {/* See More Button */}
            {!loading.transactions && treasuryData.recentTransactions.length > 0 && (
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

        {/* Coming Soon - Investment Section */}
        <div className="treasury-coming-soon">
          <div className="treasury-coming-soon-icon">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="treasury-coming-soon-title">বিনিয়োগ বিভাগ</h3>
          <p className="treasury-coming-soon-description">
            বিনিয়োগ ট্র্যাকিং, রিটার্ন ক্যালকুলেশন এবং পোর্টফোলিও ম্যানেজমেন্ট ফিচার শীঘ্রই যোগ করা হবে।
          </p>
        </div>

        {/* Transaction Details Floating Card */}
        <TransactionDetailsCard
          transaction={selectedTransaction}
          isVisible={showTransactionCard}
          onClose={closeTransactionCard}
          position={cardPosition}
        />
      </div>
    </div>
  );
};

export default Treasury;