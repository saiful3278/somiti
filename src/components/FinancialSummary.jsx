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
import { MemberService } from '../firebase/memberService';
// Firestore direct imports for user transactions card
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import LoadingAnimation from './common/LoadingAnimation';
import '../styles/components/FinancialSummary.css';

const FinancialSummary = () => {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [userTransactions, setUserTransactions] = useState([]);
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
    // Helper to safely convert various Firestore date formats to JS Date
    const toDateSafe = (val) => {
      try {
        if (!val) return undefined;
        if (typeof val?.toDate === 'function') return val.toDate();
        if (typeof val === 'string') return new Date(val);
        if (val?.seconds) return new Date(val.seconds * 1000);
        return new Date(val);
      } catch (e) {
        console.warn('FinancialSummary: toDateSafe failed, returning undefined', e);
        return undefined;
      }
    };

    const loadFinancialData = async () => {
      const effectiveUserId = currentUser?.uid || currentUser?.id;
      if (!effectiveUserId) {
        console.log('FinancialSummary: skip loadFinancialData, no user_id');
        return;
      }

      try {
        setLoading(true);
        console.log('FinancialSummary: start loadFinancialData for user_id', effectiveUserId);

        // 1) Fetch member profile by user_id to read shareCount and joiningDate
        const memberResult = await MemberService.getMemberById(effectiveUserId);
        const memberDoc = memberResult?.success ? memberResult.data : null;
        const shareCountFromMember = Number(memberDoc?.shareCount || 0);
        const joinDateRaw = memberDoc?.joiningDate ?? memberDoc?.joinDate; // support both field names
        const memberJoinDate = toDateSafe(joinDateRaw) || new Date(new Date().getFullYear(), 0, 1);
        console.log('FinancialSummary: member profile loaded', {
          shareCountFromMember,
          joiningDate: memberJoinDate?.toISOString?.() || memberJoinDate,
        });

        // 2) Fetch ALL transactions for this member (use memberId field in transactions)
        const txQuery = query(
          collection(db, 'transactions'),
          where('memberId', '==', effectiveUserId)
        );
        const txSnap = await getDocs(txQuery);
        const transactions = [];
        txSnap.forEach((doc) => transactions.push({ id: doc.id, ...doc.data() }));
        console.log('FinancialSummary: transactions fetched', transactions.length);

        // 3) Compute totals required by UI
        const monthlyDeposits = transactions.filter(t => t.transactionType === 'monthly_deposit');
        const sharePurchases = transactions.filter(t => t.transactionType === 'share_purchase');
        const loanDisbursements = transactions.filter(t => t.transactionType === 'loan_disbursement');
        const loanRepayments = transactions.filter(t => t.transactionType === 'loan_repayment');
        const profitDistributions = transactions.filter(t => t.transactionType === 'profit_distribution');

        // Total Fund = sum of ALL transaction amounts (as requested)
        const totalFund = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        // Deposits and averages for the Monthly Deposits Info card
        const totalDeposits = monthlyDeposits.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const avgMonthlyDeposit = monthlyDeposits.length > 0
          ? Math.round(totalDeposits / monthlyDeposits.length)
          : 0;

        // Shares
        const totalSharesFromTx = sharePurchases.reduce((sum, t) => sum + (parseInt(t.shareAmount) || 0), 0);
        const totalShareValue = sharePurchases.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const sharePrice = 500; // if needed to derive value
        const totalShares = shareCountFromMember > 0 ? shareCountFromMember : totalSharesFromTx;

        // Loans & Profit
        const totalLoanTaken = loanDisbursements.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const totalLoanRepaid = loanRepayments.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const loanRemaining = totalLoanTaken - totalLoanRepaid;
        const totalProfitEarned = profitDistributions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        // 4) Due Months calculation
        const currentDate = new Date();
        const monthsFromJoin = [];
        const startDate = new Date(memberJoinDate.getFullYear(), memberJoinDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
          monthsFromJoin.push(new Date(d));
        }

        // Build a set of paid month-year keys from monthly deposit transactions
        const paidMonthKeys = new Set();
        monthlyDeposits.forEach((t) => {
          const candidate = toDateSafe(t?.date) || toDateSafe(t?.createdAt);
          const yearInt = candidate?.getFullYear?.();
          const monthInt = (typeof t.month === 'number') ? t.month : candidate?.getMonth?.();
          if (typeof monthInt === 'number' && typeof yearInt === 'number') {
            paidMonthKeys.add(`${yearInt}-${monthInt}`);
          }
        });
        console.log('FinancialSummary: paidMonthKeys built', paidMonthKeys.size);

        const missedMonths = monthsFromJoin.filter((month) => {
          const key = `${month.getFullYear()}-${month.getMonth()}`;
          return !paidMonthKeys.has(key) && month <= endDate;
        });
        console.log('FinancialSummary: due months computed', missedMonths.length);

        // 5) Update UI state
        setFinancialData({
          totalFund: totalFund,
          totalShares: totalShares,
          shareValue: totalShareValue || (totalShares * sharePrice),
          monthlyDeposit: avgMonthlyDeposit,
          totalDeposits: totalDeposits,
          dueMonths: missedMonths.length,
          nextPaymentDue: currentDate.toLocaleDateString('bn-BD'),
          loanTaken: totalLoanTaken,
          loanRemaining: loanRemaining,
          profitEarned: totalProfitEarned
        });
      } catch (error) {
        console.error('আর্থিক তথ্য লোড করতে ত্রুটি:', error);
      } finally {
        setLoading(false);
        console.log('FinancialSummary: loadFinancialData completed');
      }
    };

    loadFinancialData();
  }, [currentUser]);

  // Direct Firestore query to load recent user transactions for the card
  useEffect(() => {
    const loadUserTransactions = async () => {
      if (!currentUser?.uid && !currentUser?.id) return;
      try {
        setTxLoading(true);
        const effectiveMemberId = currentUser.uid || currentUser.id;
        console.log('FinancialSummary: loading recent transactions from Firestore for memberId', effectiveMemberId);
        // Query Firestore directly by memberId; avoid orderBy to skip composite index requirement
        const q = query(
          collection(db, 'transactions'),
          where('memberId', '==', effectiveMemberId),
          limit(25)
        );
        const snapshot = await getDocs(q);
        const tx = [];
        snapshot.forEach(doc => tx.push({ id: doc.id, ...doc.data() }));
        // Sort by createdAt desc in-memory and take top 5
        const sorted = tx.sort((a, b) => {
          const aTs = a.createdAt?.seconds || 0;
          const bTs = b.createdAt?.seconds || 0;
          return bTs - aTs;
        }).slice(0, 5);
        setUserTransactions(sorted);
        console.log('FinancialSummary: recent transactions loaded', sorted.length);
      } catch (error) {
        console.error('FinancialSummary: Firestore user transactions error', error);
        setUserTransactions([]);
      } finally {
        setTxLoading(false);
      }
    };

    loadUserTransactions();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="financial-summary">
        <div className="financial-summary__container">
          <div className="financial-summary__loading">
            <LoadingAnimation />
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
            <div className="financial-card__value">৳ {(financialData.totalFund || 0).toLocaleString()}</div>
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
              <span>মূল্য: ৳ {(financialData.shareValue || 0).toLocaleString()}</span>
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
                <span className="detail-item__value">৳ {(financialData.totalDeposits || 0).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-item__label">গড় মাসিক জমা:</span>
                <span className="detail-item__value">৳ {(financialData.monthlyDeposit || 0).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-item__label">পরবর্তী পেমেন্ট:</span>
                <span className="detail-item__value">{financialData.nextPaymentDue}</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions (directly from Firestore by userId) */}
          <div className="detail-card">
            <div className="detail-card__header">
              <div className="detail-card__title">
                <div className="detail-card__icon">
                  <DollarSign size={16} />
                </div>
                সাম্প্রতিক লেনদেন
              </div>
              <ArrowUpRight size={16} style={{ color: '#94a3b8' }} />
            </div>
            <div className="detail-card__content">
              {txLoading ? (
                <div className="financial-summary__loading">
                  {/* Minimal, meaningful animation while loading */}
                  <LoadingAnimation />
                </div>
              ) : userTransactions.length === 0 ? (
                <div className="detail-item">
                  <span className="detail-item__label">স্বল্প তথ্য:</span>
                  <span className="detail-item__value">কোন লেনদেন পাওয়া যায়নি</span>
                </div>
              ) : (
                userTransactions.map((t) => {
                  // Safely format date/time from Firestore Timestamp
                  const createdAtDate = t.createdAt?.seconds
                    ? new Date(t.createdAt.seconds * 1000)
                    : new Date();
                  const dateStr = createdAtDate.toLocaleDateString('bn-BD');
                  const timeStr = createdAtDate.toLocaleTimeString('bn-BD');
                  const typeLabel = t.transactionType || t.type || 'other';
                  const amount = t.amount || 0;
                  return (
                    <div key={t.id} className="detail-item">
                      <span className="detail-item__label">
                        {typeLabel} • <span style={{ color: '#64748b' }}>{dateStr} {timeStr}</span>
                      </span>
                      <span className="detail-item__value">৳ {amount.toLocaleString('bn-BD')}</span>
                    </div>
                  );
                })
              )}
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
              স্ট্যাটাস সারি
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