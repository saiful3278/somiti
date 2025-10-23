import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useSidebarLogic from '../../hooks/useSidebarLogic';
import '../../styles/components/desktop-sidebar.css';

const Sidebar = ({ isVisible = true }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { navigationItems, roleNames } = useSidebarLogic(user?.role);

  return (
    <div className={`desktop-sidebar w-72 bg-white/98 backdrop-blur-xl border-r border-gray-200 shadow-xl ${isVisible ? 'visible' : 'hidden'}`}>
      
      {/* Modern Logo and Title */}
      <div className="flex items-center h-20 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="flex items-center desktop-sidebar-logo">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <PiggyBank className="h-6 w-6" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold">সমিতি ম্যানেজার</h1>
            <p className="text-xs text-primary-100 opacity-90">ডিজিটাল ব্যাংকিং</p>
          </div>
        </div>
      </div>

      {/* Modern Navigation */}
      <nav className="mt-6 px-4 space-y-1">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`desktop-sidebar-nav-item group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl ${
                    isActive
                      ? 'active bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <div className={`desktop-sidebar-icon p-1.5 rounded-lg ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'group-hover:bg-primary-50'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="ml-3 font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>


    </div>
  );
};

export default Sidebar;