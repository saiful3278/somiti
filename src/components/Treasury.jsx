import React, { useState, useEffect } from 'react';
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
  Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FundService, TransactionService } from '../firebase';
import '../styles/components/treasury.css';

const Treasury = () => {
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

  // Calculate net balance
  const netBalance = treasuryData.totalFunds - treasuryData.totalWithdrawals;

  // Summary cards data
  const summaryCards = [
    {
      title: 'মোট ফান্ড',
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
      title: 'নিট ব্যালেন্স',
      value: netBalance,
      change: '+৫%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-purple-500',
      loading: loading.fundData
    }
  ];

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
      date: new Date(transaction.date?.seconds * 1000 || transaction.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('bn-BD'),
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
              <div className="treasury-loading">
                <div className="treasury-loading-spinner"></div>
                <p className="treasury-loading-text">লেনদেন লোড হচ্ছে...</p>
              </div>
            ) : treasuryData.recentTransactions.length > 0 ? (
              <div className="treasury-transactions-list">
                {treasuryData.recentTransactions.map((transaction) => {
                  const formattedTransaction = formatTransaction(transaction);
                  return (
                    <div key={formattedTransaction.id} className="treasury-transaction-item">
                      <div className={`treasury-transaction-icon ${formattedTransaction.isIncome ? 'deposit' : 'withdrawal'}`}>
                        {formattedTransaction.isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="treasury-transaction-details">
                        <p className="treasury-transaction-description">{formattedTransaction.type}</p>
                        <p className="treasury-transaction-time">{formattedTransaction.memberName}</p>
                      </div>
                      <span className={`treasury-transaction-amount ${formattedTransaction.isIncome ? 'positive' : 'negative'}`}>
                        {formattedTransaction.isIncome ? '+' : '-'}৳ {formattedTransaction.amount.toLocaleString('bn-BD')}
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
      </div>
    </div>
  );
};

export default Treasury;