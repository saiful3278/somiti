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
                <Route path="/shares" element={<ShareTracking />} />
                <Route path="/investments" element={<InvestmentManagement />} />
                <Route path="/profits" element={<ProfitDistribution />} />
                <Route path="/notices" element={<NoticeBoard />} />
                <Route path="/profile" element={<ProfileSettings />} />
              </>
            )}
            
            {/* Cashier Routes */}
            {userRole === 'cashier' && (
              <>
                <Route path="/" element={<CashierDashboard />} />
                <Route path="/cashier" element={<CashierDashboard />} />
                <Route path="/shares" element={<ShareTracking />} />
                <Route path="/notices" element={<NoticeBoard />} />
                <Route path="/profile" element={<ProfileSettings />} />
              </>
            )}
            
            {/* Member Routes */}
            {userRole === 'member' && (
              <>
                <Route path="/" element={<MemberDashboard />} />
                <Route path="/member" element={<MemberDashboard />} />
                <Route path="/notices" element={<NoticeBoard />} />
                <Route path="/profile" element={<ProfileSettings />} />
              </>
            )}
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
