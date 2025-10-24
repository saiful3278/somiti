import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X,
  Home,
  Users,
  PieChart,
  TrendingUp,
  Bell,
  User,
  Settings,
  DollarSign,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/mobile-sidebar.css';

const MobileSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  // Define navigation items based on user role with better organization
  const getNavigationItems = () => {
    const roleSpecificItems = {
      admin: [
        { 
          name: 'ড্যাশবোর্ড', 
          href: '/', 
          icon: Home, 
          section: 'main'
        },
        { 
          name: 'শেয়ার ট্র্যাকিং', 
          href: '/shares', 
          icon: PieChart, 
          section: 'financial'
        },
        { 
          name: 'বিনিয়োগ ব্যবস্থাপনা', 
          href: '/investments', 
          icon: TrendingUp, 
          section: 'financial'
        },
        { 
          name: 'লাভ বিতরণ', 
          href: '/profit', 
          icon: DollarSign, 
          section: 'financial'
        },
        { 
          name: 'নোটিশ বোর্ড', 
          href: '/notices', 
          icon: Bell, 
          section: 'communication'
        },
        { 
          name: 'প্রোফাইল সেটিংস', 
          href: '/admin/settings', 
          icon: Settings, 
          section: 'settings'
        }
      ],
      cashier: [
        { 
          name: 'ক্যাশিয়ার ড্যাশবোর্ড', 
          href: '/cashier', 
          icon: Home, 
          section: 'main'
        },
        { 
          name: 'শেয়ার ট্র্যাকিং', 
          href: '/shares', 
          icon: PieChart, 
          section: 'financial'
        },
        { 
          name: 'নোটিশ বোর্ড', 
          href: '/notices', 
          icon: Bell, 
          section: 'communication'
        },
        { 
          name: 'প্রোফাইল সেটিংস', 
          href: '/cashier-settings', 
          icon: Settings, 
          section: 'settings'
        }
      ],
      member: [
        { 
          name: 'সদস্য ড্যাশবোর্ড', 
          href: '/member', 
          icon: Home, 
          section: 'main'
        },
        { 
          name: 'আমার শেয়ার', 
          href: '/shares', 
          icon: PieChart, 
          section: 'financial'
        },
        { 
          name: 'নোটিশ বোর্ড', 
          href: '/notices', 
          icon: Bell, 
          section: 'communication'
        },
        { 
          name: 'প্রোফাইল সেটিংস', 
          href: '/member-settings', 
          icon: Settings, 
          section: 'settings'
        }
      ]
    };

    return roleSpecificItems[user?.role] || roleSpecificItems.member;
  };

  const navigationItems = getNavigationItems();

  // Handle swipe to close with spring physics
  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    currentXRef.current = e.touches[0].clientX;
    const diff = startXRef.current - currentXRef.current;
    
    if (diff > 0 && sidebarRef.current) {
      const translateX = Math.min(diff, 240);
      const resistance = Math.max(0, 1 - (diff / 240) * 0.3);
      sidebarRef.current.style.transform = `translateX(-${translateX * resistance}px)`;
      sidebarRef.current.style.opacity = Math.max(0.3, 1 - (diff / 240) * 0.7);
    }
  };

  const handleTouchEnd = (e) => {
    const diff = startXRef.current - currentXRef.current;
    
    if (diff > 80) {
      // Smooth close animation
      if (sidebarRef.current) {
        sidebarRef.current.style.transition = 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        sidebarRef.current.style.transform = 'translateX(-100%)';
        sidebarRef.current.style.opacity = '0';
        setTimeout(onClose, 200);
      }
    } else if (sidebarRef.current) {
      // Smooth spring back
      sidebarRef.current.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      sidebarRef.current.style.transform = 'translateX(0)';
      sidebarRef.current.style.opacity = '1';
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Enhanced Glassmorphism Backdrop */}
      <div 
        className="mobile-sidebar-backdrop"
        onClick={onClose}
      />

      {/* Enhanced Minimized Sidebar */}
      <div
        ref={sidebarRef}
        className="mobile-sidebar-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Enhanced Header */}
        <div className="mobile-sidebar-header flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <div className="mobile-sidebar-avatar w-8 h-8 rounded-xl flex items-center justify-center mr-3">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {user?.role === 'admin' ? 'প্রশাসক' :
                user?.role === 'cashier' ? 'ক্যাশিয়ার' : 'সদস্য'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mobile-sidebar-close p-2 rounded-xl"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Enhanced Navigation */}
        <nav className="mobile-sidebar-nav flex-1 overflow-y-auto py-2">
          <div className="px-2">
            {(() => {
              const groupedItems = navigationItems.reduce((acc, item) => {
                if (!acc[item.section]) {
                  acc[item.section] = [];
                }
                acc[item.section].push(item);
                return acc;
              }, {});

              const sectionTitles = {
                main: 'প্রধান',
                management: 'ব্যবস্থাপনা',
                financial: 'আর্থিক',
                communication: 'যোগাযোগ',
                settings: 'সেটিংস'
              };

              return Object.entries(groupedItems).map(([section, items], sectionIndex) => (
                <div key={section} className={sectionIndex > 0 ? 'mt-4' : ''}>
                  {/* Enhanced Section Header */}
                  <div className="mobile-sidebar-section-header px-3 py-1 mb-1">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {sectionTitles[section]}
                    </h3>
                  </div>
                  
                  {/* Enhanced Section Items */}
                  <ul className="space-y-1">
                    {items.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      
                      return (
                        <li key={item.href} className={`mobile-sidebar-nav-item ${isActive ? 'active' : ''}`}>
                          <Link
                            to={item.href}
                            onClick={onClose}
                            className={`
                              group flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 touch-manipulation
                              ${isActive 
                                ? 'text-blue-700 shadow-sm' 
                                : 'text-gray-700 hover:bg-white/60 active:bg-white/80'
                              }
                            `}
                            style={isActive ? {
                              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.05))',
                              borderLeft: '3px solid #3b82f6'
                            } : {}}
                          >
                            <div 
                              className={`
                                mobile-sidebar-icon w-8 h-8 rounded-lg flex items-center justify-center mr-3
                                ${isActive ? 'active text-white' : 'text-gray-600 group-hover:text-gray-700'}
                              `}
                              style={isActive ? {} : {
                                backgroundColor: 'rgba(243, 244, 246, 0.8)'
                              }}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className={`font-medium text-sm ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                              {item.name}
                            </span>
                            {isActive && (
                              <ChevronRight 
                                className="w-4 h-4 ml-auto flex-shrink-0" 
                                style={{ color: '#3b82f6' }}
                              />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ));
            })()}
          </div>
        </nav>

        {/* Enhanced Bottom Section */}
        <div 
          className="p-4 border-t"
          style={{ 
            borderTopColor: 'rgba(255, 255, 255, 0.2)',
            background: 'rgba(248, 250, 252, 0.8)'
          }}
        >
          {/* Enhanced Logout Button */}
          <button 
            className="mobile-sidebar-logout flex items-center justify-center w-full p-3 rounded-xl font-medium text-sm touch-manipulation"
            style={{
              color: '#dc2626',
              background: 'rgba(254, 242, 242, 0.8)',
              border: '1px solid rgba(254, 202, 202, 0.5)'
            }}
            onClick={async () => {
              try {
                await logout();
                onClose();
              } catch (error) {
                console.error('Logout failed:', error);
                onClose();
              }
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>লগ আউট</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;