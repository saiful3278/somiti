import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Calendar, TrendingUp, TrendingDown, Wallet, Phone, Calculator, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TransactionService } from '../firebase/transactionService';
import LoadingAnimation from './common/LoadingAnimation';

const Transactions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterMethod, setFilterMethod] = useState('all'); // all, cash, bkash, bank
  const [transactions, setTransactions] = useState([]);

  // Fetch real transaction data from Firebase
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const result = await TransactionService.getAllTransactions();
        if (result.success) {
          // Format the data to match our component structure
          const formattedTransactions = result.data.map(transaction => ({
            id: transaction.id,
            type: transaction.type || 'income',
            amount: transaction.amount || 0,
            method: transaction.paymentMethod || transaction.method || 'নগদ',
            description: transaction.description || transaction.note || '',
            member: transaction.memberName || transaction.member || 'অজানা',
            date: transaction.date || (transaction.createdAt ? 
              new Date(transaction.createdAt.seconds * 1000).toLocaleDateString('bn-BD') : 
              new Date().toLocaleDateString('bn-BD')),
            time: transaction.time || (transaction.createdAt ? 
              new Date(transaction.createdAt.seconds * 1000).toLocaleTimeString('bn-BD') : 
              new Date().toLocaleTimeString('bn-BD'))
          }));
          setTransactions(formattedTransactions);
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
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">সকল লেনদেন</h1>
        </div>



        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="বিবরণ বা সদস্য খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">সব ধরনের</option>
              <option value="income">আয়</option>
              <option value="expense">খরচ</option>
            </select>

            {/* Method Filter */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ফিল্টার মুছুন
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <LoadingAnimation />
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">কোনো লেনদেন পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className={`h-4 w-4 ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      ) : (
                        <TrendingDown className={`h-4 w-4 ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                      <p className="text-sm text-gray-600">{transaction.member}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          {getPaymentIcon(transaction.method)}
                          <span>{transaction.method}</span>
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{transaction.date}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{transaction.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}৳ {(transaction.amount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;