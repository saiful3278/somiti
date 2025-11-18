import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Calendar, TrendingUp, TrendingDown, Wallet, Phone, Calculator, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TransactionService } from '../firebase/transactionService';
import LoadingAnimation from './common/LoadingAnimation';
import TransactionDetailsCard from './common/TransactionDetailsCard';
import '../styles/components/transactions.css';

const Transactions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterMethod, setFilterMethod] = useState('all'); // all, cash, bkash, bank
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionCard, setShowTransactionCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  const formatListDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Fetch real transaction data from Firebase
  useEffect(() => {
    console.log('Transactions page mounted');
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const result = await TransactionService.getAllTransactions();
        if (result.success) {
          // Format the data to match our component structure
          const formattedTransactions = result.data.map(transaction => {
            const baseDate = transaction.date
              ? new Date(transaction.date)
              : (transaction.createdAt ? new Date(transaction.createdAt.seconds * 1000) : new Date());
            return {
              id: transaction.id,
              type: transaction.type || 'income',
              amount: transaction.amount || 0,
              method: transaction.paymentMethod || transaction.method || 'নগদ',
              description: transaction.description || transaction.note || '',
              member: transaction.memberName || transaction.member || 'অজানা',
              date: formatListDate(baseDate)
            };
          });
          setTransactions(formattedTransactions);
          console.log('Loaded transactions:', formattedTransactions.length);
        } else {
          console.error('লেনদেন লোড করতে ত্রুটি:', result.error);
          setTransactions([]);
        }
      } catch (error) {
        console.error('লেনদেন লোড করতে ত্রুটি:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Get payment method icon
  const getPaymentIcon = (method) => {
    if (method.includes('নগদ') || method.includes('ক্যাশ')) {
      return <Banknote className="h-4 w-4" />;
    } else if (method.includes('বিকাশ')) {
      return <Phone className="h-4 w-4" />;
    } else if (method.includes('ব্যাংক')) {
      return <Calculator className="h-4 w-4" />;
    } else {
      return <Wallet className="h-4 w-4" />;
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.member.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesMethod = filterMethod === 'all' || 
                         (filterMethod === 'cash' && transaction.method.includes('নগদ')) ||
                         (filterMethod === 'bkash' && transaction.method.includes('বিকাশ')) ||
                         (filterMethod === 'bank' && transaction.method.includes('ব্যাংক'));
    
    return matchesSearch && matchesType && matchesMethod;
  });



  return (
    <div className="transactions-page">
      {/* Header */}
      <div className="transactions-header">
        <div className="transactions-title-row">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="transactions-title">সকল লেনদেন</h1>
        </div>



        {/* Search and Filters */}
        <div className="transactions-filters">
          <div className="filters-grid">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="বিবরণ বা সদস্য খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transactions-input pl-10"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="transactions-select"
            >
              <option value="all">সব ধরনের</option>
              <option value="income">আয়</option>
              <option value="expense">খরচ</option>
            </select>

            {/* Method Filter */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="transactions-select"
            >
              <option value="all">সব পদ্ধতি</option>
              <option value="cash">নগদ</option>
              <option value="bkash">বিকাশ</option>
              <option value="bank">ব্যাংক</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterMethod('all');
              }}
              className="filters-clear"
            >
              ফিল্টার মুছুন
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="transactions-list">
        {loading ? (
          <div className="transactions-loading"><LoadingAnimation /></div>
        ) : filteredTransactions.length === 0 ? (
          <div className="transactions-empty">কোনো লেনদেন পাওয়া যায়নি</div>
        ) : (
          <div>
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="transaction-item"
                onClick={(e) => {
                  const normalizeMethod = (method) => {
                    const m = (method || '').toLowerCase();
                    if (m.includes('নগদ') || m.includes('cash')) return 'cash';
                    if (m.includes('বিকাশ') || m.includes('bkash') || m.includes('mobile')) return 'mobile_banking';
                    if (m.includes('ব্যাংক') || m.includes('bank')) return 'bank_transfer';
                    if (m.includes('কার্ড') || m.includes('card')) return 'card';
                    return method || 'cash';
                  };
                  const safe = {
                    id: transaction.id,
                    memberName: transaction.member,
                    type: transaction.type || 'other',
                    amount: transaction.amount || 0,
                    paymentMethod: normalizeMethod(transaction.method),
                    description: transaction.description || '',
                    date: transaction.date,
                    time: transaction.time,
                    reference: transaction.reference || transaction.id,
                    processedBy: transaction.processedBy || 'ক্যাশিয়ার'
                  };
                  console.log('Transactions: open details', safe);
                  setCardPosition({ x: e.clientX, y: e.clientY });
                  setSelectedTransaction(safe);
                  setShowTransactionCard(true);
                }}
              >
                <div className="item-row">
                  <div className="item-left">
                    <div className={`transaction-icon ${
                      transaction.type === 'income' ? 'income' : 'expense'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className={`h-4 w-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                      ) : (
                        <TrendingDown className={`h-4 w-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                      )}
                    </div>
                    <div className="transaction-text">
                      <h3>{transaction.description}</h3>
                      <p className="member-name">{transaction.member}</p>
                      <div className="transaction-meta">
                        <div className="chip">
                          {getPaymentIcon(transaction.method)}
                          <span>{transaction.method}</span>
                        </div>
                        <div className="chip">{transaction.date}</div>
                        
                      </div>
                    </div>
                  </div>
                  <div className="item-right">
                    <p className={`amount ${transaction.type === 'income' ? 'income' : 'expense'}`}>
                      {transaction.type === 'income' ? '+' : '-'}৳ {(transaction.amount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <TransactionDetailsCard
        transaction={selectedTransaction}
        isVisible={showTransactionCard}
        onClose={() => {
          console.log('Transactions: close details');
          setShowTransactionCard(false);
          setSelectedTransaction(null);
        }}
        position={cardPosition}
      />
    </div>
  );
};

export default Transactions;