import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './components/AdminDashboard';
import MemberList from './components/MemberList';
import InvestmentManagement from './components/InvestmentManagement';
import ProfitDistribution from './components/ProfitDistribution';
import AdminSettings from './components/AdminSettings';
import CashierDashboard from './components/CashierDashboard';
import Transactions from './components/Transactions';
import Treasury from './components/Treasury';
import AddTransaction from './components/AddTransaction';
import AddTransactionPage from './pages/AddTransactionPage';
import CashierSettings from './components/CashierSettings';
import MemberDashboard from './components/MemberDashboard';
import ShareTracking from './components/ShareTracking';
import FinancialSummary from './components/FinancialSummary';
import NoticeBoard from './components/NoticeBoard';
import ProfileSettings from './components/ProfileSettings';
import MemberSettings from './components/MemberSettings';
import SecretRoleSwitcher from './components/common/SecretRoleSwitcher';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Debug route - only available in development */}
            {import.meta.env.DEV && <Route path="/secret3278" element={<SecretRoleSwitcher />} />}
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              }
            />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

const MainApp = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Routes>
        {/* Redirect based on role */}
        <Route path="/" element={<Navigate to={user ? `/${user.role}` : '/'} replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/members" element={<ProtectedRoute allowedRoles={['admin']}><MemberList /></ProtectedRoute>} />
        <Route path="/admin/treasury" element={<ProtectedRoute allowedRoles={['admin']}><Treasury /></ProtectedRoute>} />
        <Route path="/admin/notice-board" element={<ProtectedRoute allowedRoles={['admin']}><NoticeBoard /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/investments" element={<ProtectedRoute allowedRoles={['admin']}><InvestmentManagement /></ProtectedRoute>} />
        <Route path="/admin/profit-distribution" element={<ProtectedRoute allowedRoles={['admin']}><ProfitDistribution /></ProtectedRoute>} />
        <Route path="/admin/share-tracking" element={<ProtectedRoute allowedRoles={['admin']}><ShareTracking /></ProtectedRoute>} />
        <Route path="/add-transaction" element={<ProtectedRoute allowedRoles={['admin', 'cashier']}><AddTransactionPage /></ProtectedRoute>} />

        {/* Cashier Routes */}
        <Route path="/cashier" element={<ProtectedRoute allowedRoles={['cashier']}><CashierDashboard /></ProtectedRoute>} />
        <Route path="/cashier/transactions" element={<ProtectedRoute allowedRoles={['cashier']}><Transactions /></ProtectedRoute>} />
        <Route path="/cashier/treasury" element={<ProtectedRoute allowedRoles={['cashier']}><Treasury /></ProtectedRoute>} />
        <Route path="/cashier/add-transaction" element={<ProtectedRoute allowedRoles={['cashier']}><AddTransactionPage /></ProtectedRoute>} />
        <Route path="/cashier/members" element={<ProtectedRoute allowedRoles={['cashier']}><MemberList /></ProtectedRoute>} />
        <Route path="/cashier/settings" element={<ProtectedRoute allowedRoles={['cashier']}><CashierSettings /></ProtectedRoute>} />

        {/* Member Routes */}
        <Route path="/member" element={<ProtectedRoute allowedRoles={['member', 'admin', 'cashier']}><MemberDashboard /></ProtectedRoute>} />
        <Route path="/member/financial-summary" element={<ProtectedRoute allowedRoles={['member', 'admin', 'cashier']}><FinancialSummary /></ProtectedRoute>} />
        <Route path="/member/notice-board" element={<ProtectedRoute allowedRoles={['member', 'admin', 'cashier']}><NoticeBoard /></ProtectedRoute>} />
        <Route path="/member/members" element={<ProtectedRoute allowedRoles={['member', 'admin', 'cashier']}><MemberList /></ProtectedRoute>} />
        <Route path="/member/profile" element={<ProtectedRoute allowedRoles={['member', 'admin', 'cashier']}><ProfileSettings /></ProtectedRoute>} />
        <Route path="/member/settings" element={<ProtectedRoute allowedRoles={['member', 'admin', 'cashier']}><MemberSettings /></ProtectedRoute>} />

        {/* Secret Debug Route */}
        {/* Route moved to main App component for public access */}

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
