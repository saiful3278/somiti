import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNavigation from './common/BottomNavigation';
import Footer from './common/Footer';
import PrimarySearchAppBar from './appbar';
import AddTransaction from './AddTransaction';
import useSidebarLogic from '../hooks/useSidebarLogic';
import Meta from './Meta'; // Import the Meta component
import ModeIndicator from './common/ModeIndicator';
import DemoRoleSwitcher from './common/DemoRoleSwitcher';

const Layout = ({ children, title, description, keywords, canonicalUrl, jsonLd }) => {
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
      {console.log('Layout: Toaster mounted')}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Meta
        title={title || 'ফুলমুড়ী যুব ফাউন্ডেশন - Fulmuri Youth Foundation'}
        description={description || 'ফুলমুড়ী যুব ফাউন্ডেশন-এর অফিসিয়াল ওয়েবসাইটে স্বাগতম। আমাদের সম্প্রদায়ের জন্য একটি উন্নত ভবিষ্যৎ গড়তে আমাদের সাথে যোগ দিন।'}
        keywords={keywords || 'ফুলমুড়ী যুব ফাউন্ডেশন, Fulmuri Youth Foundation, Fulmuri, Youth Foundation, Community Development, Fulmuri Gram'}
        canonicalUrl={canonicalUrl || 'https://fulmurigram.site/'}
        jsonLd={jsonLd}
      />
      {/* Main Content - Full Width */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Material-UI App Bar */}
        <div style={{ margin: 0, padding: 0 }}>
          <PrimarySearchAppBar
            userRole={user?.role}
            isMobile={isMobile}
          />
        </div>

        {/* Mode Indicator */}
        <ModeIndicator />

        {/* Demo Role Switcher */}
        <DemoRoleSwitcher />

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