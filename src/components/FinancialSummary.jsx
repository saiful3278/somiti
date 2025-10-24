import React, { useState, useEffect } from 'react';
import { 
  DollarSign,
  TrendingUp,
  Calendar,
  PieChart,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  ArrowUpRight,
  Wallet,
  Target
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { TransactionService } from '../firebase/transactionService';
import { MemberService } from '../firebase/memberService';
import '../styles/components/FinancialSummary.css';

const FinancialSummary = () => {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState({
    totalFund: 0,
    totalShares: 0,
    shareValue: 0,
    monthlyDeposit: 0,
    totalDeposits: 0,
    dueMonths: 0,
    nextPaymentDue: '',
    loanTaken: 0,
    loanRemaining: 0,
    profitEarned: 0
  });

  useEffect(() => {
    const loadFinancialData = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);

        // Get user transactions
        const transactionsResult = await TransactionService.getTransactionsByUserId(currentUser.uid);
        
        if (transactionsResult.success) {
          const transactions = transactionsResult.data || [];
          
          // Calculate financial metrics
          const monthlyDeposits = transactions.filter(t => t.transactionType === 'monthly_deposit');
          const shareTransactions = transactions.filter(t => t.transactionType === 'share_purchase');
          const loanTransactions = transactions.filter(t => t.transactionType === 'loan_disbursement');
          const loanRepayments = transactions.filter(t => t.transactionType === 'loan_repayment');
          const profitTransactions = transactions.filter(t => t.transactionType === 'profit_distribution');

          // Calculate totals
          const totalDeposits = monthlyDeposits.reduce((sum, t) => sum + (t.amount || 0), 0);
          const totalShareValue = shareTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
          const totalLoanTaken = loanTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
          const totalLoanRepaid = loanRepayments.reduce((sum, t) => sum + (t.amount || 0), 0);
          const totalProfitEarned = profitTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

          // Calculate shares (assuming 500 tk per share)
          const sharePrice = 500;
          const totalShares = Math.floor(totalShareValue / sharePrice);

          // Calculate due months
          const currentDate = new Date();
          const memberJoinDate = currentUser?.joinDate ? new Date(currentUser.joinDate.seconds * 1000) : new Date(currentDate.getFullYear(), 0, 1);
          
          // Calculate months from joining to current month
          const monthsFromJoin = [];
          const startDate = new Date(memberJoinDate.getFullYear(), memberJoinDate.getMonth(), 1);
          const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          
          for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
            monthsFromJoin.push(new Date(d));
          }
          
          // Get months with successful payments
          const paidMonths = monthlyDeposits.map(t => {
            const transactionDate = new Date(t.createdAt?.seconds * 1000);
            return `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`;
          });
          
          // Calculate missed months (due months)
          const missedMonths = monthsFromJoin.filter(month => {
            const monthKey = `${month.getFullYear()}-${month.getMonth()}`;
            return !paidMonths.includes(monthKey) && month < new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          });

          // Calculate average monthly deposit
          const avgMonthlyDeposit = monthlyDeposits.length > 0 
            ? Math.round(totalDeposits / monthlyDeposits.length)
            : 0;

          // Calculate total fund (deposits + shares + profit - loan remaining)
          const loanRemaining = totalLoanTaken - totalLoanRepaid;
          const totalFund = totalDeposits + totalShareValue + totalProfitEarned - loanRemaining;

          setFinancialData({
            totalFund: totalFund,
            totalShares: totalShares,
            shareValue: totalShareValue,
            monthlyDeposit: avgMonthlyDeposit,
            totalDeposits: totalDeposits,
            dueMonths: missedMonths.length,
            nextPaymentDue: currentDate.toLocaleDateString('bn-BD'),
            loanTaken: totalLoanTaken,
            loanRemaining: loanRemaining,
            profitEarned: totalProfitEarned
          });
        }
      } catch (error) {
        console.error('আর্থিক তথ্য লোড করতে ত্রুটি:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFinancialData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="financial-summary">
        <div className="financial-summary__container">
          <div className="financial-summary__loading">
            <div className="loading-spinner">
              <div className="loading-spinner__ring"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-summary">
      <div className="financial-summary__container">
        
        {/* Header */}
        <div className="financial-summary__header">
          <h1 className="financial-summary__title">
            আর্থিক সারসংক্ষেপ
          </h1>
          <p className="financial-summary__subtitle">আপনার ব্যক্তিগত আর্থিক তথ্যের সংক্ষিপ্ত বিবরণ</p>
        </div>

        {/* Main Financial Cards */}
        <div className="financial-summary__main-cards">
            
          {/* Total Fund */}
          <div className="financial-card financial-card--fund">
            <div className="financial-card__header">
              <div className="financial-card__icon">
                <Wallet size={20} />
              </div>
            </div>
            <div className="financial-card__label">মোট তহবিল</div>
            <div className="financial-card__value">৳ {financialData.totalFund.toLocaleString()}</div>
            <div className="financial-card__description">
              <TrendingUp size={16} />
              <span>সর্বমোট সম্পদ</span>
            </div>
          </div>

          {/* Total Shares */}
          <div className="financial-card financial-card--shares">
            <div className="financial-card__header">
              <div className="financial-card__icon">
                <PieChart size={20} />
              </div>
            </div>
            <div className="financial-card__label">মোট শেয়ার</div>
            <div className="financial-card__value">{financialData.totalShares} টি</div>
            <div className="financial-card__description">
              <Target size={16} />
              <span>মূল্য: ৳ {financialData.shareValue.toLocaleString()}</span>
            </div>
          </div>

          {/* Due Months */}
          <div className={`financial-card financial-card--due ${
            financialData.dueMonths === 0 ? 'financial-card--success' : ''
          }`}>
            <div className="financial-card__header">
              <div className="financial-card__icon">
                {financialData.dueMonths > 0 ? (
                  <AlertTriangle size={20} />
                ) : (
                  <CheckCircle size={20} />
                )}
              </div>
            </div>
            <div className="financial-card__label">বকেয়া মাস</div>
            <div className="financial-card__value">{financialData.dueMonths} মাস</div>
            <div className="financial-card__description">
              {financialData.dueMonths > 0 ? (
                <>
                  <Clock size={16} />
                  <span>পরিশোধ করুন</span>
                </>
              ) : (
                <>
                  <Award size={16} />
                  <span>সব আপডেট</span>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Detailed Information Cards */}
        <div className="financial-summary__detail-cards">
          
          {/* Monthly Deposits Info */}
          <div className="detail-card">
            <div className="detail-card__header">
              <div className="detail-card__title">
                <div className="detail-card__icon">
                  <Calendar size={16} />
                </div>
                মাসিক জমা তথ্য
              </div>
              <ArrowUpRight size={16} style={{ color: '#94a3b8' }} />
            </div>
            
            <div className="detail-card__content">
              <div className="detail-item">
                <span className="detail-item__label">মোট জমা:</span>
                <span className="detail-item__value">৳ {financialData.totalDeposits.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-item__label">গড় মাসিক জমা:</span>
                <span className="detail-item__value">৳ {financialData.monthlyDeposit.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-item__label">পরবর্তী পেমেন্ট:</span>
                <span className="detail-item__value">{financialData.nextPaymentDue}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Status Summary */}
        <div className="detail-card">
          <div className="detail-card__header">
            <div className="detail-card__title">
              <div className="detail-card__icon">
                <CheckCircle size={16} />
              </div>
              স্ট্যাটাস সামারি
            </div>
          </div>
          
          <div className="financial-summary__status-cards">
            {/* Payment Status */}
            <div className="status-card status-card--success">
              <div className="status-card__content">
                <div className="status-card__icon">
                  <CheckCircle size={16} />
                </div>
                <div className="status-card__info">
                  <div className="status-card__title">পেমেন্ট স্ট্যাটাস</div>
                  <div className="status-card__description">
                    {financialData.dueMonths === 0 ? 'সম্পূর্ণ আপডেট' : `${financialData.dueMonths} মাস বকেয়া`}
                  </div>
                </div>
              </div>
            </div>

            {/* Share Holder Status */}
            <div className="status-card status-card--info">
              <div className="status-card__content">
                <div className="status-card__icon">
                  <PieChart size={16} />
                </div>
                <div className="status-card__info">
                  <div className="status-card__title">শেয়ার হোল্ডার</div>
                  <div className="status-card__description">
                    {financialData.totalShares > 0 ? `${financialData.totalShares} শেয়ার সক্রিয়` : 'কোন শেয়ার নেই'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinancialSummary;