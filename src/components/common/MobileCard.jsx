import React from 'react';
import { ChevronRight } from 'lucide-react';

const MobileCard = ({ 
  children, 
  className = '', 
  onClick, 
  isClickable = false,
  padding = 'p-3 sm:p-4 md:p-6',
  shadow = 'shadow-sm hover:shadow-md',
  ...props 
}) => {
  const baseClasses = `
    bg-white rounded-xl border border-gray-200/50 
    transition-all duration-200 ease-out
    ${shadow}
    ${padding}
    ${isClickable ? 'cursor-pointer hover:border-primary-200 active:scale-[0.98] hover:shadow-lg' : ''}
    ${className}
  `;

  if (isClickable) {
    return (
      <div 
        className={baseClasses}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick?.(e);
          }
        }}
        {...props}
      >
        <div className="flex items-center justify-between min-h-[44px]">
          <div className="flex-1">
            {children}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

// Stat Card Component for Dashboard
export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'primary',
  change,
  changeType,
  onClick,
  className = ''
}) => {
  // Handle both color name and CSS class formats
  const getColorClasses = (colorInput) => {
    // If it's a CSS class (starts with bg-), extract the color
    if (typeof colorInput === 'string' && colorInput.startsWith('bg-')) {
      const colorMap = {
        'bg-blue-500': 'primary',
        'bg-green-500': 'success', 
        'bg-purple-500': 'secondary',
        'bg-orange-500': 'warning',
        'bg-red-500': 'error'
      };
      return colorMap[colorInput] || 'primary';
    }
    return colorInput;
  };

  const normalizedColor = getColorClasses(color);
  
  const colorClasses = {
    primary: 'from-blue-500 to-blue-600',
    secondary: 'from-purple-500 to-purple-600', 
    success: 'from-green-500 to-green-600',
    warning: 'from-orange-500 to-orange-600',
    error: 'from-red-500 to-red-600'
  };

  // Use change and changeType if provided, otherwise fall back to trend and trendValue
  const displayChange = change || trendValue;
  const displayChangeType = changeType || (trend === 'up' ? 'increase' : trend === 'down' ? 'decrease' : 'neutral');

  return (
    <MobileCard 
      isClickable={!!onClick}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
      padding="p-2 sm:p-3"
    >
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${colorClasses[normalizedColor]} opacity-10 rounded-full transform translate-x-3 sm:translate-x-4 -translate-y-3 sm:-translate-y-4`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-1 sm:mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 mb-1 truncate">{title}</p>
            <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">{value}</p>
          </div>
          {Icon && (
            <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${colorClasses[normalizedColor]} text-white flex-shrink-0 ml-2`}>
              <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="text-xs text-gray-500 mb-1 truncate">{subtitle}</p>
        )}
        
        {displayChange && (
          <div className="flex items-center">
            <span className={`text-xs font-medium ${
              displayChangeType === 'increase' ? 'text-green-600' : 
              displayChangeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {displayChangeType === 'increase' ? '↗' : displayChangeType === 'decrease' ? '↘' : '→'} {displayChange}
            </span>
            <span className="text-xs text-gray-500 ml-1 truncate">গত মাসের তুলনায়</span>
          </div>
        )}
      </div>
    </MobileCard>
  );
};

// List Item Card for Mobile
export const ListItemCard = ({ 
  title, 
  subtitle, 
  value, 
  icon: Icon, 
  badge,
  onClick,
  actions,
  className = ''
}) => {
  return (
    <MobileCard 
      isClickable={!!onClick}
      onClick={onClick}
      padding="p-3 sm:p-4"
      className={className}
    >
      <div className="flex items-center min-h-[44px]">
        {Icon && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{title}</h3>
            {badge && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${
                badge.type === 'success' ? 'bg-green-100 text-green-800' :
                badge.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                badge.type === 'error' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {badge.text}
              </span>
            )}
          </div>
          
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 truncate">{subtitle}</p>
          )}
          
          {value && (
            <p className="text-sm sm:text-lg font-semibold text-gray-900 mt-1">{value}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </MobileCard>
  );
};

// Quick Action Card
export const QuickActionCard = ({ title, icon: Icon, color = 'blue', onClick, className = '', ...props }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <MobileCard
      onClick={onClick}
      className={`text-center hover:scale-105 transition-all duration-300 ${className}`}
      padding="p-3 sm:p-4"
      {...props}
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">{title}</h3>
    </MobileCard>
  );
};

export default MobileCard;