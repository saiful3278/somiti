import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Users,
  PieChart,
  TrendingUp,
  Bell,
  Settings,
  DollarSign,
  Plus,
  Table
} from 'lucide-react';

const BottomNavigation = ({ onOpenAddTransaction }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Define navigation items based on user role
  const getNavigationItems = () => {
    console.log('[BottomNavigation] building items for role', user?.role);
    const commonItems = [
      {
        name: 'হোম',
        href: user?.role ? `/${user.role}` : '/',
        icon: Home,
        roles: ['admin', 'cashier', 'member']
      }
    ];

    const roleSpecificItems = {
      admin: [
        { name: 'কোষাগার', href: '/admin/treasury', icon: TrendingUp },
        { name: 'সদস্য', href: '/admin/members', icon: Users },
        { name: 'নোটিশ', href: '/admin/notice-board', icon: Bell },
        { name: 'সেটিংস', href: '/admin/settings', icon: Settings }
      ],
      cashier: [
        { name: 'লেনদেন', href: '/cashier/transactions', icon: DollarSign },
        { name: 'টেবিল', href: '/cashier/unified-finance', icon: Table },
        { name: 'সদস্য', href: '/cashier/members', icon: Users },
        { name: 'সেটিংস', href: '/cashier/settings', icon: Settings }
      ],
      member: [
        { name: 'টেবিল', href: '/member/table', icon: Table },
        { name: 'আর্থিক', href: '/member/financial-summary', icon: PieChart },
        { name: 'নোটিশ', href: '/member/notice-board', icon: Bell },
        { name: 'সদস্য', href: '/member/members', icon: Users },
        { name: 'সেটিংস', href: '/member/settings', icon: Settings }
      ]
    };

    return [...commonItems, ...(roleSpecificItems[user?.role] || roleSpecificItems.member)];
  };

  const navigationItems = getNavigationItems();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white z-30"
      style={{
        borderTop: '1px solid #e5e7eb',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          const isAddTransaction = item.href === '/add-transaction';

          // For Add Transaction, use button instead of Link
          if (isAddTransaction) {
            return (
              <button
                key={item.href}
                onClick={onOpenAddTransaction}
                className="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-0 flex-1 group"
                style={{
                  color: '#6b7280',
                  transform: 'translateY(0)',
                }}
                onTouchStart={(e) => {
                  // Add ripple effect on touch
                  const button = e.currentTarget;
                  const ripple = document.createElement('div');
                  const rect = button.getBoundingClientRect();
                  const size = Math.max(rect.width, rect.height);
                  const x = e.touches[0].clientX - rect.left - size / 2;
                  const y = e.touches[0].clientY - rect.top - size / 2;

                  ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(59, 130, 246, 0.2);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.3s ease-out;
                    pointer-events: none;
                    z-index: 1;
                  `;

                  button.appendChild(ripple);

                  setTimeout(() => {
                    if (ripple.parentNode) {
                      ripple.parentNode.removeChild(ripple);
                    }
                  }, 300);
                }}
              >
                {/* Icon container with background */}
                <div
                  className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 group-hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}
                >
                  <Icon
                    size={20}
                    className="transition-all duration-200"
                    style={{ strokeWidth: 2.5 }}
                  />
                </div>

                {/* Label */}
                <span
                  className="text-xs font-medium mt-1 transition-all duration-200 truncate max-w-full"
                  style={{
                    fontSize: '11px',
                    lineHeight: '1.2'
                  }}
                >
                  {item.name}
                </span>
              </button>
            );
          }

          // For other items, use Link as before
          return (
            <Link
              key={item.href}
              to={item.href}
              className="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-0 flex-1 group"
              style={{
                color: isActive ? '#3b82f6' : '#6b7280',
                transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
              }}
              onTouchStart={(e) => {
                // Add ripple effect on touch
                const button = e.currentTarget;
                const ripple = document.createElement('div');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.touches[0].clientX - rect.left - size / 2;
                const y = e.touches[0].clientY - rect.top - size / 2;

                ripple.style.cssText = `
                  position: absolute;
                  width: ${size}px;
                  height: ${size}px;
                  left: ${x}px;
                  top: ${y}px;
                  background: rgba(59, 130, 246, 0.2);
                  border-radius: 50%;
                  transform: scale(0);
                  animation: ripple 0.3s ease-out;
                  pointer-events: none;
                  z-index: 1;
                `;

                button.appendChild(ripple);

                setTimeout(() => {
                  if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                  }
                }, 300);
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute -top-0.5 w-8 h-1 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: '#3b82f6',
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                  }}
                />
              )}

              {/* Icon container with background */}
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${isActive ? 'scale-110' : 'scale-100'
                  }`}
                style={{
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                }}
              >
                <Icon
                  className="w-5 h-5 transition-all duration-200"
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>

              {/* Label */}
              <span
                className={`text-xs mt-1 font-medium transition-all duration-200 truncate max-w-full ${isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}
                style={{
                  fontSize: '0.7rem',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '-0.01em'
                }}
              >
                {item.name}
              </span>

              {/* Hover effect overlay */}
              <div
                className={`absolute inset-0 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-blue-50 opacity-0'
                    : 'bg-gray-50 opacity-0 group-hover:opacity-100'
                  }`}
                style={{ zIndex: -1 }}
              />
            </Link>
          );
        })}
      </div>

      {/* Add ripple animation styles */}
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        /* Android-style touch feedback */
        .group:active {
          transform: scale(0.95) !important;
        }
        
        /* Smooth transitions for better feel */
        .group {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
      `}</style>
    </nav>
  );
};

export default BottomNavigation;