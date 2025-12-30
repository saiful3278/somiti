import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemberService } from '../firebase/memberService';
import { recordLogin } from '../firebase/loginHistoryService';

// Console log for file load (per workspace rule)
console.log('[AuthContext] File loaded');

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // SSR Check: ensure window is defined
    if (typeof window === 'undefined') return;

    const autoLogin = async () => {
      console.log('[AuthContext] autoLogin start'); // Debug log
      const token = localStorage.getItem('somiti_token');
      const userId = localStorage.getItem('somiti_uid');
      const savedRole = localStorage.getItem('somiti_role');

      if (token && userId) {
        try {
          // Check if this is a debug user
          if (userId === 'debug-user' && token === 'debug-token') {
            // Create debug user from localStorage
            setUser({
              uid: 'debug-user',
              email: 'debug@somiti.com',
              role: savedRole || 'member',
              name: `Debug ${(savedRole || 'member').charAt(0).toUpperCase() + (savedRole || 'member').slice(1)}`,
              isDebugUser: true,
              membershipType: 'Debug User',
              joinDate: new Date(),
              shareCount: 0,
              totalInvestment: 0
            });
            console.log('[AuthContext] Debug user restored from localStorage');
          } else {
            // Regular user authentication
            const memberResponse = await MemberService.getMemberById(userId);
            if (memberResponse.success) {
              // Set user with saved role or default to 'member'
              const restoredUser = {
                ...memberResponse.data,
                // Ensure consistent shape across login and autoLogin
                id: userId,
                uid: userId,
                role: savedRole || memberResponse.data.role || 'member'
              };
              setUser(restoredUser);
              console.log('[AuthContext] User restored on refresh:', restoredUser);
            } else {
              throw new Error('Failed to fetch member data');
            }
          }
        } catch (err) {
          console.error('[AuthContext] autoLogin error, performing logout:', err);
          logout();
        }
      } else {
        // For demo purposes, create a default user if no token exists
        /*
        const defaultUser = {
          id: 'demo-user',
          name: 'ডেমো ব্যবহারকারী',
          role: savedRole || 'member',
          membershipType: 'নিয়মিত সদস্য',
          joinDate: new Date(),
          shareCount: 10,
          totalShares: 10
        };
        setUser(defaultUser);
        */
        console.log('[AuthContext] No token found in localStorage');
      }
      setLoading(false);
      console.log('[AuthContext] autoLogin finished, loading set to false');
    };

    autoLogin();
  }, []);

  const login = async (token, userId) => {
    try {
      console.log('[AuthContext] login start for userId:', userId);
      const memberResponse = await MemberService.getMemberById(userId);
      if (memberResponse.success) {
        const userData = memberResponse.data;
        const userWithId = { ...userData, id: userId, uid: userId }; // Add uid here
        setUser(userWithId);
        localStorage.setItem('somiti_token', token);
        localStorage.setItem('somiti_uid', userId);
        // Save the user's role to localStorage for persistence
        localStorage.setItem('somiti_role', userData.role || 'member');
        console.log('[AuthContext] login success, user set:', userWithId);
        try {
          await recordLogin(userId, 'local')
        } catch (e) {
          console.log('[AuthContext] login-history invocation failed')
        }
        return { user: userWithId }; // Return user data
      } else {
        throw new Error('User data not found in Firestore');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message);
      return { error }; // Return error
    }
  };

  const logout = () => {
    console.log('[AuthContext] logout called');
    setUser(null);
    localStorage.removeItem('somiti_token');
    localStorage.removeItem('somiti_uid');
    localStorage.removeItem('somiti_role');
  };

  const switchRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('somiti_role', newRole);
      console.log('[AuthContext] switchRole ->', newRole);

      // Navigate to the appropriate dashboard based on role
      const roleRoutes = {
        admin: '/admin',
        cashier: '/cashier',
        member: '/member'
      };

      // Use window.location to navigate since we can't use useNavigate hook here
      if (typeof window !== 'undefined') {
        window.location.hash = `#${roleRoutes[newRole] || '/member'}`;
      }
    }
  };

  const isAuthenticated = () => !!user;

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    switchRole,
    isAuthenticated,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};