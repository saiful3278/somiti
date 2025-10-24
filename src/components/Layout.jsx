import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNavigation from './common/BottomNavigation';
import Footer from './common/Footer';
import PrimarySearchAppBar from './appbar';
import AddTransaction from './AddTransaction';
import useSidebarLogic from '../hooks/useSidebarLogic';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const location = useLocation();
  const { navigationItems } = useSidebarLogic(user?.role);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content - Full Width */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Material-UI App Bar */}
        <div style={{ margin: 0, padding: 0 }}>
          <PrimarySearchAppBar 
            userRole={user?.role}
            isMobile={isMobile}
          />
        </div>

        {/* Mobile-Optimized Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation 
        userRole={user?.role} 
        onOpenAddTransaction={() => setAddTransactionModalOpen(true)}
      />

      {/* Add Transaction Modal */}
      <AddTransaction 
        isOpen={addTransactionModalOpen}
        onClose={() => setAddTransactionModalOpen(false)}
      />
    </div>
  );
};

export default Layout;