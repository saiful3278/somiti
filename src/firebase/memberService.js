// Firebase service for member management
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
  serverTimestamp, 
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './config.js';

const MEMBERS_COLLECTION = 'members';

// Member service class
export class MemberService {
  
  // Add new member
  static async addMember(memberData, userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required to add a member.');
      }

      const memberRef = doc(db, MEMBERS_COLLECTION, userId);
      await setDoc(memberRef, {
        ...memberData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active'
      });
      
      console.log('Document added successfully with ID:', userId);
      return { success: true, id: userId };
    } catch (error) {
      console.error('সদস্য যোগ করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Get member by ID
  static async getMemberById(userId) {
    try {
      const memberRef = doc(db, MEMBERS_COLLECTION, userId);
      const docSnap = await getDoc(memberRef);

      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Member not found' };
      }
    } catch (error) {
      console.error('Error getting member by ID:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all members
  static async getAllMembers() {
    try {
      const querySnapshot = await getDocs(collection(db, MEMBERS_COLLECTION));
      const members = [];
      querySnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by createdAt in JavaScript instead of Firestore
      members.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
        return dateB - dateA; // Descending order (newest first)
      });
      
      return { success: true, data: members };
    } catch (error) {
      console.error('সদস্য তালিকা লোড করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Get active members
  static async getActiveMembers() {
    try {
      const q = query(
        collection(db, MEMBERS_COLLECTION), 
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      const members = [];
      querySnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by createdAt in JavaScript instead of Firestore
      members.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
        return dateB - dateA; // Descending order (newest first)
      });
      
      return { success: true, data: members };
    } catch (error) {
      console.error('সক্রিয় সদস্য তালিকা আনতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Update member
  static async updateMember(memberId, updateData) {
    try {
      const memberRef = doc(db, MEMBERS_COLLECTION, memberId);
      await updateDoc(memberRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('সদস্য আপডেট করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete member
  static async deleteMember(memberId) {
    try {
      await deleteDoc(doc(db, MEMBERS_COLLECTION, memberId));
      return { success: true };
    } catch (error) {
      console.error('সদস্য মুছতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Toggle member status
  static async toggleMemberStatus(memberId, currentStatus) {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const memberRef = doc(db, MEMBERS_COLLECTION, memberId);
      await updateDoc(memberRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      return { success: true, newStatus };
    } catch (error) {
      console.error('সদস্যের অবস্থা পরিবর্তন করতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Get member by Firebase Auth UID
  static async getMemberByAuthUid(authUid) {
    try {
      const q = query(
        collection(db, MEMBERS_COLLECTION), 
        where('authUid', '==', authUid)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { success: false, error: 'Member not found' };
      }
      
      const doc = querySnapshot.docs[0];
      return { success: true, data: { id: doc.id, ...doc.data() } };
    } catch (error) {
      console.error('Auth UID দিয়ে সদস্য খুঁজতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  // Search members
  static async searchMembers(searchTerm) {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation - for production, consider using Algolia or similar
      const querySnapshot = await getDocs(collection(db, MEMBERS_COLLECTION));
      const members = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.membershipId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.phone?.includes(searchTerm)
        ) {
          members.push({ id: doc.id, ...data });
        }
      });
      return { success: true, data: members };
    } catch (error) {
      console.error('সদস্য খুঁজতে ত্রুটি:', error);
      return { success: false, error: error.message };
    }
  }

  static async isDuplicateMember({ phone, email, name }) {
    try {
      console.log('MemberService: isDuplicateMember input', { phone, email, name });
      if (email) {
        const qEmail = query(collection(db, MEMBERS_COLLECTION), where('email', '==', email));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          const doc = snapEmail.docs[0];
          console.log('MemberService: duplicate by email', { id: doc.id });
          return { exists: true, by: 'email', match: { id: doc.id, ...doc.data() } };
        }
      }
      if (phone) {
        const qPhone = query(collection(db, MEMBERS_COLLECTION), where('phone', '==', phone));
        const snapPhone = await getDocs(qPhone);
        if (!snapPhone.empty) {
          const doc = snapPhone.docs[0];
          console.log('MemberService: duplicate by phone', { id: doc.id });
          return { exists: true, by: 'phone', match: { id: doc.id, ...doc.data() } };
        }
      }
      if (name) {
        const allSnap = await getDocs(collection(db, MEMBERS_COLLECTION));
        const found = allSnap.docs.map(d => ({ id: d.id, ...d.data() })).find(m => (m.name || '').trim() === name.trim());
        if (found) {
          console.log('MemberService: duplicate by name', { id: found.id });
          return { exists: true, by: 'name', match: found };
        }
      }
      console.log('MemberService: no duplicate found');
      return { exists: false };
    } catch (error) {
      console.error('MemberService: duplicate check error', error);
      return { exists: false, error: error.message };
    }
  }
}