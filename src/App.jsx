import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import MemberManagement from './components/MemberManagement';
import ShareTracking from './components/ShareTracking';
import InvestmentManagement from './components/InvestmentManagement';
import ProfitDistribution from './components/ProfitDistribution';
import NoticeBoard from './components/NoticeBoard';
import CashierDashboard from './components/CashierDashboard';
import MemberDashboard from './components/MemberDashboard';
import ProfileSettings from './components/ProfileSettings';
import AdminSettings from './components/AdminSettings';
import CashierSettings from './components/CashierSettings';
import MemberSettings from './components/MemberSettings';
import AddTransaction from './components/AddTransaction';
import MemberList from './components/MemberList';
import Layout from './components/Layout';

function App() {
  // Simulating user role - in real app this would come from authentication
  const [userRole, setUserRole] = useState('admin'); // 'admin', 'cashier', 'member'

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Layout userRole={userRole} setUserRole={setUserRole}>
          <Routes>
            {/* Admin Routes */}
            {userRole === 'admin' && (
              <>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/members" element={<MemberManagement />} />
                <Route path="/member-list" element={<MemberList userRole={userRole} />} />
                <Route path="/shares" element={<ShareTracking />} />
                <Route path="/investments" element={<InvestmentManagement />} />
                <Route path="/profit" element={<ProfitDistribution />} />
                <Route path="/notices" element={<NoticeBoard />} />
                <Route path="/admin-settings" element={<AdminSettings />} />
              </>
            )}
            
            {/* Cashier Routes */}
            {userRole === 'cashier' && (
              <>
                <Route path="/" element={<CashierDashboard />} />
                <Route path="/cashier" element={<CashierDashboard />} />
                <Route path="/add-transaction" element={<AddTransaction />} />
                <Route path="/member-list" element={<MemberList userRole={userRole} />} />
                <Route path="/shares" element={<ShareTracking />} />
                <Route path="/notices" element={<NoticeBoard />} />
                <Route path="/cashier-settings" element={<CashierSettings />} />
              </>
            )}
            
            {/* Member Routes */}
            {userRole === 'member' && (
              <>
                <Route path="/" element={<MemberDashboard />} />
                <Route path="/member" element={<MemberDashboard />} />
                <Route path="/member-list" element={<MemberList userRole={userRole} />} />
                <Route path="/shares" element={<ShareTracking />} />
                <Route path="/investments" element={<InvestmentManagement />} />
                <Route path="/notices" element={<NoticeBoard />} />
                <Route path="/member-settings" element={<MemberSettings />} />
              </>
            )}
            
            {/* Redirect old profile route to role-specific settings */}
            <Route path="/profile" element={
              <Navigate 
                to={
                  userRole === 'admin' ? '/admin-settings' :
                  userRole === 'cashier' ? '/cashier-settings' :
                  '/member-settings'
                } 
                replace 
              />
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
