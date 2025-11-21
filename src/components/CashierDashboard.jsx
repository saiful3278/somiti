import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Plus, 
  Eye, 
  Banknote,
  Receipt,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Download,
  Share,
  Printer,
  TrendingUp,
  TrendingDown,
  Calculator,
  Wallet,
  CheckCircle,
  Clock,
  Camera,
  PieChart as PieChartIcon,
  BarChart3,
  Target,
  Percent,
  Activity,
  Filter,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  Settings,
  MoreVertical,
  Search,
  X,
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  Save,
  UserPlus,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import ProfilePhotoModal from './ProfilePhotoModal';
import SearchInput from './common/SearchInput';
import TransactionDetailsCard from './common/TransactionDetailsCard';
import { toast } from 'react-hot-toast';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { MemberService, TransactionService, FundService } from '../firebase';
// Connect with existing auth and transliteration utilities used by MemberList
import { registerUser } from '../api/auth';
import { generateEmailCredentials } from '../utils/transliteration';
import '../styles/components/cashier-dashboard.css';
import '../styles/components/CashierProfileCard.css';

const CashierDashboard = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { currentUser, loading: userLoading } = useUser();
  const [photoURL, setPhotoURL] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [somitiUserId, setSomitiUserId] = useState('');
  console.log('[CashierDashboard] Contexts', { authUser, currentUser, userLoading });

  useEffect(() => {
    if (currentUser) {
      const url = currentUser.photoURL || null;
      setPhotoURL(url);
      console.log('[CashierDashboard] avatar init from currentUser', { photoURL: url });
    }
  }, [currentUser]);

  useEffect(() => {
    const computeSerial = async () => {
      if (!currentUser?.uid) return;
      try {
        console.log('[CashierDashboard] computeSerial:start', { uid: currentUser?.uid });
        let membersResult = await MemberService.getActiveMembers?.();
        if (!membersResult?.success) {
          membersResult = await MemberService.getAllMembers();
        }
        if (membersResult.success && membersResult.data) {
          const allMembers = membersResult.data;
          console.log('[CashierDashboard] members:fetched', { count: allMembers.length });

          const sortedMembers = allMembers.sort((a, b) => {
            const joiningDateA = a.joiningDate || a.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0];
            const joiningDateB = b.joiningDate || b.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0];
            const dateA = new Date(joiningDateA);
            const dateB = new Date(joiningDateB);
            if (dateA.getTime() !== dateB.getTime()) {
              return dateA - dateB;
            }
            const createdA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
            const createdB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
            if (createdA.getTime() === createdB.getTime()) {
              return (a.id || '').localeCompare(b.id || '');
            }
            return createdA - createdB;
          });

          const currentUserIndex = sortedMembers.findIndex(member => member.id === currentUser.uid);
          const calculatedSerial = currentUserIndex !== -1 ? String(currentUserIndex + 1) : '';
          setSomitiUserId(calculatedSerial);
          console.log('[CashierDashboard] computeSerial:done', { somitiUserId: calculatedSerial });
        }
      } catch (err) {
        console.error('[CashierDashboard] computeSerial:error', err);
      }
    };
    computeSerial();
  }, [currentUser]);
  const [loading, setLoading] = useState({
    members: true,
    transactions: true,
    fundData: true,
    initial: true
  });
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fundViewMode, setFundViewMode] = useState('overview'); // 'overview', 'cashflow'
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  
  // Firebase data states
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fundData, setFundData] = useState({
    totalBalance: 0,
    availableCash: 0,
    monthlyExpense: 0,
    cashFlow: []
  });
  
  // New functionality states
  const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [paymentMethodSortOrder, setPaymentMethodSortOrder] = useState('desc'); // 'asc', 'desc'
  const [lastRefresh, setLastRefresh] = useState(new Date());
  // Spinner state for light transaction refresh
  const [refreshingTransactions, setRefreshingTransactions] = useState(false);
  
  
  
  // Transaction History state variables
  const [transactionFilter, setTransactionFilter] = useState('all'); // 'all', 'completed', 'pending', 'failed'
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all'); // 'all', 'subscription', 'loan', 'donation', 'fine'
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all'); // 'all', 'cash', 'bank', 'mobile', 'card'
  const [dateRangeFilter, setDateRangeFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'quarter'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'member', 'type'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  // Add New Member Modal states
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    phone: '',
    address: '',
    shareCount: '',
    nomineeName: '',
    nomineePhone: '',
    nomineeRelation: '',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  // Transaction Details Card states (replacing modal states)
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionCard, setShowTransactionCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [memberFormErrors, setMemberFormErrors] = useState({});
  const [error, setError] = useState(null);

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

  // Refresh data function
  const refreshData = async () => {
    try {
      setLoading(prev => ({ ...prev, initial: true }));
      setError(null);
      
      // Load all data in parallel for better performance
      const [membersResult, transactionsResult, fundResult] = await Promise.all([
        MemberService.getAllMembers().then(result => {
          if (result.success) {
            setMembers(result.data || []);
          } else {
            console.error('সদস্য তালিকা লোড করতে ত্রুটি:', result.error);
          }
          setLoading(prev => ({ ...prev, members: false }));
          return result;
        }).catch(error => {
          console.error('সদস্য তালিকা লোড করতে ত্রুটি:', error);
          setLoading(prev => ({ ...prev, members: false }));
          return { success: false, error };
        }),
        
        TransactionService.getAllTransactions().then(result => {
          if (result.success) {
            setTransactions(result.data || []);
          } else {
            console.error('লেনদেন তালিকা লোড করতে ত্রুটি:', result.error);
          }
          setLoading(prev => ({ ...prev, transactions: false }));
          return result;
        }).catch(error => {
          console.error('লেনদেন তালিকা লোড করতে ত্রুটি:', error);
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
        })
      ]);
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('ডেটা রিফ্রেশ করতে ত্রুটি:', error);
      setError('ডেটা লোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(prev => ({ ...prev, initial: false }));
    }
  };

  // Load data from Firebase
  useEffect(() => {
    refreshData();
  }, []);

  // Add new member function (connected to MemberService like MemberList.jsx)
  const handleAddMember = async (memberData, userId) => {
    try {
      setSaving(true);
      console.log('🚀 handleAddMember called with:', memberData);

      if (!userId) {
        console.error('❌ Missing userId for MemberService.addMember');
        return { success: false, error: 'User ID is required' };
      }

      // Use the same signature as MemberList: pass userId as Firestore doc ID
      const addResult = await MemberService.addMember(memberData, userId);
      console.log('📡 MemberService.addMember result:', addResult);
      
      if (addResult.success) {
        console.log('✅ Member service returned success');
        
        // Return success to indicate the operation completed successfully
        console.log('✅ Returning success from handleAddMember');
        return { success: true };
      } else {
        console.error('❌ Member service returned error:', addResult.error);
        return { success: false, error: addResult.error };
      }
    } catch (error) {
      console.error('💥 Exception in handleAddMember:', error);
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
      console.log('🏁 handleAddMember finally block executed');
    }
  };

  // Add new transaction function
  const handleAddTransaction = async (transactionData) => {
    try {
      setSaving(true);
      const addResult = await TransactionService.addTransaction(transactionData);
      
      if (addResult.success) {
        // Reload transactions and fund data
        const updatedTransactionsResult = await TransactionService.getAllTransactions();
        if (updatedTransactionsResult.success) {
          setTransactions(updatedTransactionsResult.data || []);
        }
        
        const updatedFundResult = await FundService.getFundSummary();
        if (updatedFundResult.success && updatedFundResult.data) {
          setFundData(updatedFundResult.data);
        }
      } else {
        console.error('লেনদেন যোগ করতে ত্রুটি:', addResult.error);
      }
    } catch (error) {
      console.error('লেনদেন যোগ করতে ত্রুটি:', error);
    } finally {
      setSaving(false);
    }
  };

  // Monthly subscription summary from Firebase data
  const monthlySummary = {
    totalMembers: members.length,
    paidMembers: members.filter(member => member.status === 'active').length,
    unpaidMembers: members.filter(member => member.status === 'inactive').length,
    totalCollected: transactions
      .filter(t => (t.transactionType === 'monthly_deposit' || t.transactionType === 'share_purchase') && 
        new Date(t.createdAt?.seconds * 1000).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    expectedAmount: members.length * 1200 // Assuming 1200 per member monthly
  };

  // Use fund data directly from enhanced FundService (no need for duplicate calculation)
  const fundSummary = fundData;

  // Monthly subscription records
  const monthlySubscriptions = [
    {
      id: 1,
      memberName: 'মোহাম্মদ রহিম উদ্দিন',
      memberId: 'SM-001',
      amount: 1200,
      month: 'জানুয়ারি ২০২৪',
      paymentDate: '০৫/০১/২০২৪',
      paymentMethod: 'নগদ',
      status: 'paid'
    },
    {
      id: 2,
      memberName: 'ফাতেমা খাতুন',
      memberId: 'SM-002',
      amount: 1200,
      month: 'জানুয়ারি ২০২৪',
      paymentDate: null,
      paymentMethod: null,
      status: 'unpaid'
    },
    {
      id: 3,
      memberName: 'আব্দুল কাদের',
      memberId: 'SM-003',
      amount: 1200,
      month: 'জানুয়ারি ২০২৪',
      paymentDate: '০৮/০১/২০২৪',
      paymentMethod: 'মোবাইল ব্যাংকিং',
      status: 'paid'
    },
    {
      id: 4,
      memberName: 'নাসির উদ্দিন আহমেদ',
      memberId: 'SM-004',
      amount: 1200,
      month: 'জানুয়ারি ২০২৪',
      paymentDate: '১০/০১/২০২৪',
      paymentMethod: 'নগদ',
      status: 'paid'
    },
    {
      id: 5,
      memberName: 'সালমা বেগম',
      memberId: 'SM-005',
      amount: 1200,
      month: 'জানুয়ারি ২০২৪',
      paymentDate: null,
      paymentMethod: null,
      status: 'unpaid'
    }
  ];

  // Enhanced expense records with categories and status
  const [expenseFilter, setExpenseFilter] = useState('all');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('all');
  
  
  
  const expenseCategories = [
    { id: 'office', name: 'অফিস খরচ', color: '#3B82F6' },
    { id: 'event', name: 'ইভেন্ট', color: '#10B981' },
    { id: 'maintenance', name: 'রক্ষণাবেক্ষণ', color: '#F59E0B' },
    { id: 'utility', name: 'ইউটিলিটি', color: '#EF4444' },
    { id: 'emergency', name: 'জরুরি', color: '#EC4899' }
  ];

  // Calculate real expense records from Firebase transactions
  const expenseRecords = React.useMemo(() => {
    return transactions
      .filter(transaction => ['expense', 'loan_disbursement', 'withdrawal'].includes(transaction.transactionType || transaction.type))
      .map(transaction => ({
        id: transaction.id,
        description: transaction.description || transaction.note || 'খরচ',
        amount: transaction.amount || 0,
        date: transaction.createdAt ? new Date(transaction.createdAt.seconds * 1000).toLocaleDateString('bn-BD') : new Date().toLocaleDateString('bn-BD'),
        category: transaction.category || 'other',
        invoiceNo: transaction.invoiceNo || `INV-${transaction.id}`,
        approvedBy: transaction.approvedBy || 'সভাপতি',
        status: transaction.status || 'approved',
        priority: transaction.priority || 'medium',
        submittedBy: transaction.submittedBy || 'ক্যাশিয়ার',
        submittedDate: transaction.submittedDate || (transaction.createdAt ? new Date(transaction.createdAt.seconds * 1000).toLocaleDateString('bn-BD') : new Date().toLocaleDateString('bn-BD')),
        approvedDate: transaction.approvedDate || (transaction.createdAt ? new Date(transaction.createdAt.seconds * 1000).toLocaleDateString('bn-BD') : new Date().toLocaleDateString('bn-BD')),
        paymentMethod: transaction.paymentMethod || 'cash',
        vendor: transaction.vendor || 'বিক্রেতা',
        notes: transaction.notes || transaction.description || 'খরচের বিবরণ'
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
  }, [transactions]);

  // Hourly collection data
  const hourlyCollections = [
    { hour: '৯টা', amount: 5000 },
    { hour: '১০টা', amount: 8500 },
    { hour: '১১টা', amount: 12000 },
    { hour: '১২টা', amount: 7500 },
    { hour: '১টা', amount: 4000 },
    { hour: '২টা', amount: 6000 },
    { hour: '৩টা', amount: 9500 },
    { hour: '৪টা', amount: 3500 }
  ];

  // Utility function for payment method labels
  const getPaymentMethodLabel = (method) => {
    switch(method) {
      case 'cash': return 'নগদ';
      case 'bank_transfer': return 'ব্যাংক ট্রান্সফার';
      case 'mobile_banking': return 'মোবাইল ব্যাংকিং';
      default: return method;
    }
  };

  // Payment method breakdown from real Firebase data
  const paymentMethods = React.useMemo(() => {
    if (!transactions.length) return [];
    
    const methodStats = transactions.reduce((acc, transaction) => {
      const method = transaction.paymentMethod || 'cash';
      const amount = transaction.amount || 0;
      
      if (!acc[method]) {
        acc[method] = { amount: 0, count: 0 };
      }
      
      acc[method].amount += amount;
      acc[method].count += 1;
      
      return acc;
    }, {});
    
    const totalAmount = Object.values(methodStats).reduce((sum, stat) => sum + stat.amount, 0);
    
    return Object.entries(methodStats).map(([method, stats]) => ({
      method: getPaymentMethodLabel(method),
      amount: stats.amount,
      count: stats.count,
      percentage: totalAmount > 0 ? (stats.amount / totalAmount * 100) : 0
    }));
  }, [transactions]);

  // Pending approvals
  const pendingApprovals = [
    {
      id: 1,
      memberName: 'ফাতেমা খাতুন',
      type: 'share_purchase',
      amount: 5000,
      time: '11:15 AM',
      reason: 'ব্যাংক ট্রান্সফার যাচাই প্রয়োজন'
    },
    {
      id: 2,
      memberName: 'সালমা বেগম',
      type: 'profit_withdrawal',
      amount: 8500,
      time: '03:45 PM',
      reason: 'উচ্চ পরিমাণের কারণে অনুমোদন প্রয়োজন'
    }
  ];



  const getTransactionTypeLabel = (type) => {
    switch(type) {
      case 'subscription': return 'মাসিক চাঁদা';
      case 'loan': return 'ঋণ';
      case 'donation': return 'দান';
      case 'fine': return 'জরিমানা';
      case 'monthly_deposit': return 'মাসিক জমা';
      case 'share_purchase': return 'শেয়ার ক্রয়';
      case 'loan_payment': return 'ঋণ পরিশোধ';
  
      default: return type;
    }
  };

  const getCategoryName = (categoryId) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryColor = (categoryId) => {
    const category = expenseCategories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6B7280';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadgeColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };



  // Filter functions for expenses
  const filteredExpenses = expenseRecords.filter(expense => {
    const matchesStatus = expenseFilter === 'all' || expense.status === expenseFilter;
    const matchesCategory = expenseCategoryFilter === 'all' || expense.category === expenseCategoryFilter;
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
   });

   // Monthly report data and analytics
  

   // Calculate real monthly report data from Firebase transactions
  

  

  // Use real Firebase transactions data
  const recentTransactions = React.useMemo(() => {
    return transactions.map(transaction => ({
      id: transaction.id,
      memberName: transaction.memberName || 'অজানা সদস্য',
      memberId: transaction.somiti_user_id || 'N/A',
      type: transaction.transactionType || transaction.type || 'other',
      amount: transaction.amount || 0,
      paymentMethod: transaction.paymentMethod || 'cash',
      status: transaction.status || 'completed',
      time: transaction.createdAt ? new Date(transaction.createdAt.seconds * 1000).toLocaleTimeString('bn-BD', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) : 'N/A',
      date: transaction.createdAt ? new Date(transaction.createdAt.seconds * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: transaction.description || getTransactionTypeLabel(transaction.transactionType || transaction.type || 'other'),
      reference: transaction.transactionId || transaction.id || 'N/A',
      processedBy: transaction.processedBy || 'ক্যাশিয়ার'
    })).sort((a, b) => {
      // Sort by date descending (newest first)
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateB - dateA;
    });
  }, [transactions]);

  // New functionality helper functions
  const searchFilteredTransactions = recentTransactions.filter(transaction =>
    transaction.memberName.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
    getTransactionTypeLabel(transaction.type).toLowerCase().includes(transactionSearchTerm.toLowerCase())
  );

  const sortedPaymentMethods = [...paymentMethods].sort((a, b) => {
    if (paymentMethodSortOrder === 'desc') {
      return b.amount - a.amount;
    } else {
      return a.amount - b.amount;
    }
  });

  // Single-source refresh handler used by various refresh buttons across the dashboard
  // This now calls the existing `refreshData` helper to actually reload members,
  // transactions and fund summary data from Firebase and updates the last refresh time.
  const handleRefresh = async () => {
    // Prevent multiple parallel refresh requests
    if (loading.initial) return;

    // Show a global loading indicator (reuses existing state keys)
    setLoading(prev => ({ ...prev, initial: true }));

    // Trigger the comprehensive data reload
    await refreshData();

    // Record the moment of refresh for any UI hint
    setLastRefresh(new Date());
  };

  const toggleTransactionExpand = (transactionId) => {
    setExpandedTransaction(expandedTransaction === transactionId ? null : transactionId);
  };

  // Enhanced filtering logic
  const filteredTransactions = recentTransactions.filter(transaction => {
    // Search filter
    const matchesSearch = transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = transactionFilter === 'all' || transaction.status === transactionFilter;

    // Type filter
    const matchesType = transactionTypeFilter === 'all' || transaction.type === transactionTypeFilter;

    // Payment method filter
    const matchesPaymentMethod = paymentMethodFilter === 'all' || transaction.paymentMethod === paymentMethodFilter;

    // Date range filter
    const matchesDateRange = (() => {
      if (dateRangeFilter === 'all') return true;
      
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      const daysDiff = Math.floor((today - transactionDate) / (1000 * 60 * 60 * 24));

      switch (dateRangeFilter) {
        case 'today':
          return daysDiff === 0;
        case 'week':
          return daysDiff <= 7;
        case 'month':
          return daysDiff <= 30;
        case 'quarter':
          return daysDiff <= 90;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesType && matchesPaymentMethod && matchesDateRange;
  });

  // Sorting logic
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date + ' ' + a.time);
        bValue = new Date(b.date + ' ' + b.time);
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'member':
        aValue = a.memberName.toLowerCase();
        bValue = b.memberName.toLowerCase();
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      default:
        aValue = a.id;
        bValue = b.id;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);



  const handleApproveTransaction = (approvalId) => {
    console.log('Approving transaction:', approvalId);
    // In a real app, this would make an API call to approve the transaction
  };

  const handleViewTransaction = (transactionId) => {
    console.log('Viewing transaction details:', transactionId);
    // In a real app, this would open a transaction details modal
  };

  const handlePrintReceipt = (transactionId) => {
    console.log('Printing receipt for transaction:', transactionId);
    const tx = recentTransactions.find(t => (t.id === transactionId) || (t.reference === transactionId));
    if (!tx) {
      console.log('CashierDashboard: transaction not found for print', transactionId);
      return;
    }
    const safe = {
      id: tx.id,
      memberName: tx.memberName,
      type: tx.type || 'other',
      amount: tx.amount || 0,
      paymentMethod: tx.paymentMethod || 'cash',
      description: tx.description || '',
      date: tx.date,
      time: tx.time,
      reference: tx.reference || tx.id,
      processedBy: tx.processedBy || 'ক্যাশিয়ার',
      transactionId: tx.reference || tx.id,
      status: tx.status || 'completed'
    };
    setSelectedTransaction(safe);
    setShowTransactionCard(true);
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.log('CashierDashboard: window.print failed', e);
      }
    }, 200);
  };

  // Lightweight refresh dedicated for transaction list only (used inside Transaction History card)
  const handleRefreshTransactions = async () => {
    if (refreshingTransactions) return; // Prevent multiple clicks

    console.log('🔄 Starting transaction refresh...');
    setRefreshingTransactions(true); // Start spinner only for icon

    try {
      // Add minimum loading time for better UX (at least 500ms)
      const [result] = await Promise.all([
        TransactionService.getAllTransactions(),
        new Promise(resolve => setTimeout(resolve, 500))
      ]);
      
      if (result.success) {
        setTransactions(result.data || []);
        console.log('✅ Transaction refresh successful:', result.data?.length || 0, 'transactions loaded');
      } else {
        console.error('❌ লেনদেন লোড করতে ত্রুটি:', result.error);
      }
    } catch (error) {
      console.error('❌ লেনদেন লোড করতে ত্রুটি:', error);
    } finally {
      setRefreshingTransactions(false); // Stop spinner
      setLastRefresh(new Date());
      console.log('🛑 Transaction refresh completed, spinner stopped');
    }
  };


  // Add New Member Form Functions
  const handleInputChange = (field, value) => {
    setNewMemberData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (memberFormErrors[field]) {
      setMemberFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newMemberData.name.trim()) {
      errors.name = 'নাম আবশ্যক';
    }
    
    if (!newMemberData.shareCount.trim()) {
      errors.shareCount = 'শেয়ার সংখ্যা আবশ্যক';
    } else if (isNaN(newMemberData.shareCount) || Number(newMemberData.shareCount) <= 0) {
      errors.shareCount = 'সঠিক শেয়ার সংখ্যা দিন';
    }
    
    // Optional phone validation (match MemberList.jsx behavior)
    if (newMemberData.phone?.trim() && !/^01[3-9]\d{8}$/.test(newMemberData.phone)) {
      errors.phone = 'সঠিক ফোন নম্বর দিন (01XXXXXXXXX)';
    }
    
    // Optional nominee phone validation
    if (newMemberData.nomineePhone?.trim() && !/^01[3-9]\d{8}$/.test(newMemberData.nomineePhone)) {
      errors.nomineePhone = 'সঠিক নমিনির ফোন নম্বর দিন (01XXXXXXXXX)';
    }
    
    return errors;
  };

  const handleSubmitNewMember = async (e) => {
    e.preventDefault();
    console.log('🔥 handleSubmitNewMember called');
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      console.log('❌ Form validation errors:', errors);
      setMemberFormErrors(errors);
      return;
    }
    
    try {
      setSaving(true);
      console.log('💾 Setting saving to true');
      // Step 1: Generate credentials identical to MemberList.jsx
      const credentials = generateEmailCredentials(newMemberData.name);
      console.log('🔐 Generated credentials:', credentials);

      console.log('CashierDashboard: duplicate check input', { email: credentials.email, phone: newMemberData.phone, name: newMemberData.name });
      const dupResult = await MemberService.isDuplicateMember({ phone: newMemberData.phone, email: credentials.email, name: newMemberData.name });
      console.log('CashierDashboard: duplicate check result', dupResult);
      if (dupResult?.exists) {
        setError(`এই সদস্য ইতিমধ্যে আছে (${dupResult.by})`);
        return;
      }

      const registrationResponse = await registerUser(credentials.email, credentials.password);

      if (!registrationResponse?.success) {
        throw new Error(registrationResponse?.message || 'Backend registration failed');
      }

      const { user_id } = registrationResponse;
      console.log('✅ Backend registration successful, user_id:', user_id);

      // Step 3: Prepare member data (match MemberList.jsx fields)
      const memberData = {
        name: newMemberData.name,
        phone: newMemberData.phone,
        address: newMemberData.address,
        shareCount: newMemberData.shareCount,
        nomineeName: newMemberData.nomineeName,
        nomineePhone: newMemberData.nomineePhone,
        nomineeRelation: newMemberData.nomineeRelation,
        joiningDate: newMemberData.joiningDate,
        role: newMemberData.role || 'member',
        email: credentials.email,
        password: credentials.password,
        user_id: user_id,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'ক্যাশিয়ার'
      };

      console.log('📝 নতুন সদস্য যোগ করা হচ্ছে (Firestore):', memberData);

      // Step 4: Save to Firestore using user_id as the document ID
      const result = await handleAddMember(memberData, user_id);
      console.log('📊 handleAddMember result:', result);
      
      if (result && result.success) {
        console.log('✅ Member added successfully');
        console.log('CashierDashboard: toast success - সদস্য যোগ');
        toast.success(`${newMemberData.name} সফলভাবে সমিতিতে যোগদান করেছেন।`);
        // Reset form
        setNewMemberData({
          name: '',
          phone: '',
          address: '',
          shareCount: '',
          nomineeName: '',
          nomineePhone: '',
          nomineeRelation: '',
          joiningDate: new Date().toISOString().split('T')[0],
          role: 'member'
        });
        setMemberFormErrors({});
        console.log('🔄 Form reset');
        setShowAddMemberModal(false);
        const updatedMembersResult = await MemberService.getAllMembers();
        console.log('📋 Updated members result:', updatedMembersResult);
        if (updatedMembersResult.success) {
          setMembers(updatedMembersResult.data || []);
          console.log('👥 Members list updated');
        }
      } else {
        console.error('❌ সদস্য যোগ করতে ত্রুটি:', result?.error || 'Unknown error');
        // You could show an error animation here too
      }
      
    } catch (error) {
      console.error('💥 সদস্য যোগ করতে ত্রুটি:', error);
      // You could show an error animation here too
    } finally {
      setSaving(false);
      console.log('🏁 Setting saving to false');
    }
  };

  const handleCloseModal = () => {
    setShowAddMemberModal(false);
    setMemberFormErrors({});
  };

  // Helper function to create loading skeleton
  const LoadingSkeleton = ({ className = "", height = "h-4" }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${height} ${className}`}></div>
  );

  return (
    <>
      <div className="treasury-container cashier-dashboard">
      <div className="p-4">
      {console.log('[CashierDashboard] render profile header v2')}
      <div className="treasury-card cashier-profile-card mb-3">
        <div className="cashier-profile-banner">
          {console.log('[CashierDashboard] banner render')}
          <div className="banner-accent" />
        </div>
        <div className="flex items-center gap-4">
          <div
            className="profile-avatar avatar-ring w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
            role="button"
            tabIndex={0}
            onClick={() => { console.log('[CashierDashboard] open photo modal'); setIsPhotoModalOpen(true); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { console.log('[CashierDashboard] open photo modal via keyboard'); setIsPhotoModalOpen(true); } }}
          >
            {photoURL ? (
              <>
                <img src={photoURL} alt="avatar" className="profile-photo" />
                <div className="photo-overlay">
                  <Camera className="h-8 w-8 text-black" />
                </div>
              </>
            ) : (
              <>
                {console.log('[CashierDashboard] render fallback avatar (camera centered)')}
                <Camera className="h-8 w-8 text-black" />
              </>
            )}
          </div>
          <div className="flex-1">
            <div className="profile-content-box">
              <div className="flex items-center gap-2">
                <h2 className="profile-name text-xl font-extrabold">
                  {(currentUser && currentUser.name) || (authUser && authUser.name) || 'ক্যাশিয়ার'}
                </h2>
                <span className="profile-role px-3 py-1.5 text-sm rounded-full">
                  <User className="badge-icon" />
                  ক্যাশিয়ার
                </span>
              </div>
              <div className="profile-meta text-sm flex gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  আইডি: {somitiUserId || currentUser?.id || authUser?.uid || ''}
                </span>
              </div>
              {console.log('[CashierDashboard] render profile chips')}
              <div className="profile-chips">
                <span className="chip">আইডি: {somitiUserId || currentUser?.id || authUser?.uid || ''}</span>
                <span className="chip">{currentUser?.status || 'সক্রিয়'}</span>
              </div>
              <div className="profile-actions">
                <button type="button" className="action-icon" title="সেটিংস" onClick={() => console.log('[CashierDashboard] settings clicked') }>
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => { console.log('[CashierDashboard] close photo modal'); setIsPhotoModalOpen(false); }}
        userId={currentUser?.uid}
        currentPhotoURL={photoURL}
        onPhotoUpdate={(newPhotoURL) => { console.log('[CashierDashboard] photo updated', { newPhotoURL }); setPhotoURL(newPhotoURL); }}
      />

      <div className="flex flex-col items-center gap-2 mb-3">
        <button 
          onClick={refreshData}
          disabled={loading.initial}
          className={`icon-action-btn blue flex items-center gap-2 w-48 justify-center ${loading.initial ? 'opacity-75 cursor-not-allowed' : ''}`}
          title={loading.initial ? "ডেটা লোড হচ্ছে..." : "সব ডেটা রিফ্রেশ করুন"}
        >
          <RefreshCw className={`h-4 w-4 ${loading.initial ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">
            {loading.initial ? 'লোড হচ্ছে...' : 'রিফ্রেশ করুন'}
          </span>
        </button>
      </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Monthly Summary Card */}
        <div className="treasury-card">
          {/* Card Header */}
          <div className="treasury-card-header">
            <h3 className="treasury-card-title">মাসিক সারসংক্ষেপ</h3>
            <div className="treasury-card-icon">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
            

            
            {/* Summary Metrics Grid */}
          <div className="treasury-summary-grid">
            {/* Total Members */}
            <div className="treasury-card">
              <div className="treasury-card-info">
                <h3 className="treasury-card-label">মোট সদস্য</h3>
                <div className="treasury-card-value">
                  {loading.members ? <LoadingSkeleton className="w-16 h-10" /> : monthlySummary.totalMembers}
                </div>
                <div className="treasury-card-subtitle">সক্রিয় সদস্য</div>
              </div>
              <div className="treasury-card-icon">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Monthly Collection */}
            <div className="treasury-card">
              <div className="treasury-card-info">
                <h3 className="treasury-card-label">মাসিক সংগ্রহ</h3>
                <div className="treasury-card-value">
                  {loading.transactions ? <LoadingSkeleton className="w-24 h-10" /> : `৳ ${monthlySummary.totalCollected.toLocaleString()}`}
                </div>
                <div className="treasury-card-subtitle">এই মাসে</div>
              </div>
              <div className="treasury-card-icon">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            {/* Cashier Balance */}
            <div className="treasury-card !bg-transparent !shadow-none border-2 border-dashed border-gray-300">
              <div className="treasury-card-info">
                <h3 className="treasury-card-label">ক্যাশিয়ার ব্যালেন্স</h3>
                <div className="treasury-card-value">
                  {loading.fundData ? <LoadingSkeleton className="w-24 h-10" /> : `৳ ${fundSummary.totalBalance.toLocaleString()}`}
                </div>
                <div className="treasury-card-subtitle">হাতে নগদ</div>
              </div>
              <div className="treasury-card-icon">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Card */}
        <div className="treasury-card">
          {/* Card Header */}
          <div className="treasury-card-header">
            <div className="treasury-card-title">
              <div className="treasury-card-icon">
                <Banknote className="w-5 h-5" />
              </div>
              <h3>পেমেন্ট পদ্ধতি</h3>
            </div>
            <button 
              onClick={() => setPaymentMethodSortOrder(paymentMethodSortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
              title="পরিমাণ অনুযায়ী সাজান"
            >
              {paymentMethodSortOrder === 'desc' ? 
                <SortDesc className="h-4 w-4" /> : 
                <SortAsc className="h-4 w-4" />
              }
            </button>
          </div>
          
          {/* Payment Methods Grid */}
          <div className="treasury-summary-grid">
            {loading.fundData ? (
              <>
                <div className="treasury-card">
                  <div className="treasury-card-content">
                    <div className="treasury-card-info">
                      <LoadingSkeleton className="w-16 h-4" />
                      <LoadingSkeleton className="w-20 h-8" />
                      <LoadingSkeleton className="w-12 h-3" />
                    </div>
                    <div className="treasury-card-icon">
                      <LoadingSkeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="treasury-card">
                  <div className="treasury-card-content">
                    <div className="treasury-card-info">
                      <LoadingSkeleton className="w-20 h-4" />
                      <LoadingSkeleton className="w-24 h-8" />
                      <LoadingSkeleton className="w-16 h-3" />
                    </div>
                    <div className="treasury-card-icon">
                      <LoadingSkeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="treasury-card">
                  <div className="treasury-card-content">
                    <div className="treasury-card-info">
                      <LoadingSkeleton className="w-18 h-4" />
                      <LoadingSkeleton className="w-16 h-8" />
                      <LoadingSkeleton className="w-14 h-3" />
                    </div>
                    <div className="treasury-card-icon">
                      <LoadingSkeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              sortedPaymentMethods.slice(0, 4).map((method, index) => {
                // Get icon based on payment method
                const getPaymentIcon = (methodName) => {
                  if (methodName.includes('নগদ') || methodName.includes('ক্যাশ')) {
                    return <Banknote className="h-5 w-5" />;
                  } else if (methodName.includes('বিকাশ')) {
                    return <Phone className="h-5 w-5" />;
                  } else if (methodName.includes('ব্যাংক')) {
                    return <Calculator className="h-5 w-5" />;
                  } else {
                    return <Wallet className="h-5 w-5" />;
                  }
                };

                return (
                  <div key={index} className="treasury-card treasury-card-compact">
                    <div className="treasury-card-info">
                      <h3 className="treasury-card-label">{method.method}</h3>
                      <div className="treasury-card-value">
                        ৳ {method.amount.toLocaleString()}
                      </div>
                      <div className="treasury-card-subtitle">
                        {method.count} টি লেনদেন • {method.percentage}%
                      </div>
                    </div>
                    <div className="treasury-card-icon">
                      {getPaymentIcon(method.method)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* See All Payment Methods Button */}
          {!loading.fundData && sortedPaymentMethods.length > 4 && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/transactions')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
              >
                আরও {sortedPaymentMethods.length - 4} টি পেমেন্ট পদ্ধতি দেখুন
              </button>
            </div>
          )}
        </div>

        {/* Expense Tracking Card */}
        <div className="treasury-card">
          {/* Card Header */}
          <div className="treasury-card-header">
            <div className="treasury-card-title">
              <div className="treasury-card-icon">
                <Receipt className="w-5 h-5" />
              </div>
              <h3>খরচের রেকর্ড</h3>
            </div>
          </div>
          
          {/* Expense Summary Grid */}
          <div className="treasury-summary-grid">
            {/* Total Expense */}
            <div className="treasury-card">
              <div className="treasury-card-info">
                <h3 className="treasury-card-label">মোট খরচ</h3>
                <div className="treasury-card-value">
                  {loading.transactions ? (
                    <LoadingSkeleton className="w-24 h-8" />
                  ) : (
                    `৳ ${expenseRecords.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}`
                  )}
                </div>
                <div className="treasury-card-subtitle">এই মাসে</div>
              </div>
              <div className="treasury-card-icon">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>

            {/* Recent Expenses */}
            {loading.transactions ? (
              <>
                <div className="treasury-card">
                  <div className="treasury-card-content">
                    <div className="treasury-card-info">
                      <LoadingSkeleton className="w-20 h-4" />
                      <LoadingSkeleton className="w-16 h-8" />
                      <LoadingSkeleton className="w-24 h-3" />
                    </div>
                    <div className="treasury-card-icon">
                      <LoadingSkeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="treasury-card">
                  <div className="treasury-card-content">
                    <div className="treasury-card-info">
                      <LoadingSkeleton className="w-18 h-4" />
                      <LoadingSkeleton className="w-20 h-8" />
                      <LoadingSkeleton className="w-16 h-3" />
                    </div>
                    <div className="treasury-card-icon">
                      <LoadingSkeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              expenseRecords.slice(0, 2).map((expense) => {
                // Get expense category icon
                const getExpenseIcon = (type) => {
                  if (type === 'expense') {
                    return <Receipt className="h-5 w-5" />;
                  } else if (type === 'loan_disbursement') {
                    return <ArrowUpRight className="h-5 w-5" />;
                  } else if (type === 'withdrawal') {
                    return <ArrowDownRight className="h-5 w-5" />;
                  } else {
                    return <Receipt className="h-5 w-5" />;
                  }
                };

                const getExpenseTypeLabel = (type) => {
                  if (type === 'expense') return 'খরচ';
                  if (type === 'loan_disbursement') return 'ঋণ প্রদান';
                  if (type === 'withdrawal') return 'উত্তোলন';
                  return 'অন্যান্য';
                };

                return (
                  <div key={expense.id} className="treasury-card">
                    <div className="treasury-card-content">
                      <div className="treasury-card-info">
                        <h3 className="treasury-card-label">{getExpenseTypeLabel(expense.type)}</h3>
                        <div className="treasury-card-value">
                          ৳ {expense.amount.toLocaleString()}
                        </div>
                        <div className="treasury-card-subtitle">
                          {expense.description}
                        </div>
                      </div>
                      <div className="treasury-card-icon">
                        {getExpenseIcon(expense.type)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* View All Link */}
          {!loading.transactions && expenseRecords.length > 3 && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/transactions')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
              >
                আরও {expenseRecords.length - 3} টি খরচ দেখুন
              </button>
            </div>
          )}
        </div>

        

        

        {/* Add New Member Modal */}
        {showAddMemberModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2 className="modal-title">
                  <UserPlus size={20} />
                  নতুন সদস্য যোগ করুন
                </h2>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={handleCloseModal}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmitNewMember} className="modal-form">
                  {/* Basic Information */}
                  <div className="form-section">
                    <h3 className="form-section-title">
                      <User size={18} />
                      মূল তথ্য
                    </h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">নাম *</label>
                      <input
                        type="text"
                        className={`form-input ${memberFormErrors.name ? 'error' : ''}`}
                        value={newMemberData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="সদস্যের নাম লিখুন"
                      />
                      {memberFormErrors.name && (
                        <span className="error-message">{memberFormErrors.name}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Phone size={16} />
                        ফোন নম্বর (ঐচ্ছিক)
                      </label>
                      <input
                        type="tel"
                        className={`form-input ${memberFormErrors.phone ? 'error' : ''}`}
                        value={newMemberData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="01XXXXXXXXX"
                      />
                      {memberFormErrors.phone && (
                        <span className="error-message">{memberFormErrors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={16} />
                      ঠিকানা (ঐচ্ছিক)
                    </label>
                    <textarea
                      className={`form-textarea ${memberFormErrors.address ? 'error' : ''}`}
                      value={newMemberData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                      rows="2"
                    />
                    {memberFormErrors.address && (
                      <span className="error-message">{memberFormErrors.address}</span>
                    )}
                  </div>
                </div>

                  {/* Share Information */}
                  <div className="form-section">
                    <h3 className="form-section-title">
                      <DollarSign size={18} />
                      শেয়ার তথ্য
                    </h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <DollarSign size={16} />
                        শেয়ার সংখ্যা *
                      </label>
                      <input
                        type="number"
                        className={`form-input ${memberFormErrors.shareCount ? 'error' : ''}`}
                        value={newMemberData.shareCount}
                        onChange={(e) => handleInputChange('shareCount', e.target.value)}
                        placeholder="কতটি শেয়ার কিনেছেন"
                        min="1"
                      />
                      {memberFormErrors.shareCount && (
                        <span className="error-message">{memberFormErrors.shareCount}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">যোগদানের তারিখ</label>
                      <input
                        type="date"
                        className="form-input"
                        value={newMemberData.joiningDate}
                        onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                  {/* Nominee Information */}
                  <div className="form-section">
                    <h3 className="form-section-title">
                      <Users size={18} />
                      নমিনি তথ্য
                    </h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <User size={16} />
                        নমিনির নাম (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        className={`form-input ${memberFormErrors.nomineeName ? 'error' : ''}`}
                        value={newMemberData.nomineeName}
                        onChange={(e) => handleInputChange('nomineeName', e.target.value)}
                        placeholder="নমিনির নাম লিখুন"
                      />
                      {memberFormErrors.nomineeName && (
                        <span className="error-message">{memberFormErrors.nomineeName}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Phone size={16} />
                        নমিনির ফোন (ঐচ্ছিক)
                      </label>
                      <input
                        type="tel"
                        className={`form-input ${memberFormErrors.nomineePhone ? 'error' : ''}`}
                        value={newMemberData.nomineePhone}
                        onChange={(e) => handleInputChange('nomineePhone', e.target.value)}
                        placeholder="01XXXXXXXXX"
                      />
                      {memberFormErrors.nomineePhone && (
                        <span className="error-message">{memberFormErrors.nomineePhone}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">নমিনির সাথে সম্পর্ক (ঐচ্ছিক)</label>
                    <select
                      className={`form-select ${memberFormErrors.nomineeRelation ? 'error' : ''}`}
                      value={newMemberData.nomineeRelation}
                      onChange={(e) => handleInputChange('nomineeRelation', e.target.value)}
                    >
                      <option value="">সম্পর্ক নির্বাচন করুন</option>
                      <option value="পিতা">পিতা</option>
                      <option value="মাতা">মাতা</option>
                      <option value="স্বামী">স্বামী</option>
                      <option value="স্ত্রী">স্ত্রী</option>
                      <option value="ভাই">ভাই</option>
                      <option value="বোন">বোন</option>
                      <option value="ছেলে">ছেলে</option>
                      <option value="মেয়ে">মেয়ে</option>
                      <option value="অন্যান্য">অন্যান্য</option>
                    </select>
                    {memberFormErrors.nomineeRelation && (
                      <span className="error-message">{memberFormErrors.nomineeRelation}</span>
                    )}
                  </div>
                </div>

                  {/* Form Actions */}
                  <div className="form-actions">
                    <button
                      type="button"
                      className="form-btn form-btn-cancel"
                      onClick={handleCloseModal}
                    >
                      <X size={16} />
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="form-btn form-btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          সংরক্ষণ করা হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          সংরক্ষণ করুন
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Transaction Details Card */}
      <TransactionDetailsCard
          transaction={selectedTransaction}
          isVisible={showTransactionCard}
          onClose={closeTransactionCard}
          position={cardPosition}
        />

      {console.log('[CashierDashboard] render floating add button')}
      <button
        className="cashier-fab"
        aria-label="নতুন লেনদেন"
        onClick={() => { console.log('[CashierDashboard] FAB clicked -> navigate add transaction'); navigate('/cashier/add-transaction'); }}
        onMouseEnter={() => { console.log('[CashierDashboard] FAB mouse enter'); }}
        onMouseLeave={() => { console.log('[CashierDashboard] FAB mouse leave'); }}
      >
        <Plus className="h-6 w-6 text-white cashier-fab-icon" />
      </button>

      
    </>
  );
};

export default CashierDashboard;