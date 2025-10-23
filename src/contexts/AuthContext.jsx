import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemberService } from '../firebase/memberService';

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
    const autoLogin = async () => {
      const token = localStorage.getItem('somiti_token');
      const userId = localStorage.getItem('somiti_uid');
      const savedRole = localStorage.getItem('somiti_role');

      if (token && userId) {
        try {
          const memberResponse = await MemberService.getMemberById(userId);
          if (memberResponse.success) {
            // Set user with saved role or default to 'member'
            setUser({
              ...memberResponse.data,
              role: savedRole || 'member'
            });
          } else {
            throw new Error('Failed to fetch member data');
          }
        } catch (err) {
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
      }
      setLoading(false);
    };

    autoLogin();
  }, []);

  const login = async (token, userId) => {
    try {
      const memberResponse = await MemberService.getMemberById(userId);
      if (memberResponse.success) {
        const userData = memberResponse.data;
        const userWithId = { ...userData, id: userId };
        setUser(userWithId);
        localStorage.setItem('somiti_token', token);
        localStorage.setItem('somiti_uid', userId);
        // Save the user's role to localStorage for persistence
        localStorage.setItem('somiti_role', userData.role || 'member');
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
      
      // Navigate to the appropriate dashboard based on role
      const roleRoutes = {
        admin: '/admin',
        cashier: '/cashier',
        member: '/member'
      };
      
      // Use window.location to navigate since we can't use useNavigate hook here
      window.location.hash = `#${roleRoutes[newRole] || '/member'}`;
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