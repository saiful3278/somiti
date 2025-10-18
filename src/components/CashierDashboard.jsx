import React, { useState, useEffect } from 'react';
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
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { MemberService, TransactionService, FundService } from '../firebase';

const CashierDashboard = () => {
  const [loading, setLoading] = useState({
    members: true,
    transactions: true,
    fundData: true,
    initial: true
  });
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fundViewMode, setFundViewMode] = useState('overview'); // 'overview', 'cashflow', 'investments'
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  
  // Firebase data states
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fundData, setFundData] = useState({
    totalBalance: 0,
    investedAmount: 0,
    availableCash: 0,
    monthlyProfit: 0,
    monthlyExpense: 0,
    netProfit: 0,
    profitMargin: 0,
    investmentReturn: 0,
    cashFlow: [],
    investmentBreakdown: []
  });
  
  // New functionality states
  const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [paymentMethodSortOrder, setPaymentMethodSortOrder] = useState('desc'); // 'asc', 'desc'
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
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
  const [memberFormErrors, setMemberFormErrors] = useState({});
  const [error, setError] = useState(null);

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
            setFundData({
              totalBalance: result.data.totalBalance || 0,
              investedAmount: result.data.investedAmount || 0,
              availableCash: result.data.availableCash || 0,
              monthlyProfit: result.data.monthlyProfit || 0,
              monthlyExpense: result.data.monthlyExpense || 0,
              netProfit: result.data.netProfit || 0,
              profitMargin: result.data.profitMargin || 0,
              investmentReturn: result.data.investmentReturn || 0,
              cashFlow: result.data.cashFlow || [],
              investmentBreakdown: result.data.investmentBreakdown || []
            });
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
      const addResult = await MemberService.addMember(memberData);
      
      if (addResult.success) {
        // Reload members
        const updatedMembersResult = await MemberService.getAllMembers();
        if (updatedMembersResult.success) {
          setMembers(updatedMembersResult.data || []);
        }
        
        setShowAddMemberModal(false);
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
      } else {
        console.error('সদস্য যোগ করতে ত্রুটি:', addResult.error);
      }
    } catch (error) {
      console.error('সদস্য যোগ করতে ত্রুটি:', error);
    } finally {
      setSaving(false);
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
          setFundData({
            totalBalance: updatedFundResult.data.totalBalance || 0,
            investedAmount: updatedFundResult.data.investedAmount || 0,
            availableCash: updatedFundResult.data.availableCash || 0,
            monthlyProfit: updatedFundResult.data.monthlyProfit || 0,
            monthlyExpense: updatedFundResult.data.monthlyExpense || 0,
            netProfit: updatedFundResult.data.netProfit || 0,
            profitMargin: updatedFundResult.data.profitMargin || 0,
            investmentReturn: updatedFundResult.data.investmentReturn || 0,
            cashFlow: updatedFundResult.data.cashFlow || [],
            investmentBreakdown: updatedFundResult.data.investmentBreakdown || []
          });
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
      .filter(t => t.type === 'deposit' && new Date(t.createdAt?.seconds * 1000).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0),
    expectedAmount: members.length * 1200 // Assuming 1200 per member monthly
  };

  // Total fund management with enhanced data from Firebase
  const fundSummary = {
    totalBalance: fundData.totalBalance || 850000,
    investedAmount: fundData.investedAmount || 650000,
    availableCash: fundData.availableCash || 200000,
    monthlyProfit: fundData.monthlyProfit || 25000,
    monthlyExpense: fundData.monthlyExpense || 23000,
    netProfit: fundData.netProfit || 2000,
    profitMargin: fundData.profitMargin || 8.7,
    investmentReturn: fundData.investmentReturn || 3.8,
    cashFlow: fundData.cashFlow.length > 0 ? fundData.cashFlow : [
      { month: 'জানুয়ারি', income: 45600, expense: 23000, profit: 22600 },
      { month: 'ফেব্রুয়ারি', income: 48200, expense: 25000, profit: 23200 },
      { month: 'মার্চ', income: 52000, expense: 28000, profit: 24000 },
      { month: 'এপ্রিল', income: 49800, expense: 26500, profit: 23300 },
      { month: 'মে', income: 51200, expense: 24800, profit: 26400 },
      { month: 'জুন', income: 53600, expense: 27200, profit: 26400 }
    ],
    investmentBreakdown: fundData.investmentBreakdown.length > 0 ? fundData.investmentBreakdown : [
      { type: 'ব্যাংক ডিপোজিট', amount: 300000, percentage: 46.2, return: 4.5 },
      { type: 'সরকারি বন্ড', amount: 200000, percentage: 30.8, return: 3.8 },
      { type: 'ব্যবসায়িক বিনিয়োগ', amount: 100000, percentage: 15.4, return: 8.2 },
      { type: 'রিয়েল এস্টেট', amount: 50000, percentage: 7.7, return: 6.5 }
    ]
  };

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
    { id: 'investment', name: 'বিনিয়োগ', color: '#8B5CF6' },
    { id: 'emergency', name: 'জরুরি', color: '#EC4899' }
  ];

  const expenseRecords = [
    {
      id: 1,
      description: 'অফিস ভাড়া',
      amount: 8000,
      date: '০১/০১/২০২ৄ',
      category: 'office',
      invoiceNo: 'INV-001',
      approvedBy: 'সভাপতি',
      status: 'approved',
      priority: 'medium',
      submittedBy: 'ক্যাশিয়ার',
      submittedDate: '৩১/১২/২০২৩',
      approvedDate: '০১/০১/২০২৪',
      paymentMethod: 'bank_transfer',
      vendor: 'বিল্ডিং ওনার',
      notes: 'মাসিক অফিস ভাড়া পেমেন্ট'
    },
    {
      id: 2,
      description: 'কমিউনিটি ইভেন্ট',
      amount: 15000,
      date: '১৫/০১/২০২৪',
      category: 'event',
      invoiceNo: 'INV-002',
      approvedBy: 'সাধারণ সম্পাদক',
      status: 'approved',
      priority: 'high',
      submittedBy: 'ইভেন্ট কমিটি',
      submittedDate: '১০/০১/২০২৪',
      approvedDate: '১২/০১/২০২৪',
      paymentMethod: 'cash',
      vendor: 'ইভেন্ট সাপ্লাইয়ার',
      notes: 'বার্ষিক সাংস্কৃতিক অনুষ্ঠান'
    },
    {
      id: 3,
      description: 'এয়ার কন্ডিশনার মেরামত',
      amount: 3500,
      date: '২০/০১/২০২৪',
      category: 'maintenance',
      invoiceNo: 'INV-003',
      approvedBy: 'সভাপতি',
      status: 'pending',
      priority: 'medium',
      submittedBy: 'অফিস ম্যানেজার',
      submittedDate: '১৮/০১/২০২৪',
      approvedDate: null,
      paymentMethod: 'cash',
      vendor: 'টেক সার্ভিস',
      notes: 'অফিসের এসি মেরামতের জন্য'
    },
    {
      id: 4,
      description: 'বিদ্যুৎ বিল',
      amount: 2800,
      date: '২৫/০১/২০২৪',
      category: 'utility',
      invoiceNo: 'INV-004',
      approvedBy: 'কোষাধ্যক্ষ',
      status: 'approved',
      priority: 'high',
      submittedBy: 'ক্যাশিয়ার',
      submittedDate: '২৩/০১/২০২৪',
      approvedDate: '২৪/০১/২০২৪',
      paymentMethod: 'mobile_banking',
      vendor: 'DESCO',
      notes: 'জানুয়ারি মাসের বিদ্যুৎ বিল'
    },
    {
      id: 5,
      description: 'নতুন প্রজেক্ট বিনিয়োগ',
      amount: 50000,
      date: '৩০/০১/২০২৪',
      category: 'investment',
      invoiceNo: 'INV-005',
      approvedBy: 'সভাপতি',
      status: 'rejected',
      priority: 'low',
      submittedBy: 'বিনিয়োগ কমিটি',
      submittedDate: '২৮/০১/২০২৪',
      approvedDate: null,
      paymentMethod: 'bank_transfer',
      vendor: 'ABC কোম্পানি',
      notes: 'নতুন ব্যবসায়িক প্রকল্পে বিনিয়োগ',
      rejectionReason: 'পর্যাপ্ত তথ্য নেই'
    }
  ];

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

  // Payment method breakdown
  const paymentMethods = [
    { method: 'নগদ', amount: 25000, count: 15, percentage: 55.6 },
    { method: 'ব্যাংক ট্রান্সফার', amount: 12000, count: 8, percentage: 26.7 },
    { method: 'মোবাইল ব্যাংকিং', amount: 8000, count: 5, percentage: 17.8 }
  ];

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
      case 'profit_withdrawal': return 'লাভ উত্তোলন';
      default: return type;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch(method) {
      case 'cash': return 'নগদ';
      case 'bank_transfer': return 'ব্যাংক ট্রান্সফার';
      case 'mobile_banking': return 'মোবাইল ব্যাংকিং';
      default: return method;
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
       totalIncome: 125000,
       totalExpense: 45000,
       netProfit: 80000,
       memberSubscriptions: 85000,
       donations: 25000,
       investments: 15000,
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
         { name: 'দান', value: 25000, color: '#10B981' },
         { name: 'বিনিয়োগ', value: 15000, color: '#8B5CF6' }
       ],
       expenseBreakdown: [
         { name: 'অফিস খরচ', value: 18000, color: '#EF4444' },
         { name: 'ইভেন্ট', value: 15000, color: '#F59E0B' },
         { name: 'ইউটিলিটি', value: 8000, color: '#EC4899' },
         { name: 'রক্ষণাবেক্ষণ', value: 4000, color: '#6B7280' }
       ],
       monthlyComparison: [
         { month: 'নভেম্বর', income: 118000, expense: 42000, profit: 76000 },
         { month: 'ডিসেম্বর', income: 122000, expense: 44000, profit: 78000 },
         { month: 'জানুয়ারি', income: 125000, expense: 45000, profit: 80000 }
       ]
     }
   };

   const currentReportData = monthlyReportData[selectedReportMonth] || monthlyReportData['2024-01'];

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

  // Enhanced transactions data
  const recentTransactions = [
    {
      id: 1,
      memberName: 'মোহাম্মদ রহিম উদ্দিন',
      memberId: 'SM-001',
      type: 'subscription',
      amount: 1200,
      paymentMethod: 'cash',
      status: 'completed',
      time: '10:30 AM',
      date: '2024-01-15',
      description: 'মাসিক চাঁদা - জানুয়ারি ২০২৪',
      reference: 'TXN-001-2024',
      processedBy: 'ক্যাশিয়ার - আহমেদ'
    },
    {
      id: 2,
      memberName: 'ফাতেমা খাতুন',
      memberId: 'SM-002',
      type: 'loan',
      amount: 25000,
      paymentMethod: 'bank',
      status: 'pending',
      time: '11:15 AM',
      date: '2024-01-15',
      description: 'ঋণ গ্রহণ - ব্যবসায়িক প্রয়োজনে',
      reference: 'TXN-002-2024',
      processedBy: 'ম্যানেজার - করিম'
    },
    {
      id: 3,
      memberName: 'আব্দুল কাদের',
      memberId: 'SM-003',
      type: 'loan',
      amount: 3000,
      paymentMethod: 'mobile',
      status: 'completed',
      time: '02:45 PM',
      date: '2024-01-15',
      description: 'ঋণ পরিশোধ - কিস্তি ৩',
      reference: 'TXN-003-2024',
      processedBy: 'ক্যাশিয়ার - আহমেদ'
    },
    {
      id: 4,
      memberName: 'সালমা বেগম',
      memberId: 'SM-004',
      type: 'donation',
      amount: 2000,
      paymentMethod: 'cash',
      status: 'completed',
      time: '09:20 AM',
      date: '2024-01-14',
      description: 'দান - মসজিদ নির্মাণ',
      reference: 'TXN-004-2024',
      processedBy: 'ক্যাশিয়ার - আহমেদ'
    },
    {
      id: 5,
      memberName: 'মোহাম্মদ আলী',
      memberId: 'SM-005',
      type: 'fine',
      amount: 500,
      paymentMethod: 'mobile',
      status: 'completed',
      time: '03:30 PM',
      date: '2024-01-14',
      description: 'জরিমানা - দেরিতে চাঁদা প্রদান',
      reference: 'TXN-005-2024',
      processedBy: 'ক্যাশিয়ার - আহমেদ'
    },
    {
      id: 6,
      memberName: 'রাশিদা খাতুন',
      memberId: 'SM-006',
      type: 'subscription',
      amount: 1200,
      paymentMethod: 'bank',
      status: 'failed',
      time: '04:15 PM',
      date: '2024-01-13',
      description: 'মাসিক চাঁদা - জানুয়ারি ২০২৪',
      reference: 'TXN-006-2024',
      processedBy: 'ক্যাশিয়ার - আহমেদ'
    },
    {
      id: 7,
      memberName: 'আব্দুর রহমান',
      memberId: 'SM-007',
      type: 'subscription',
      amount: 1200,
      paymentMethod: 'card',
      status: 'completed',
      time: '01:45 PM',
      date: '2024-01-13',
      description: 'মাসিক চাঁদা - জানুয়ারি ২০২৪',
      reference: 'TXN-007-2024',
      processedBy: 'ক্যাশিয়ার - আহমেদ'
    },
    {
      id: 8,
      memberName: 'নাসির উদ্দিন',
      memberId: 'SM-008',
      type: 'loan',
      amount: 15000,
      paymentMethod: 'bank',
      status: 'pending',
      time: '10:00 AM',
      date: '2024-01-12',
      description: 'ঋণ গ্রহণ - চিকিৎসা খরচ',
      reference: 'TXN-008-2024',
      processedBy: 'ম্যানেজার - করিম'
    },
    {
      id: 9,
      memberName: 'হাসিনা বেগম',
      memberId: 'SM-009',
      type: 'donation',
      amount: 5000,
      paymentMethod: 'cash',
      status: 'completed',
      time: '11:30 AM',
      date: '2024-01-12',
      description: 'দান - এতিমখানা সহায়তা',
      reference: 'TXN-009-2024',
      processedBy: 'ক্যাশিয়ার - আহমেদ'
    },
    {
      id: 10,
      memberName: 'কামাল হোসেন',
      memberId: 'SM-010',
      type: 'subscription',
      amount: 1200,
      paymentMethod: 'mobile',
      status: 'completed',
      time: '02:15 PM',
      date: '2024-01-11',
      description: 'মাসিক চাঁদা - জানুয়ারি ২০২৪',
      reference: 'TXN-010-2024',
      processedBy: 'ক্যাশিয়ার - আহমেদ'
    },
    {
      id: 11,
      memberName: 'জামিলা খাতুন',
      memberId: 'SM-011',
      type: 'fine',
      amount: 300,
      paymentMethod: 'cash',
      status: 'pending',
      time: '09:45 AM',
      date: '2024-01-11',
      description: 'জরিমানা - সভায় অনুপস্থিতি',
      reference: 'TXN-011-2024',
      processedBy: 'ক্যাশিয়ার - আহমেদ'
    },
    {
      id: 12,
      memberName: 'ইব্রাহিম খলিল',
      memberId: 'SM-012',
      type: 'loan',
      amount: 8000,
      paymentMethod: 'bank',
      status: 'completed',
      time: '03:00 PM',
      date: '2024-01-10',
      description: 'ঋণ পরিশোধ - কিস্তি ৫',
      reference: 'TXN-012-2024',
      processedBy: 'ক্যাশিয়ার - আহমেদ'
    }
  ];

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

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // In a real app, this would trigger data refetch
    console.log('Data refreshed at:', new Date().toLocaleTimeString());
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

  const handleRefreshTransactions = () => {
    console.log('Refreshing transactions...');
    // In a real app, this would reload transaction data from the server
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

  const handleSubmitNewMember = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setMemberFormErrors(errors);
      return;
    }
    
    // Generate member ID
    const memberId = `SM-${String(monthlySummary.totalMembers + 1).padStart(3, '0')}`;
    
    const memberData = {
      ...newMemberData,
      memberId,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'ক্যাশিয়ার - আহমেদ'
    };
    
    console.log('নতুন সদস্য যোগ করা হচ্ছে:', memberData);
    
    // In a real app, this would make an API call to save the member
    alert(`সদস্য সফলভাবে যোগ করা হয়েছে!\nসদস্য আইডি: ${memberId}\nনাম: ${newMemberData.name}`);
    
    // Reset form and close modal
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
    setShowAddMemberModal(false);
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
    <div className="md-dashboard">
      <div className="md-surface-container">
        <div className="md-dashboard-content">
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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
        <div className="dashboard-card">
          <div className="card-header-with-action">
            <h3 className="card-title">
              <DollarSign className="h-5 w-5" />
              মাসিক সারসংক্ষেপ
            </h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={refreshData}
                className="refresh-btn"
                title="ডেটা রিফ্রেশ করুন"
                disabled={loading.initial}
              >
                <RefreshCw className={`h-4 w-4 ${loading.initial ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={() => setShowAddMemberModal(true)}
                className="add-member-btn"
                title="নতুন সদস্য যোগ করুন"
              >
                <UserPlus className="h-4 w-4" />
                নতুন সদস্য
              </button>
            </div>
          </div>
          <div className="simple-monthly-report">
            <div className="report-metric">
              <div className="report-metric-label">মোট সদস্য</div>
              <div className="report-metric-value">
                {loading.members ? <LoadingSkeleton className="w-16" /> : monthlySummary.totalMembers}
              </div>
            </div>
            <div className="report-metric">
              <div className="report-metric-label">মাসিক সংগ্রহ</div>
              <div className="report-metric-value income">
                {loading.transactions ? <LoadingSkeleton className="w-24" /> : `৳ ${monthlySummary.totalCollected.toLocaleString()}`}
              </div>
            </div>
            <div className="report-metric">
              <div className="report-metric-label">মোট ফান্ড</div>
              <div className="report-metric-value profit">
                {loading.fundData ? <LoadingSkeleton className="w-24" /> : `৳ ${fundSummary.totalBalance.toLocaleString()}`}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Card */}
        <div className="dashboard-card">
          <div className="payment-header">
            <h3 className="card-title">
              <Banknote className="h-5 w-5" />
              পেমেন্ট পদ্ধতি
            </h3>
            <button 
              onClick={() => setPaymentMethodSortOrder(paymentMethodSortOrder === 'desc' ? 'asc' : 'desc')}
              className="sort-btn"
              title="পরিমাণ অনুযায়ী সাজান"
            >
              {paymentMethodSortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
            </button>
          </div>
          <div className="simple-payment-methods">
            {loading.fundData ? (
              <>
                <LoadingSkeleton className="h-8 w-full mb-2" />
                <LoadingSkeleton className="h-8 w-full mb-2" />
                <LoadingSkeleton className="h-8 w-full" />
              </>
            ) : (
              sortedPaymentMethods.map((method, index) => (
                <div key={index} className="payment-method-item">
                  <span className="payment-method-name">{method.method}</span>
                  <span className="payment-method-amount">৳ {method.amount.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expense Tracking Card */}
        <div className="dashboard-card">
          <div className="expense-header">
            <h3 className="card-title">
              <Receipt className="h-5 w-5" />
              খরচের রেকর্ড
            </h3>
            <button 
              onClick={handleRefresh}
              className="refresh-btn"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="simple-expense-list">
            {loading.transactions ? (
              <>
                <div className="simple-expense-item">
                  <div className="expense-info">
                    <LoadingSkeleton className="h-4 w-32 mb-1" />
                    <LoadingSkeleton className="h-3 w-20" />
                  </div>
                  <LoadingSkeleton className="h-4 w-16" />
                </div>
                <div className="simple-expense-item">
                  <div className="expense-info">
                    <LoadingSkeleton className="h-4 w-28 mb-1" />
                    <LoadingSkeleton className="h-3 w-20" />
                  </div>
                  <LoadingSkeleton className="h-4 w-16" />
                </div>
                <div className="simple-expense-item">
                  <div className="expense-info">
                    <LoadingSkeleton className="h-4 w-36 mb-1" />
                    <LoadingSkeleton className="h-3 w-20" />
                  </div>
                  <LoadingSkeleton className="h-4 w-16" />
                </div>
              </>
            ) : (
              expenseRecords.slice(0, 3).map((expense) => (
                <div key={expense.id} className="simple-expense-item">
                  <div className="expense-info">
                    <span className="expense-description">{expense.description}</span>
                    <span className="expense-date">{expense.date}</span>
                  </div>
                  <div className="expense-amount">
                    ৳ {expense.amount.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monthly Report Card */}
        <div className="dashboard-card">
          <h3 className="card-title">
            <FileText className="h-5 w-5" />
            মাসিক রিপোর্ট
          </h3>
          <div className="simple-monthly-report">
            <div className="report-metric">
              <span className="report-metric-label">মোট আয়</span>
              {loading.transactions || loading.fundData ? (
                <LoadingSkeleton className="h-5 w-20" />
              ) : (
                <span className="report-metric-value income">৳ {currentReportData.totalIncome.toLocaleString()}</span>
              )}
            </div>
            <div className="report-metric">
              <span className="report-metric-label">মোট ব্যয়</span>
              {loading.transactions || loading.fundData ? (
                <LoadingSkeleton className="h-5 w-20" />
              ) : (
                <span className="report-metric-value expense">৳ {currentReportData.totalExpense.toLocaleString()}</span>
              )}
            </div>
            <div className="report-metric">
              <span className="report-metric-label">নেট লাভ</span>
              {loading.transactions || loading.fundData ? (
                <LoadingSkeleton className="h-5 w-20" />
              ) : (
                <span className="report-metric-value profit">৳ {currentReportData.netProfit.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History Card */}
        <div className="dashboard-card">
          <div className="transaction-header">
            <h3 className="card-title">
              <Activity className="h-5 w-5" />
              সাম্প্রতিক লেনদেন
            </h3>
            <button 
              onClick={handleRefresh}
              className="refresh-btn"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="transaction-search">
            <div className="search-input-wrapper">
              <Search className="h-4 w-4 search-icon" />
              <input
                type="text"
                placeholder="সদস্য বা লেনদেনের ধরন খুঁজুন..."
                value={transactionSearchTerm}
                onChange={(e) => setTransactionSearchTerm(e.target.value)}
                className="search-input"
              />
              {transactionSearchTerm && (
                <button
                  onClick={() => setTransactionSearchTerm('')}
                  className="clear-search-btn"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="simple-transaction-list">
            {loading.transactions ? (
              <>
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="simple-transaction-item">
                    <div className="transaction-main">
                      <div className="transaction-info">
                        <LoadingSkeleton className="h-4 w-24 mb-1" />
                        <LoadingSkeleton className="h-3 w-16" />
                      </div>
                      <LoadingSkeleton className="h-4 w-16" />
                      <LoadingSkeleton className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              searchFilteredTransactions.slice(0, 4).map((transaction) => (
                <div key={transaction.id} className="simple-transaction-item">
                  <div 
                    className="transaction-main"
                    onClick={() => toggleTransactionExpand(transaction.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="transaction-info">
                      <span className="transaction-member">{transaction.memberName}</span>
                      <span className="transaction-type">{getTransactionTypeLabel(transaction.type)}</span>
                    </div>
                    <div className="transaction-amount">
                      ৳ {transaction.amount.toLocaleString()}
                    </div>
                    <div className="expand-indicator">
                      {expandedTransaction === transaction.id ? '−' : '+'}
                    </div>
                  </div>
                
                  {expandedTransaction === transaction.id && (
                    <div className="transaction-details">
                      <div className="detail-row">
                        <span className="detail-label">তারিখ:</span>
                        <span className="detail-value">{transaction.date}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">পেমেন্ট পদ্ধতি:</span>
                        <span className="detail-value">{getPaymentMethodLabel(transaction.paymentMethod)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">রেফারেন্স:</span>
                        <span className="detail-value">{transaction.reference}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">প্রক্রিয়াকারী:</span>
                        <span className="detail-value">{transaction.processedBy}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
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
    </div>
  );
};

export default CashierDashboard;