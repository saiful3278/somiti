import React, { useState, useEffect } from 'react';
import { X, Shield, User, CreditCard, Settings, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SecretRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole) => {
    // Create a debug user object for role switching
    const debugUser = {
      uid: 'debug-user',
      email: 'debug@somiti.com',
      role: newRole,
      name: `Debug ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`,
      isDebugUser: true
    };
    
    // Set the debug user in localStorage and context
    localStorage.setItem('somiti_token', 'debug-token');
    localStorage.setItem('somiti_uid', 'debug-user');
    localStorage.setItem('somiti_role', newRole);
    
    // Manually update the auth context
    alert(`Debug role activated: ${newRole}`);
    
    // Navigate to the appropriate dashboard
    const roleRoutes = {
      admin: '/admin',
      cashier: '/cashier',
      member: '/member'
    };
    
    // Use window.location to ensure proper navigation
    window.location.hash = `#${roleRoutes[newRole] || '/member'}`;
    window.location.reload(); // Reload to ensure auth context picks up the changes
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-90vw">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            Secret Role Switcher
          </h2>
          <button
            onClick={handleGoBack}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Role switching interface - no password required */}
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Current Role: <span className="font-semibold text-blue-600">{user?.role}</span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Switch to:</h3>
            
            <button
              onClick={() => handleRoleSwitch('admin')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              disabled={user?.role === 'admin'}
            >
              <Settings className="w-5 h-5 text-red-500" />
              <span>Admin</span>
              {user?.role === 'admin' && (
                <span className="ml-auto text-xs text-green-600">Current</span>
              )}
            </button>

            <button
              onClick={() => handleRoleSwitch('cashier')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              disabled={user?.role === 'cashier'}
            >
              <CreditCard className="w-5 h-5 text-blue-500" />
              <span>Cashier</span>
              {user?.role === 'cashier' && (
                <span className="ml-auto text-xs text-green-600">Current</span>
              )}
            </button>

            <button
              onClick={() => handleRoleSwitch('member')}
              className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              disabled={user?.role === 'member'}
            >
              <User className="w-5 h-5 text-green-500" />
              <span>Member</span>
              {user?.role === 'member' && (
                <span className="ml-auto text-xs text-green-600">Current</span>
              )}
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-4 p-2 bg-gray-50 rounded">
            <strong>Note:</strong> This is a debug tool for development testing. 
            Role changes are temporary and will reset on page refresh.
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          Access URL: /secret3278
        </div>
      </div>
    </div>
  );
};

export default SecretRoleSwitcher;