// Firebase service for transaction management
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config.js';

const TRANSACTIONS_COLLECTION = 'transactions';
const EXPENSES_COLLECTION = 'expenses';
const FUND_COLLECTION = 'fund_summary';

// Transaction service class
export class TransactionService {
  
  // Add new transaction
  static async addTransaction(transactionData) {
    try {
      const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
        ...transactionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('লেনদেন যোগ করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Get recent transactions
  static async getRecentTransactions(limitCount = 10) {
    try {
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: transactions };
    } catch (error) {
      console.error('সাম্প্রতিক লেনদেন আনতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Get transactions by member
  static async getTransactionsByUserId(userId) {
    try {
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: transactions };
    } catch (error) {
      console.error('সদস্যের লেনদেন আনতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all transactions
  static async getAllTransactions() {
    try {
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: transactions };
    } catch (error) {
      console.error('সকল লেনদেন আনতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Update transaction status
  static async updateTransactionStatus(transactionId, status) {
    try {
      const transactionRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
      await updateDoc(transactionRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('লেনদেনের অবস্থা আপডেট করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }
}

// Expense service class
export class ExpenseService {
  
  // Add new expense
  static async addExpense(expenseData) {
    try {
      const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
        ...expenseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('খরচ যোগ করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all expenses
  static async getAllExpenses() {
    try {
      const q = query(
        collection(db, EXPENSES_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const expenses = [];
      querySnapshot.forEach((doc) => {
        expenses.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: expenses };
    } catch (error) {
      console.error('খরচের তালিকা আনতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Update expense status
  static async updateExpenseStatus(expenseId, status) {
    try {
      const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
      await updateDoc(expenseRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('খরচের অবস্থা আপডেট করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }
}

// Fund service class
export class FundService {
  
  // Get fund summary with real-time calculation from transactions
  static async getFundSummary() {
    try {
      // Get all transactions for real-time calculation
      const transactionsResult = await TransactionService.getAllTransactions();
      if (!transactionsResult.success) {
        throw new Error('Failed to fetch transactions');
      }
      
      const transactions = transactionsResult.data || [];
      
      // Define income and expense transaction types
      const incomeTypes = ['monthly_deposit', 'share_purchase', 'loan_repayment', 'penalty'];
      const expenseTypes = ['loan_disbursement', 'profit_distribution'];
      
      // Calculate deposits (income transactions)
      const depositTransactions = transactions
        .filter(t => incomeTypes.includes(t.transactionType));
      
      // Calculate withdrawals (expense transactions)
      const withdrawalTransactions = transactions
        .filter(t => expenseTypes.includes(t.transactionType));
      
      const totalDeposits = depositTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalWithdrawals = withdrawalTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalBalance = totalDeposits - totalWithdrawals;
      
      // Calculate monthly deposits for current month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyDeposits = transactions
        .filter(t => {
          if (t.transactionType === 'monthly_deposit' && t.createdAt) {
            const transactionDate = new Date(t.createdAt.seconds * 1000);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
          }
          return false;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      // Get static data from fund_summary collection for other metrics
      const querySnapshot = await getDocs(collection(db, FUND_COLLECTION));
      let staticFundData = {};
      querySnapshot.forEach((doc) => {
        staticFundData = { id: doc.id, ...doc.data() };
      });
      
      // Combine real-time calculations with static data
      const fundData = {
        // Real-time calculated values
        totalBalance,
        totalAmount: totalBalance, // For AdminDashboard compatibility
        totalDeposits,
        totalWithdrawals,
        monthlyDeposits,
        availableCash: totalBalance - (staticFundData.investedAmount || 0),
        
        // Static values from database (or defaults)
        investedAmount: staticFundData.investedAmount || 0,
        monthlyProfit: staticFundData.monthlyProfit || 0,
        monthlyProfits: staticFundData.monthlyProfit || 0, // For AdminDashboard compatibility
        monthlyExpense: staticFundData.monthlyExpense || 0,
        netProfit: (staticFundData.monthlyProfit || 0) - (staticFundData.monthlyExpense || 0),
        profitMargin: staticFundData.profitMargin || 0,
        investmentReturn: staticFundData.investmentReturn || 0,
        
        // Arrays for charts and breakdowns
        cashFlow: staticFundData.cashFlow || [
          { month: 'জানুয়ারি', income: 45600, expense: 23000, profit: 22600 },
          { month: 'ফেব্রুয়ারি', income: 48200, expense: 25000, profit: 23200 },
          { month: 'মার্চ', income: 52000, expense: 28000, profit: 24000 },
          { month: 'এপ্রিল', income: 49800, expense: 26500, profit: 23300 },
          { month: 'মে', income: 51200, expense: 24800, profit: 26400 },
          { month: 'জুন', income: 53600, expense: 27200, profit: 26400 }
        ],
        investmentBreakdown: staticFundData.investmentBreakdown || [
          { type: 'ব্যাংক ডিপোজিট', amount: 300000, percentage: 46.2, return: 4.5 },
          { type: 'সরকারি বন্ড', amount: 200000, percentage: 30.8, return: 3.8 },
          { type: 'ব্যবসায়িক বিনিয়োগ', amount: 100000, percentage: 15.4, return: 8.2 },
          { type: 'রিয়েল এস্টেট', amount: 50000, percentage: 7.7, return: 6.5 }
        ]
      };
      
      return { success: true, data: fundData };
    } catch (error) {
      console.error('তহবিলের সারসংক্ষেপ আনতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Update fund summary
  static async updateFundSummary(fundData) {
    try {
      // For simplicity, we'll assume there's only one fund summary document
      const querySnapshot = await getDocs(collection(db, FUND_COLLECTION));
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...fundData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, FUND_COLLECTION), {
          ...fundData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      return { success: true };
    } catch (error) {
      console.error('তহবিলের সারসংক্ষেপ আপডেট করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }
}