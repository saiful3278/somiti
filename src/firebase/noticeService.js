// Firebase service for notice management
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
  serverTimestamp,
  getDoc,
  increment
} from 'firebase/firestore';
import { db } from './config.js';

const NOTICES_COLLECTION = 'notices';

// Notice service class
export class NoticeService {
  
  // Add new notice
  static async addNotice(noticeData) {
    try {
      const docRef = await addDoc(collection(db, NOTICES_COLLECTION), {
        ...noticeData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishDate: new Date().toISOString().split('T')[0],
        views: 0,
        status: noticeData.status || 'active'
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('নোটিশ যোগ করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all notices
  static async getAllNotices() {
    try {
      const q = query(
        collection(db, NOTICES_COLLECTION),
        orderBy('isPinned', 'desc'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const notices = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notices.push({ 
          id: doc.id, 
          ...data,
          // Convert Firestore timestamp to date string if needed
          publishDate: data.publishDate || new Date().toISOString().split('T')[0],
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        });
      });
      return { success: true, data: notices };
    } catch (error) {
      console.error('নোটিশ লোড করতে ত্রুটি:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  // Get notices by category
  static async getNoticesByCategory(category) {
    try {
      const q = query(
        collection(db, NOTICES_COLLECTION),
        where('category', '==', category),
        orderBy('isPinned', 'desc'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const notices = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notices.push({ 
          id: doc.id, 
          ...data,
          publishDate: data.publishDate || new Date().toISOString().split('T')[0],
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        });
      });
      return { success: true, data: notices };
    } catch (error) {
      console.error('ক্যাটেগরি অনুযায়ী নোটিশ লোড করতে ত্রুটি:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  // Get notices by priority
  static async getNoticesByPriority(priority) {
    try {
      const q = query(
        collection(db, NOTICES_COLLECTION),
        where('priority', '==', priority),
        orderBy('isPinned', 'desc'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const notices = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notices.push({ 
          id: doc.id, 
          ...data,
          publishDate: data.publishDate || new Date().toISOString().split('T')[0],
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        });
      });
      return { success: true, data: notices };
    } catch (error) {
      console.error('অগ্রাধিকার অনুযায়ী নোটিশ লোড করতে ত্রুটি:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  // Get active notices
  static async getActiveNotices() {
    try {
      const q = query(
        collection(db, NOTICES_COLLECTION),
        where('status', '==', 'active'),
        orderBy('isPinned', 'desc'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const notices = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notices.push({ 
          id: doc.id, 
          ...data,
          publishDate: data.publishDate || new Date().toISOString().split('T')[0],
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        });
      });
      return { success: true, data: notices };
    } catch (error) {
      console.error('সক্রিয় নোটিশ লোড করতে ত্রুটি:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  // Get pinned notices
  static async getPinnedNotices() {
    try {
      const q = query(
        collection(db, NOTICES_COLLECTION),
        where('isPinned', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const notices = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notices.push({ 
          id: doc.id, 
          ...data,
          publishDate: data.publishDate || new Date().toISOString().split('T')[0],
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        });
      });
      return { success: true, data: notices };
    } catch (error) {
      console.error('পিন করা নোটিশ লোড করতে ত্রুটি:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  // Get notice by ID
  static async getNoticeById(noticeId) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      const docSnap = await getDoc(noticeRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
          success: true, 
          data: { 
            id: docSnap.id, 
            ...data,
            publishDate: data.publishDate || new Date().toISOString().split('T')[0],
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          } 
        };
      } else {
        return { success: false, error: 'নোটিশ পাওয়া যায়নি' };
      }
    } catch (error) {
      console.error('নোটিশ লোড করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Update notice
  static async updateNotice(noticeId, updateData) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      await updateDoc(noticeRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('নোটিশ আপডেট করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete notice
  static async deleteNotice(noticeId) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      await deleteDoc(noticeRef);
      return { success: true };
    } catch (error) {
      console.error('নোটিশ মুছতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Increment view count
  static async incrementViews(noticeId) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      await updateDoc(noticeRef, {
        views: increment(1),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('ভিউ কাউন্ট আপডেট করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Toggle pin status
  static async togglePin(noticeId, isPinned) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      await updateDoc(noticeRef, {
        isPinned: !isPinned,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('পিন স্ট্যাটাস পরিবর্তন করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Update notice status
  static async updateStatus(noticeId, status) {
    try {
      const noticeRef = doc(db, NOTICES_COLLECTION, noticeId);
      await updateDoc(noticeRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('নোটিশ স্ট্যাটাস আপডেট করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Search notices
  static async searchNotices(searchTerm) {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation that gets all notices and filters client-side
      const allNoticesResult = await this.getAllNotices();
      if (!allNoticesResult.success) {
        return allNoticesResult;
      }

      const filteredNotices = allNoticesResult.data.filter(notice => 
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return { success: true, data: filteredNotices };
    } catch (error) {
      console.error('নোটিশ খুঁজতে ত্রুটি:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  // Get notices statistics
  static async getNoticesStats() {
    try {
      const allNoticesResult = await this.getAllNotices();
      if (!allNoticesResult.success) {
        return { success: false, error: allNoticesResult.error };
      }

      const notices = allNoticesResult.data;
      const stats = {
        total: notices.length,
        active: notices.filter(n => n.status === 'active').length,
        pinned: notices.filter(n => n.isPinned).length,
        expiring: notices.filter(n => this.isExpiringSoon(n.expiryDate)).length
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('নোটিশ পরিসংখ্যান লোড করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper function to check if notice is expiring soon
  static isExpiringSoon(expiryDate) {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }
}

export default NoticeService;