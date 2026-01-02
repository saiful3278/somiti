import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MemberService } from '../firebase/memberService';
import { useAuth } from './AuthContext'; // Import useAuth

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: authUser } = useAuth(); // Get authenticated user
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For demo purposes, we'll simulate user login
  // In a real app, this would be connected to Firebase Auth
  const [selectedUserId, setSelectedUserId] = useState(null); // Default user ID

  // Align selected user id both for login and refresh (uid or id)
  useEffect(() => {
    if (authUser) {
      const resolvedId = authUser.uid || authUser.id;
      console.log('[UserContext] Resolved selectedUserId from authUser:', resolvedId);
      if (resolvedId) {
        setSelectedUserId(resolvedId);
      }
    }
  }, [authUser]);

  const loadCurrentUser = useCallback(async () => {
    if (!selectedUserId) {
      console.log('[UserContext] loadCurrentUser skipped: no selectedUserId');
      return;
    }

    // Check if this is a demo or debug user - don't fetch from Firebase
    if (authUser?.isDemoUser || authUser?.isDebugUser || selectedUserId === 'demo-user' || selectedUserId === 'debug-user') {
      console.log('[UserContext] Skipping Firebase load for demo/debug user, using authUser directly');
      setCurrentUser(authUser);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('[UserContext] Loading current user from members with id:', selectedUserId);

      const result = await MemberService.getAllMembers();
      if (result.success && result.data.length > 0) {
        // Find user by ID or use first member as fallback
        let user = result.data.find(member =>
          member.id === selectedUserId ||
          member.membershipId === selectedUserId ||
          member.memberId === selectedUserId ||
          member.somiti_user_id === selectedUserId
        );

        if (!user) {
          user = result.data[0]; // Fallback to first member
        }

        console.log('[UserContext] Loaded user.photoURL', user.photoURL);
        setCurrentUser({
          id: user.id || user.membershipId || 'SM-001',
          uid: user.id || user.membershipId || 'SM-001',
          name: user.name || 'অজানা সদস্য',
          joinDate: user.joinDate || '২০২২-০১-১৫',
          phone: user.phone || 'ফোন নম্বর নেই',
          address: user.address || 'ঠিকানা নেই',
          membershipType: user.membershipType || 'নিয়মিত সদস্য',
          status: user.status || 'সক্রিয়',
          shareCount: user.shareCount || 0,
          totalShares: user.totalShares || 0,
          email: user.email || '',
          fatherName: user.fatherName || '',
          occupation: user.occupation || '',
          nid: user.nid || '',
          emergencyContact: user.emergencyContact || '',
          monthlyDeposit: user.monthlyDeposit || 0,
          totalDeposit: user.totalDeposit || 0,
          photoURL: user.photoURL || ''
        });
      } else {
        setError('কোনো সদস্যের তথ্য পাওয়া যায়নি');
      }
    } catch (err) {
      console.error('ব্যবহারকারীর তথ্য লোড করতে ত্রুটি:', err);
      setError('ব্যবহারকারীর তথ্য লোড করতে ত্রুটি হয়েছে');
    } finally {
      setLoading(false);
      console.log('[UserContext] loadCurrentUser finished, loading set to false');
    }
  }, [selectedUserId, authUser]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  // Function to simulate user switching (for demo)
  const switchUser = (userId) => {
    setSelectedUserId(userId);
  };

  // Function to refresh current user data
  const refreshUser = () => {
    loadCurrentUser();
  };

  const value = {
    currentUser,
    loading,
    error,
    switchUser,
    refreshUser,
    selectedUserId
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};