import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './common/Sidebar';
import BottomNavigation from './common/BottomNavigation';
import MobileSidebar from './common/MobileSidebar';
import PrimarySearchAppBar from './appbar';
import AddTransaction from './AddTransaction';
import useSidebarLogic from '../hooks/useSidebarLogic';
import '../styles/components/desktop-sidebar.css';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const location = useLocation();
  const { navigationItems } = useSidebarLogic(user?.role);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <Sidebar 
          userRole={user?.role} 
          isVisible={sidebarVisible}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar 
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        userRole={user?.role}
      />

      {/* Modern Main Content with Optimized Transitions */}
      <div className={`flex-1 flex flex-col overflow-hidden ${
        !isMobile && sidebarVisible 
          ? 'main-content-with-sidebar-visible' 
          : 'main-content-without-sidebar'
      }`}>
        {/* Material-UI App Bar */}
        <div style={{ margin: 0, padding: 0 }}>
          <PrimarySearchAppBar 
            userRole={user?.role}
            sidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
            isMobile={isMobile}
          />
        </div>

        {/* Mobile-Optimized Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
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