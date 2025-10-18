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
  static async getTransactionsByMember(memberId) {
    try {
      const q = query(
        collection(db, TRANSACTIONS_COLLECTION),
        where('memberId', '==', memberId),
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
  
  // Get fund summary
  static async getFundSummary() {
    try {
      const querySnapshot = await getDocs(collection(db, FUND_COLLECTION));
      let fundData = null;
      querySnapshot.forEach((doc) => {
        fundData = { id: doc.id, ...doc.data() };
      });
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