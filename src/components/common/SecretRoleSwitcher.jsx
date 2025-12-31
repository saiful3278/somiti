import React, { useState, useEffect } from 'react';
import { X, Shield, User, CreditCard, Settings, ArrowLeft, MessageSquare, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const SecretRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[SecretRoleSwitcher] subscribing to feedbacks');
    const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedbackData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setFeedbacks(feedbackData);
      setLoading(false);
    });

    return () => {
      console.log('[SecretRoleSwitcher] unsubscribe feedbacks');
      unsubscribe();
    };
  }, []);

  const handleDeleteFeedback = async (id) => {
    console.log('[SecretRoleSwitcher] delete feedback', id);
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await deleteDoc(doc(db, 'feedbacks', id));
      toast.success('Feedback deleted');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
    }
  };

  const handleRoleSwitch = (newRole) => {
    console.log('[SecretRoleSwitcher] switch role', newRole);
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
    console.log('[SecretRoleSwitcher] go back');
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-start justify-center p-4 gap-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
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

      {/* Admin Feedback Section */}
      <div className="bg-white rounded-lg shadow-xl p-4 w-full lg:max-w-2xl h-[70vh] lg:h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            User Feedback
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {feedbacks.length}
            </span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading feedback...</div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              No feedback received yet
            </div>
          ) : (
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow relative group">
                <button
                  onClick={() => handleDeleteFeedback(feedback.id)}
                  className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete feedback"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <p className="text-gray-800 whitespace-pre-wrap mb-3 text-sm">{feedback.message}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {feedback.createdAt?.toLocaleString() || 'Unknown date'}
                  </div>
                  {feedback.page && (
                    <div className="px-2 py-0.5 bg-gray-200 rounded text-[10px] font-mono truncate max-w-[150px]">
                      {feedback.page}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretRoleSwitcher;
