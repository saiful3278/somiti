import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import LoadingAnimation from '../components/common/LoadingAnimation';
import '../styles/components/UnifiedMembersFinanceCard.css';

console.log('[UnifiedMembersFinanceCardPage] file loaded');

const monthLabelsBn = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const toDateSafe = (val) => {
  try {
    if (!val) return undefined;
    if (typeof val?.toDate === 'function') return val.toDate();
    if (typeof val === 'string') return new Date(val);
    if (val?.seconds) return new Date(val.seconds * 1000);
    return new Date(val);
  } catch (e) {
    console.warn('[UnifiedMembersFinanceCardPage] toDateSafe failed', e);
    return undefined;
  }
};

const UnifiedMembersFinanceCardPage = () => {
  console.log('[UnifiedMembersFinanceCardPage] render start');

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(undefined);
  const nowYear = useMemo(() => new Date().getFullYear(), []);
  const nowMonth = useMemo(() => new Date().getMonth(), []);

  useEffect(() => {
    console.log('[UnifiedMembersFinanceCardPage] subscribing to members and transactions');

    const unsubMembers = onSnapshot(collection(db, 'members'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log('[UnifiedMembersFinanceCardPage] members updated', list.length);
      setMembers(list);
    }, (err) => {
      console.error('[UnifiedMembersFinanceCardPage] members snapshot error', err);
    });

    const unsubTx = onSnapshot(collection(db, 'transactions'), (snap) => {
      const tx = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log('[UnifiedMembersFinanceCardPage] transactions updated', tx.length);
      setTransactions(tx);
      setLoading(false);
    }, (err) => {
      console.error('[UnifiedMembersFinanceCardPage] transactions snapshot error', err);
      setLoading(false);
    });

    return () => {
      console.log('[UnifiedMembersFinanceCardPage] unsubscribing');
      unsubMembers && unsubMembers();
      unsubTx && unsubTx();
    };
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set();
    transactions.forEach((t) => {
      const d = toDateSafe(t.date) || toDateSafe(t.createdAt);
      const y = d?.getFullYear?.();
      if (typeof y === 'number') years.add(y);
    });
    const arr = Array.from(years).sort((a, b) => b - a);
    console.log('[UnifiedMembersFinanceCardPage] availableYears', arr);
    return arr;
  }, [transactions]);

  useEffect(() => {
    const current = new Date().getFullYear();
    if (!selectedYear) {
      const def = availableYears.includes(current) ? current : availableYears[0];
      if (def) {
        setSelectedYear(def);
        console.log('[UnifiedMembersFinanceCardPage] default selectedYear', def);
      }
    } else {
      if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
        setSelectedYear(availableYears[0]);
        console.log('[UnifiedMembersFinanceCardPage] adjusted selectedYear', availableYears[0]);
      }
    }
  }, [availableYears, selectedYear]);

  const aggregation = useMemo(() => {
    const byMember = new Map();
    transactions.forEach((t) => {
      const memberId = t.memberId || t.userId || t.uid;
      if (!memberId) return;

      const dateObj = toDateSafe(t.date) || toDateSafe(t.createdAt);
      const yearInt = dateObj?.getFullYear?.();
      let monthInt = typeof t.month === 'number' ? t.month : dateObj?.getMonth?.();
      if (typeof yearInt !== 'number' || typeof monthInt !== 'number') return;

      if (typeof selectedYear === 'number' && yearInt !== selectedYear) return;

      const amount = Number(t.amount) || 0;
      if (!byMember.has(memberId)) {
        byMember.set(memberId, { monthlyTotals: Array(12).fill(0), totalPaid: 0 });
      }
      const agg = byMember.get(memberId);
      agg.monthlyTotals[monthInt] += amount;
      agg.totalPaid += amount;
    });
    console.log('[UnifiedMembersFinanceCardPage] aggregation built', byMember.size);
    return byMember;
  }, [transactions, selectedYear]);

  const overall = useMemo(() => {
    const monthlyTotals = Array(12).fill(0);
    let totalPaid = 0;
    let totalDue = 0;
    transactions.forEach((t) => {
      const dateObj = toDateSafe(t.date) || toDateSafe(t.createdAt);
      const yearInt = dateObj?.getFullYear?.();
      let monthInt = typeof t.month === 'number' ? t.month : dateObj?.getMonth?.();
      if (typeof yearInt !== 'number' || typeof monthInt !== 'number') return;
      if (typeof selectedYear === 'number' && yearInt !== selectedYear) return;
      const amount = Number(t.amount) || 0;
      monthlyTotals[monthInt] += amount;
      totalPaid += amount;
    });
    members.forEach((member) => {
      const memberUid = member.user_id || member.id || member.membershipId || member.memberId;
      const agg = aggregation.get(memberUid) || { totalPaid: 0 };
      const shareCount = Number(member.shareCount) || 0;
      const monthlyRate = shareCount * 500;
      const joinRaw = member.joiningDate ?? member.joinDate ?? member.createdAt;
      const joinDate = toDateSafe(joinRaw) || new Date(selectedYear || new Date().getFullYear(), 0, 1);
      const joinYear = joinDate?.getFullYear?.();
      const joinMonth = joinDate?.getMonth?.();
      let monthsDueCount = 0;
      if (typeof selectedYear === 'number' && typeof joinYear === 'number') {
        if (selectedYear < nowYear) {
          if (joinYear < selectedYear) monthsDueCount = 12;
          else if (joinYear === selectedYear && typeof joinMonth === 'number') monthsDueCount = 12 - joinMonth;
        } else if (selectedYear === nowYear) {
          if (joinYear < selectedYear) monthsDueCount = nowMonth + 1;
          else if (joinYear === selectedYear && typeof joinMonth === 'number') monthsDueCount = Math.max(0, (nowMonth - joinMonth + 1));
        } else {
          monthsDueCount = 0;
        }
      }
      const plannedDue = monthlyRate * Math.max(0, monthsDueCount);
      let bonusDue = 0;
      if (selectedYear === joinYear) {
        const joinMonthEligible = (selectedYear < nowYear) || (selectedYear === nowYear && typeof joinMonth === 'number' && joinMonth <= nowMonth);
        if (joinMonthEligible) {
          bonusDue = monthlyRate; // joining month counted double (extra monthlyRate)
        }
      }
      const memberDue = (plannedDue + bonusDue) - (agg.totalPaid || 0);
      totalDue += Math.max(0, memberDue);
    });
    console.log('[UnifiedMembersFinanceCardPage] overall summary', { totalMembers: members.length, totalPaid, totalDue });
    return { monthlyTotals, totalPaid, totalDue, totalMembers: members.length };
  }, [transactions, selectedYear, members, aggregation]);

  const sortedMembers = useMemo(() => {
    const sorted = [...members].sort((a, b) => {
      const aDate = toDateSafe(a.createdAt) || new Date(0);
      const bDate = toDateSafe(b.createdAt) || new Date(0);
      if (aDate.getTime() !== bDate.getTime()) return aDate - bDate; // ascending
      return (a.id || '').localeCompare(b.id || '');
    });
    console.log('[UnifiedMembersFinanceCardPage] sortedMembers built', { count: sorted.length });
    return sorted;
  }, [members]);

  const serialMap = useMemo(() => {
    const map = new Map();
    sortedMembers.forEach((m, idx) => map.set(m.id, idx + 1));
    console.log('[UnifiedMembersFinanceCardPage] serialMap built', { size: map.size });
    return map;
  }, [sortedMembers]);

  if (loading) {
    return (
      <div className="unified-finance-card">
        <div className="unified-finance-card__container">
          <div className="unified-finance-card__loading">
            <LoadingAnimation />
          </div>
        </div>
      </div>
    );
  }

  console.log('[UnifiedMembersFinanceCardPage] render table', { members: members.length });

  return (
    <div className="unified-finance-card">
      <div className="unified-finance-card__container">
        <div className="unified-finance-card__header">
          <h1 className="unified-finance-card__title">একীভূত আর্থিক ওভারভিউ</h1>
          <p className="unified-finance-card__subtitle">সমস্ত সদস্যের মাসভিত্তিক জমা</p>
          <div className="year-switcher">
            <span className="year-label">বছর</span>
            <select
              className="year-select"
              value={selectedYear ?? ''}
              onChange={(e) => {
                const next = parseInt(e.target.value, 10);
                setSelectedYear(next);
                console.log('[UnifiedMembersFinanceCardPage] year selected', next);
              }}
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="overall-summary">
            <div className="summary-item">
              <span className="summary-label">মোট সদস্য</span>
              <span className="summary-value">{overall.totalMembers}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">মোট জমা</span>
              <span className="summary-value summary-value-paid">৳ {Math.max(0, overall.totalPaid).toLocaleString('bn-BD')}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">মোট বকেয়া</span>
              <span className="summary-value summary-value-due">৳ {Math.max(0, overall.totalDue).toLocaleString('bn-BD')}</span>
            </div>
          </div>
        </div>

        <div className="unified-finance-card__table-wrapper">
          <table className="unified-finance-table">
            <thead>
              <tr>
                <th>সদস্য ID</th>
                <th>সদস্য নাম</th>
                <th>শেয়ার</th>
                {monthLabelsBn.map((m, idx) => (
                  <th key={idx}>{m}</th>
                ))}
                <th>মোট জমা</th>
                <th>মোট বকেয়া</th>
              </tr>
            </thead>
            <tbody>
              {sortedMembers.map((member) => {
                const memberUid = member.user_id || member.id || member.membershipId || member.memberId;
                const name = member.name || 'অজানা';
                const shareCount = Number(member.shareCount) || 0;
                const monthlyRate = shareCount * 500;
                const agg = aggregation.get(memberUid) || { monthlyTotals: Array(12).fill(0), totalPaid: 0 };
                const totalPaid = agg.totalPaid || 0;
                const joinRaw = member.joiningDate ?? member.joinDate ?? member.createdAt;
                const joinDate = toDateSafe(joinRaw) || new Date(selectedYear || new Date().getFullYear(), 0, 1);
                const joinYear = joinDate?.getFullYear?.();
                const joinMonth = joinDate?.getMonth?.();
                let monthsDueCount = 0;
                if (typeof selectedYear === 'number' && typeof joinYear === 'number') {
                  if (selectedYear < nowYear) {
                    if (joinYear < selectedYear) monthsDueCount = 12;
                    else if (joinYear === selectedYear && typeof joinMonth === 'number') monthsDueCount = 12 - joinMonth;
                  } else if (selectedYear === nowYear) {
                    if (joinYear < selectedYear) monthsDueCount = nowMonth + 1;
                    else if (joinYear === selectedYear && typeof joinMonth === 'number') monthsDueCount = Math.max(0, (nowMonth - joinMonth + 1));
                  } else {
                    monthsDueCount = 0;
                  }
                }
                const plannedDue = monthlyRate * Math.max(0, monthsDueCount);
                let bonusDue = 0;
                if (selectedYear === joinYear) {
                  const joinMonthEligible = (selectedYear < nowYear) || (selectedYear === nowYear && typeof joinMonth === 'number' && joinMonth <= nowMonth);
                  if (joinMonthEligible) {
                    bonusDue = monthlyRate; // joining month counted double
                  }
                }
                const totalDue = (plannedDue + bonusDue) - totalPaid;
                console.log('[UnifiedMembersFinanceCardPage] row due calc', { memberUid, shareCount, monthlyRate, monthsDueCount, plannedDue, bonusDue, totalPaid, totalDue });

                const joinKey = (joinDate?.getFullYear?.() ?? (selectedYear || 0)) * 12 + (joinDate?.getMonth?.() ?? 0);
                console.log('[UnifiedMembersFinanceCardPage] row join info', { memberUid, joinDate: joinDate?.toISOString?.() || joinDate });

                return (
                  <tr key={memberUid || member.id}>
                    <td className="cell-id">{serialMap.get(member.id) || '-'}</td>
                    <td className="cell-name">{name}</td>
                    <td className="cell-share">{shareCount}</td>
                    {agg.monthlyTotals.map((amt, idx) => {
                      const cellKey = (selectedYear || new Date().getFullYear()) * 12 + idx;
                      const isBeforeJoin = cellKey < joinKey;
                      const isFutureMonth = (typeof selectedYear === 'number') && (selectedYear > nowYear || (selectedYear === nowYear && idx > nowMonth));
                      return (
                        <td key={idx} className="cell-month">
                          {isBeforeJoin ? (
                            ''
                          ) : isFutureMonth ? (
                            <span className="dash-cell">-</span>
                          ) : amt > 0 ? (
                            <span className="amount-cell">৳ {amt.toLocaleString('bn-BD')}</span>
                          ) : (
                            <span className="zero-cell">৳ 0</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="cell-total-paid">৳ {totalPaid.toLocaleString('bn-BD')}</td>
                    <td className="cell-total-due">৳ {Math.max(0, totalDue).toLocaleString('bn-BD')}</td>
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

export default UnifiedMembersFinanceCardPage;