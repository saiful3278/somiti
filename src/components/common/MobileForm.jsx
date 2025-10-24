import React, { useState } from 'react';
import { Eye, EyeOff, ChevronDown, X, Check } from 'lucide-react';
import MobileCard from './MobileCard';
import LoadingAnimation from './LoadingAnimation';

// Mobile-optimized Input Field
export const MobileInput = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full min-h-[44px] h-12 px-3 sm:px-4 ${Icon ? 'pl-10 sm:pl-12' : ''} ${type === 'password' ? 'pr-10 sm:pr-12' : ''}
            border border-gray-300 rounded-xl
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 ease-out
            text-base placeholder-gray-400
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${isFocused ? 'shadow-lg' : 'shadow-sm'}
            touch-manipulation
          `}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-400" />
            ) : (
              <Eye className="w-5 h-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Mobile-optimized Select Field
export const MobileSelect = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  placeholder = 'নির্বাচন করুন',
  error,
  required = false,
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full min-h-[44px] h-12 px-3 sm:px-4 pr-10 sm:pr-12 text-left
            border border-gray-300 rounded-xl
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 ease-out
            text-base bg-white
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${isOpen ? 'shadow-lg ring-2 ring-primary-500 border-transparent' : 'shadow-sm'}
            touch-manipulation
          `}
          {...props}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </button>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </div>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full min-h-[44px] px-3 sm:px-4 py-3 text-left hover:bg-gray-50 transition-colors touch-manipulation
                    ${value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                    first:rounded-t-xl last:rounded-b-xl
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base">{option.label}</span>
                    {value === option.value && (
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Mobile-optimized Textarea
export const MobileTextarea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  error,
  required = false,
  rows = 4,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full min-h-[88px] px-3 sm:px-4 py-3
          border border-gray-300 rounded-xl
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200 ease-out
          text-base placeholder-gray-400 resize-none
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${isFocused ? 'shadow-lg' : 'shadow-sm'}
          touch-manipulation
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Mobile-optimized Checkbox
export const MobileCheckbox = ({ 
  label, 
  checked, 
  onChange, 
  className = '',
  ...props 
}) => {
  return (
    <label className={`flex items-center cursor-pointer min-h-[44px] py-2 touch-manipulation ${className}`}>
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div className={`
          w-5 h-5 sm:w-6 sm:h-6 rounded border-2 transition-all duration-200
          ${checked 
            ? 'bg-blue-600 border-blue-600' 
            : 'bg-white border-gray-300 hover:border-gray-400'
          }
        `}>
          {checked && (
            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white absolute top-0.5 left-0.5 sm:top-0 sm:left-0" />
          )}
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm sm:text-base text-gray-700">{label}</span>
      )}
    </label>
  );
};

// Mobile Form Container
export const MobileForm = ({ 
  children, 
  onSubmit, 
  title, 
  subtitle,
  className = '',
  ...props 
}) => {
  return (
    <MobileCard className={className}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      
      <form onSubmit={onSubmit} {...props}>
        {children}
      </form>
    </MobileCard>
  );
};

// Mobile Button
export const MobileButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 shadow-sm hover:shadow-md',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-white shadow-sm hover:shadow-md',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
  };

  const sizes = {
    sm: 'min-h-[40px] px-3 sm:px-4 text-sm',
    md: 'min-h-[44px] px-4 sm:px-6 text-sm sm:text-base',
    lg: 'min-h-[48px] px-6 sm:px-8 text-base sm:text-lg'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm
        active:scale-95 touch-manipulation
        flex items-center justify-center
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-sm sm:text-base">লোড হচ্ছে...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default MobileForm;