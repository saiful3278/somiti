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
import SearchInput from './common/SearchInput';
import TransactionDetailsCard from './common/TransactionDetailsCard';
import SuccessAnimation from './common/SuccessAnimation';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { MemberService, TransactionService, FundService } from '../firebase';
import '../styles/components/cashier-dashboard.css';

const CashierDashboard = () => {
  const navigate = useNavigate();
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
  
  // Success animation state
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successAnimationData, setSuccessAnimationData] = useState({
    title: '',
    message: '',
    type: 'default'
  });
  
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

  // Add new member function
  const handleAddMember = async (memberData) => {
    try {
      setSaving(true);
      console.log('🚀 handleAddMember called with:', memberData);
      
      const addResult = await MemberService.addMember(memberData);
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
  
  // Monthly report state
  const [selectedReportMonth, setSelectedReportMonth] = useState('2024-01');
  const [reportViewMode, setReportViewMode] = useState('overview'); // overview, charts, details
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
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
   const monthlyReportData = {
     '2024-01': {
       month: 'জানুয়ারি ২০২৪',
       totalIncome: 110000,
       totalExpense: 45000,
       memberSubscriptions: 85000,
       donations: 25000,
       officeExpenses: 18000,
       eventExpenses: 15000,
       utilityExpenses: 8000,
       maintenanceExpenses: 4000,
       memberCount: 85,
       newMembers: 5,
       activeMembers: 82,
       loansDisbursed: 35000,
       loansCollected: 28000,
       pendingCollections: 12000,
       cashFlow: [
         { day: '১', income: 4200, expense: 1500 },
         { day: '৫', income: 8500, expense: 2200 },
         { day: '১০', income: 12000, expense: 3500 },
         { day: '১৫', income: 15500, expense: 4800 },
         { day: '২০', income: 18200, expense: 6200 },
         { day: '২৫', income: 22000, expense: 7500 },
         { day: '৩১', income: 25000, expense: 9000 }
       ],
       categoryBreakdown: [
         { name: 'সদস্য চাঁদা', value: 85000, color: '#3B82F6' },
         { name: 'দান', value: 25000, color: '#10B981' }
       ],
       expenseBreakdown: [
         { name: 'অফিস খরচ', value: 18000, color: '#EF4444' },
         { name: 'ইভেন্ট', value: 15000, color: '#F59E0B' },
         { name: 'ইউটিলিটি', value: 8000, color: '#EC4899' },
         { name: 'রক্ষণাবেক্ষণ', value: 4000, color: '#6B7280' }
       ],
       monthlyComparison: [
         { month: 'নভেম্বর', income: 103000, expense: 42000 },
         { month: 'ডিসেম্বর', income: 107000, expense: 44000 },
         { month: 'জানুয়ারি', income: 110000, expense: 45000 }
       ]
     }
   };

   // Calculate real monthly report data from Firebase transactions
   const currentReportData = React.useMemo(() => {
     const currentMonth = new Date().getMonth();
     const currentYear = new Date().getFullYear();
     
     const monthlyTransactions = transactions.filter(transaction => {
       if (!transaction.createdAt) return false;
       const transactionDate = new Date(transaction.createdAt.seconds * 1000);
       return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
     });
     
     const totalIncome = monthlyTransactions
       .filter(t => ['monthly_deposit', 'share_purchase', 'donation'].includes(t.transactionType || t.type))
       .reduce((sum, t) => sum + (t.amount || 0), 0);
       
     const totalExpense = monthlyTransactions
       .filter(t => ['expense', 'loan_disbursement', 'withdrawal'].includes(t.transactionType || t.type))
       .reduce((sum, t) => sum + (t.amount || 0), 0);
     
     return {
       month: new Date().toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' }),
       totalIncome,
       totalExpense,
       memberSubscriptions: monthlyTransactions
         .filter(t => t.transactionType === 'monthly_deposit')
         .reduce((sum, t) => sum + (t.amount || 0), 0),
       donations: monthlyTransactions
         .filter(t => t.transactionType === 'donation')
         .reduce((sum, t) => sum + (t.amount || 0), 0)
     };
   }, [transactions]);

   // Report generation functions
   const handleGenerateReport = async () => {
     setIsGeneratingReport(true);
     // Simulate report generation
     setTimeout(() => {
       setIsGeneratingReport(false);
       alert('রিপোর্ট সফলভাবে তৈরি হয়েছে!');
     }, 2000);
   };

   const handleExportPDF = () => {
     alert('PDF ডাউনলোড শুরু হচ্ছে...');
   };

   const handleShareReport = () => {
     alert('রিপোর্ট শেয়ার করার লিংক কপি হয়েছে!');
   };

   const handlePrintReport = () => {
     window.print();
   };

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
    // In a real app, this would generate and print a receipt
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
    
    if (!newMemberData.phone.trim()) {
      errors.phone = 'ফোন নম্বর আবশ্যক';
    } else if (!/^01[3-9]\d{8}$/.test(newMemberData.phone)) {
      errors.phone = 'সঠিক ফোন নম্বর দিন (01XXXXXXXXX)';
    }
    
    if (!newMemberData.address.trim()) {
      errors.address = 'ঠিকানা আবশ্যক';
    }
    
    if (!newMemberData.shareCount.trim()) {
      errors.shareCount = 'শেয়ার সংখ্যা আবশ্যক';
    } else if (isNaN(newMemberData.shareCount) || Number(newMemberData.shareCount) <= 0) {
      errors.shareCount = 'সঠিক শেয়ার সংখ্যা দিন';
    }
    
    if (!newMemberData.nomineeName.trim()) {
      errors.nomineeName = 'নমিনির নাম আবশ্যক';
    }
    
    if (!newMemberData.nomineePhone.trim()) {
      errors.nomineePhone = 'নমিনির ফোন নম্বর আবশ্যক';
    } else if (!/^01[3-9]\d{8}$/.test(newMemberData.nomineePhone)) {
      errors.nomineePhone = 'সঠিক নমিনির ফোন নম্বর দিন (01XXXXXXXXX)';
    }
    
    if (!newMemberData.nomineeRelation.trim()) {
      errors.nomineeRelation = 'নমিনির সাথে সম্পর্ক নির্বাচন আবশ্যক';
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
      
      // Generate member ID (simple sequential number)
      const memberId = String(monthlySummary.totalMembers + 1);
      
      const memberData = {
        ...newMemberData,
        memberId,
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: 'ক্যাশিয়ার - আহমেদ'
      };
      
      console.log('📝 নতুন সদস্য যোগ করা হচ্ছে:', memberData);
      
      // Call the existing handleAddMember function
      const result = await handleAddMember(memberData);
      console.log('📊 handleAddMember result:', result);
      
      if (result && result.success) {
        console.log('✅ Member added successfully, showing animation');
        
        // Show success animation immediately
        const animationData = {
          title: 'সদস্য যোগ করা হয়েছে!',
          message: `${newMemberData.name} সফলভাবে সমিতিতে যোগদান করেছেন।`,
          type: 'member'
        };
        console.log('🎉 Setting animation data:', animationData);
        
        setSuccessAnimationData(animationData);
        setShowSuccessAnimation(true);
        console.log('🎬 Animation state set to true');
        
        // Reset form
        setNewMemberData({
          name: '',
          phone: '',
          address: '',
          shareCount: '',
          nomineeName: '',
          nomineePhone: '',
          nomineeRelation: '',
          joiningDate: new Date().toISOString().split('T')[0]
        });
        setMemberFormErrors({});
        console.log('🔄 Form reset');
        
        // Close modal after animation duration and reload members in background
        setTimeout(async () => {
          setShowAddMemberModal(false);
          console.log('🚪 Modal closed after animation');
          
          // Reload members in background after modal closes
          const updatedMembersResult = await MemberService.getAllMembers();
          console.log('📋 Updated members result:', updatedMembersResult);
          
          if (updatedMembersResult.success) {
            setMembers(updatedMembersResult.data || []);
            console.log('👥 Members list updated');
          }
        }, 3500); // Wait for animation to complete
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
      <div className="treasury-header">
        <h1 className="treasury-title">ক্যাশিয়ার ড্যাশবোর্ড</h1>
        <p className="treasury-subtitle">আর্থিক লেনদেন ও তহবিল ব্যবস্থাপনা</p>
      </div>

      {/* Central Action Buttons */}
      <div className="flex flex-col items-center gap-2 mb-3">
        {/* Refresh Button */}
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
        
        {/* Add Member Button */}
        <button 
          onClick={() => setShowAddMemberModal(true)}
          className="icon-action-btn green flex items-center gap-2 w-48 justify-center"
          title="নতুন সদস্য যোগ করুন"
        >
          <UserPlus className="h-4 w-4" />
          <span className="text-sm font-medium">নতুন সদস্য</span>
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

        {/* Monthly Report Card */}
        <div className="treasury-card">
          {/* Card Header */}
          <div className="treasury-card-header">
            <div className="treasury-card-title">
              <div className="treasury-card-icon">
                <FileText className="w-5 h-5" />
              </div>
              <h3>মাসিক রিপোর্ট</h3>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              {new Date().toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          
          {/* Current Month Header */}
          <div className="monthly-report-header">
            <div className="monthly-report-header-content">
              <div className="monthly-report-header-icon">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="monthly-report-header-text">
                <h2 className="monthly-report-title">বর্তমান মাস</h2>
                <div className="monthly-report-date">
                  {new Date().toLocaleDateString('bn-BD', { month: 'long' })} ২০২৫
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Report Grid */}
          <div className="treasury-summary-grid">

            {/* Total Income */}
            <div className="treasury-card">
              <div className="treasury-card-info">
                <h3 className="treasury-card-label">মোট আয়</h3>
                <div className="treasury-card-value">
                  {loading.transactions || loading.fundData ? (
                    <LoadingSkeleton className="h-8 w-24" />
                  ) : (
                    `৳ ${currentReportData.totalIncome.toLocaleString()}`
                  )}
                </div>
                <div className="treasury-card-subtitle">এই মাসে</div>
              </div>
              <div className="treasury-card-icon">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            {/* Total Expense */}
            <div className="treasury-card">
              <div className="treasury-card-info">
                <h3 className="treasury-card-label">মোট ব্যয়</h3>
                <div className="treasury-card-value">
                  {loading.transactions || loading.fundData ? (
                    <LoadingSkeleton className="h-8 w-24" />
                  ) : (
                    `৳ ${currentReportData.totalExpense.toLocaleString()}`
                  )}
                </div>
                <div className="treasury-card-subtitle">এই মাসে</div>
              </div>
              <div className="treasury-card-icon">
                <ArrowDownRight className="h-5 w-5" />
              </div>
            </div>

            {/* Net Balance */}
            <div className="treasury-card">
              <div className="treasury-card-info">
                <h3 className="treasury-card-label">নেট ব্যালান্স</h3>
                <div className="treasury-card-value">
                  {loading.transactions || loading.fundData ? (
                    <LoadingSkeleton className="h-6 w-24" />
                  ) : (
                    `৳ ${(currentReportData.totalIncome - currentReportData.totalExpense).toLocaleString()}`
                  )}
                </div>
                <div className="treasury-card-subtitle">
                  {!loading.transactions && !loading.fundData && (
                    (currentReportData.totalIncome - currentReportData.totalExpense) >= 0 
                      ? 'লাভজনক অবস্থা'
                      : 'ঘাটতি রয়েছে'
                  )}
                </div>
              </div>
              <div className="treasury-card-icon">
                <Calculator className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Card */}
        <div className="treasury-card">
          {/* Card Header */}
          <div className="treasury-card-header">
            <div className="treasury-card-title">
              <div className="treasury-card-icon">
                <Receipt className="w-5 h-5" />
              </div>
              <h3>সাম্প্রতিক লেনদেন</h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                {searchFilteredTransactions.length} টি লেনদেন
              </span>
            </div>
          </div>
          
          {/* Search Input */}
            <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="সদস্য বা লেনদেনের ধরন খুঁজুন..."
                value={transactionSearchTerm}
                onChange={(e) => setTransactionSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              />
              {transactionSearchTerm && (
                <button
                  onClick={() => setTransactionSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Transaction List */}
            <div className="space-y-2">
            {loading.transactions ? (
              <>
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <LoadingSkeleton className="h-4 w-32 mb-2" />
                          <LoadingSkeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <LoadingSkeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </>
            ) : searchFilteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Receipt className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-gray-600 font-medium mb-2">কোনো লেনদেন পাওয়া যায়নি</h4>
                {transactionSearchTerm && (
                  <p className="text-sm text-gray-500">"{transactionSearchTerm}" এর জন্য কোনো ফলাফল নেই</p>
                )}
              </div>
            ) : (
              searchFilteredTransactions.slice(0, 4).map((transaction) => (
                <div key={transaction.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm group">
                  <div 
                    className="p-4 cursor-pointer hover:bg-white/50 transition-all duration-300"
                    onClick={(event) => handleTransactionClick(transaction, event)}
                  >
                    <div className="flex items-center justify-between">
                      {/* Transaction Info */}
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-sm ${
                          transaction.type === 'deposit' ? 'bg-green-100/50 text-green-600' :
                          transaction.type === 'withdrawal' ? 'bg-red-100/50 text-red-600' :
                          transaction.type === 'loan' ? 'bg-orange-100/50 text-orange-600' :
                          'bg-blue-100/50 text-blue-600'
                        }`}>
                          {transaction.type === 'deposit' ? <ArrowUpRight className="h-5 w-5" /> :
                           transaction.type === 'withdrawal' ? <ArrowDownRight className="h-5 w-5" /> :
                           transaction.type === 'loan' ? <Banknote className="h-5 w-5" /> :
                           <DollarSign className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{transaction.memberName}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span>{getTransactionTypeLabel(transaction.type)}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{new Date(transaction.date).toLocaleDateString('bn-BD')}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Amount and Expand */}
                      <div className="flex items-center space-x-3">
                        <div className={`text-base sm:text-lg font-bold ${
                          transaction.type === 'deposit' ? 'text-green-600' :
                          transaction.type === 'withdrawal' ? 'text-red-600' :
                          transaction.type === 'loan' ? 'text-orange-600' :
                          'text-blue-600'
                        }`}>
                          ৳ {(transaction.amount || 0).toLocaleString()}
                        </div>
                        <div className="text-gray-400 transition-transform duration-200 ${
                          expandedTransaction === transaction.id ? 'rotate-180' : ''
                        }">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                
                  {/* Expanded Details */}
                  {expandedTransaction === transaction.id && (
                    <div className="px-4 pb-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center justify-between sm:block py-2">
                          <span className="text-gray-500 text-xs font-medium">মাস:</span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100/50 text-green-700 border border-green-200">
                            {(() => {
                              const getMonthNameFromDate = (dateString) => {
                                const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
                                if (dateString) {
                                  const date = new Date(dateString);
                                  return monthNames[date.getMonth()];
                                }
                                return 'এই মাসে';
                              };
                              return getMonthNameFromDate(transaction.date);
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between sm:block py-2">
                          <span className="text-gray-500 text-xs font-medium">পেমেন্ট পদ্ধতি:</span>
                          <span className="text-sm font-semibold text-gray-800">{getPaymentMethodLabel(transaction.paymentMethod)}</span>
                        </div>
                        <div className="flex items-center justify-between sm:block py-2">
                          <span className="text-gray-500 text-xs font-medium">রেফারেন্স:</span>
                          <span className="text-sm font-semibold text-gray-800">{transaction.reference}</span>
                        </div>
                        <div className="flex items-center justify-between sm:block py-2">
                          <span className="text-gray-500 text-xs font-medium">প্রক্রিয়াকারী:</span>
                          <span className="text-sm font-semibold text-gray-800">{transaction.processedBy}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* View All Link */}
          {!loading.transactions && searchFilteredTransactions.length > 4 && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/transactions')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:shadow-sm transition-all duration-300 group"
              >
                <span>সব লেনদেন দেখুন</span>
                <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full group-hover:bg-blue-300 transition-colors">
                  {searchFilteredTransactions.length - 4}+
                </span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                        ফোন নম্বর *
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
                      ঠিকানা *
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
                        নমিনির নাম *
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
                        নমিনির ফোন *
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
                    <label className="form-label">নমিনির সাথে সম্পর্ক *</label>
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
                    >
                      <Save size={16} />
                      সংরক্ষণ করুন
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

      {/* Success Animation */}
      <SuccessAnimation
        isVisible={showSuccessAnimation}
        onClose={() => setShowSuccessAnimation(false)}
        title={successAnimationData.title}
        message={successAnimationData.message}
        type={successAnimationData.type}
        autoClose={true}
        duration={3000}
      />
    </>
  );
};

export default CashierDashboard;