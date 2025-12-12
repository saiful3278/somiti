import React, { useEffect, useMemo, useState } from 'react';
import { TransactionService } from '../firebase/transactionService';
import { useUser } from '../contexts/UserContext';
import LoadingAnimation from '../components/common/LoadingAnimation';
import '../styles/components/MemberTable.css';

console.log('[MemberTablePage] file loaded');

const toDateSafe = (val) => {
  try {
    if (!val) return undefined;
    if (typeof val?.toDate === 'function') return val.toDate();
    if (typeof val === 'string') return new Date(val);
    if (val?.seconds) return new Date(val.seconds * 1000);
    return new Date(val);
  } catch (e) {
    console.warn('[MemberTablePage] toDateSafe failed', e);
    return undefined;
  }
};

const MemberTablePage = () => {
  console.log('[MemberTablePage] render start');
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        if (!currentUser) {
          console.log('[MemberTablePage] no currentUser yet, waiting');
          setTransactions([]);
          return;
        }
        const effectiveId = currentUser?.uid || currentUser?.id;
        console.log('[MemberTablePage] fetching transactions for user', { effectiveId });
        let txs = [];

        const res = await TransactionService.getTransactionsByUserId(effectiveId);
        if (res.success) {
          txs = res.data || [];
          console.log('[MemberTablePage] getTransactionsByUserId result', { count: txs.length });
        } else {
          console.error('[MemberTablePage] getTransactionsByUserId error', res.error);
        }

        if (!txs.length) {
          console.log('[MemberTablePage] fallback: filtering all transactions by member id variants');
          const all = await TransactionService.getAllTransactions();
          if (all.success) {
            const allTx = all.data || [];
            txs = allTx.filter(t => {
              const linkId = t.userId || t.memberId || t.uid || t.member_id || t.user_id;
              return linkId === effectiveId;
            });
            console.log('[MemberTablePage] fallback filtered transactions', { count: txs.length });
          } else {
            console.error('[MemberTablePage] getAllTransactions error', all.error);
          }
        }

        const sorted = [...txs].sort((a, b) => {
          const aDate = toDateSafe(a.createdAt) || toDateSafe(a.date) || new Date(0);
          const bDate = toDateSafe(b.createdAt) || toDateSafe(b.date) || new Date(0);
          return bDate - aDate;
        }).map((t, idx) => ({ ...t, serial: idx + 1 }));

        console.log('[MemberTablePage] transactions loaded', sorted.length);
        setTransactions(sorted);
      } catch (e) {
        console.error('[MemberTablePage] loadTransactions error', e);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [currentUser]);

  const formatDate = (val) => {
    const d = toDateSafe(val);
    return d ? d.toLocaleDateString('bn-BD') : '';
  };

  if (loading) {
    return (
      <div className="member-table">
        <div className="member-table__container">
          <div className="member-table__loading"><LoadingAnimation /></div>
        </div>
      </div>
    );
  }

  console.log('[MemberTablePage] render table', { count: transactions.length });

  const TYPE_META = {
    monthly_deposit: { label: 'মাসিক জমা', tone: 'pos' },
    share_purchase: { label: 'শেয়ার ক্রয়', tone: 'pos' },
    loan_repayment: { label: 'ঋণ পরিশোধ', tone: 'pos' },
    penalty: { label: 'জরিমানা', tone: 'pos' },
    donation: { label: 'দান', tone: 'pos' },
    loan_disbursement: { label: 'ঋণ বিতরণ', tone: 'neg' },
    profit_distribution: { label: 'লাভ বণ্টন', tone: 'neg' },
    expense: { label: 'খরচ', tone: 'neg' },
    subscription: { label: 'সাবস্ক্রিপশন', tone: 'pos' },
    withdrawal: { label: 'উত্তোলন', tone: 'neg' },
  };

  const formatType = (val) => {
    const key = (val || '').toLowerCase();
    const meta = TYPE_META[key] || { label: val || 'অন্যান্য', tone: 'neu' };
    return meta;
  };

  return (
    <div className="member-table">
      <div className="member-table__container">
        <div className="member-table__header">
          <h1 className="member-table__title">আমার লেনদেনের তালিকা</h1>
          <p className="member-table__subtitle">সাম্প্রতিক লেনদেন, পেমেন্ট পদ্ধতি ও অবস্থা</p>
        </div>

        <div className="member-table__wrapper">
          <table className="member-table__table member-table__table--rich">
            <thead>
              <tr>
                <th>সিরিয়াল</th>
                <th>টাইপ</th>
                <th>টাকার পরিমাণ</th>
                <th>পেমেন্ট পদ্ধতি</th>
                <th>রেফারেন্স</th>
                <th>তারিখ</th>
                <th>অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const { label, tone } = formatType(t.transactionType || t.type);
                const amount = Number(t.amount) || 0;
                const method = t.paymentMethod || t.method || '';
                const reference = t.paymentReference || t.reference || '';
                const created = t.createdAt || t.date;
                const status = t.status || 'completed';
                const amountClass = tone === 'pos' ? 'amount-positive' : tone === 'neg' ? 'amount-negative' : 'amount-neutral';

                return (
                  <tr key={t.id}>
                    <td className="cell-serial">{t.serial}</td>
                    <td className="cell-type"><span className={`badge badge--type badge--${tone}`}>{label}</span></td>
                    <td className={`cell-amount ${amountClass}`}>{amount.toLocaleString('bn-BD')}</td>
                    <td className="cell-method"><span className="badge badge--method">{method || '—'}</span></td>
                    <td className="cell-ref">{reference || '—'}</td>
                    <td className="cell-date">{formatDate(created)}</td>
                    <td className="cell-status"><span className={`badge badge--status status--${status}`}>{status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberTablePage;