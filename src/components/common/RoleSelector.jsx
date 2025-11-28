import React, { useState } from 'react';
import { ChevronDown, User, Shield, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const RoleSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const roles = [
    {
      value: 'admin',
      label: 'অ্যাডমিন',
      icon: Shield,
      color: '#dc2626'
    },
    {
      value: 'cashier',
      label: 'ক্যাশিয়ার',
      icon: DollarSign,
      color: '#059669'
    },
    {
      value: 'member',
      label: 'সদস্য',
      icon: User,
      color: '#2563eb'
    }
  ];

  const currentRole = roles.find(role => role.value === user?.role);
  const CurrentIcon = currentRole?.icon || User;

  const handleRoleChange = (newRole) => {
    // Role switching is now handled by the authentication system
    // This component is now read-only for display purposes
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md min-w-[120px] justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center gap-2">
          <CurrentIcon 
            size={16} 
            style={{ color: currentRole?.color }}
          />
          <span className="text-sm font-medium text-gray-700">
            {currentRole?.label}
          </span>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0"
            style={{ zIndex: 9998 }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div 
            className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden"
            style={{ zIndex: 9999 }}
          >
            {roles.map((role) => {
              const RoleIcon = role.icon;
              const isSelected = role.value === userRole;
              
              return (
                <button
                  key={role.value}
                  onClick={() => handleRoleChange(role.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                    isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <RoleIcon 
                    size={16} 
                    style={{ color: role.color }}
                  />
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {role.label}
                  </span>
                  {isSelected && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default RoleSelector;