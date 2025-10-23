import React, { useEffect, useRef } from 'react';
import { X, Calendar, User, DollarSign, CreditCard, FileText, Hash, Clock } from 'lucide-react';
import '../../styles/components/TransactionDetailsCard.css';

const TransactionDetailsCard = ({ 
  transaction, 
  isVisible, 
  onClose, 
  position = { x: 0, y: 0 } 
}) => {
  const cardRef = useRef(null);
  // Document-level outside-click with capture to ensure reliability
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const handlePointerDown = (event) => {
      const el = cardRef.current;
      if (!el) return;
      const clickedInside = el.contains(event.target);
      if (!clickedInside) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Capture phase to ensure we detect outside taps/clicks reliably
    document.addEventListener('pointerdown', handlePointerDown, true);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, onClose]);

  if (!isVisible || !transaction) return null;

  // Helper function to get transaction type label in Bengali
  const getTransactionTypeLabel = (type) => {
    const typeMap = {
      'monthly_deposit': 'মাসিক জমা',
      'share_purchase': 'শেয়ার ক্রয়',
      'loan_disbursement': 'ঋণ প্রদান',
      'loan_repayment': 'ঋণ পরিশোধ',
      'profit_distribution': 'লাভ বিতরণ',
      'penalty': 'জরিমানা',
      'subscription': 'মাসিক চাঁদা',
      'loan': 'ঋণ',
      'donation': 'দান',
      'fine': 'জরিমানা',
      'share': 'শেয়ার',
      'withdrawal': 'উত্তোলন',
      'other': 'অন্যান্য'
    };
    return typeMap[type] || 'অন্যান্য';
  };

  // Helper function to get payment method label in Bengali
  const getPaymentMethodLabel = (method) => {
    const methodMap = {
      'cash': 'নগদ',
      'bank': 'ব্যাংক',
      'bank_transfer': 'ব্যাংক ট্রান্সফার',
      'mobile': 'মোবাইল ব্যাংকিং',
      'mobile_banking': 'মোবাইল ব্যাংকিং',
      'card': 'কার্ড',
      'check': 'চেক'
    };
    return methodMap[method] || 'অন্যান্য';
  };

  // Helper function to get status label and color
  const getStatusInfo = (status) => {
    const statusMap = {
      'completed': { label: 'সম্পন্ন', color: 'text-green-600', bgColor: 'bg-green-50' },
      'pending': { label: 'অপেক্ষমাণ', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
      'failed': { label: 'ব্যর্থ', color: 'text-red-600', bgColor: 'bg-red-50' },
      'processing': { label: 'প্রক্রিয়াধীন', color: 'text-blue-600', bgColor: 'bg-blue-50' }
    };
    return statusMap[status] || { label: 'অজানা', color: 'text-gray-600', bgColor: 'bg-gray-50' };
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to get month name in Bengali
  const getMonthName = (monthIndex) => {
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    return months[monthIndex] || 'অজানা';
  };

  const statusInfo = getStatusInfo(transaction.status);

  // Center the card on screen with smaller size
  const cardStyle = {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <>
      {/* Backdrop: closes on click/touch outside */}
      <div 
        className={`transaction-card-backdrop fixed inset-0 bg-black transition-all duration-300 ${
          isVisible ? 'bg-opacity-30' : 'bg-opacity-0'
        }`}
        style={{ 
          zIndex: 9999,
          cursor: 'pointer',
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchEnd={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault();
            onClose();
          }
        }}
      />
      
      {/* Simplified Floating Card */}
      <div 
        ref={cardRef}
        className={`transaction-card fixed w-[500px] max-w-2xl transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ 
          ...cardStyle, 
          zIndex: 10000,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="transaction-card-header flex justify-between items-center">
          <h3 className="transaction-card-title font-semibold flex items-center gap-3 text-lg">
            <FileText className="transaction-icon h-6 w-6" />
            লেনদেনের বিস্তারিত
          </h3>
          <button 
            onClick={onClose}
            className="transaction-card-close p-2 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="transaction-card-content p-6 space-y-5">
          {/* Primary Transaction Information */}
          <div className="primary-info-section space-y-4">
            {/* Member Information */}
            <div className="member-info-section flex items-center gap-3 p-4 rounded-lg">
              <User className="transaction-icon h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">সদস্যের নাম</p>
                <p className="font-medium text-gray-800 text-base">{transaction.memberName || 'অজানা সদস্য'}</p>
              </div>
            </div>

            {/* Transaction Type & Amount */}
            <div className="transaction-main-info space-y-3">
              <div className="transaction-detail-row flex justify-between items-center py-2">
                <span className="text-gray-600 flex items-center gap-2 text-base">
                  <FileText className="transaction-icon h-4 w-4" />
                  লেনদেনের ধরন:
                </span>
                <span className="font-medium text-gray-800 text-base">
                  {getTransactionTypeLabel(transaction.type || transaction.transactionType)}
                </span>
              </div>

              <div className="transaction-detail-row flex justify-between items-center py-2">
                <span className="text-gray-600 flex items-center gap-2 text-base">
                  <DollarSign className="transaction-icon h-4 w-4" />
                  পরিমাণ:
                </span>
                <span className="transaction-amount font-bold text-green-600 text-lg">
                  ৳ {transaction.amount?.toLocaleString('bn-BD') || '0'}
                </span>
              </div>

              <div className="transaction-detail-row flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2 text-sm">
                  <Clock className="transaction-icon h-3 w-3" />
                  স্ট্যাটাস:
                </span>
                <span className={`status-badge font-medium px-2 py-1 rounded-full text-xs ${statusInfo.color} ${statusInfo.bgColor}`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Date & Time Information */}
          <div className="datetime-info-section border-t border-gray-100 pt-4 space-y-3">
            {transaction.date && (
              <div className="transaction-detail-row flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar className="transaction-icon h-4 w-4" />
                  তারিখ:
                </span>
                <span className="font-medium text-gray-800">
                  {formatDate(transaction.date)}
                </span>
              </div>
            )}

            {(transaction.month !== undefined || transaction.monthName) && (
              <div className="transaction-detail-row flex justify-between items-center">
                <span className="text-gray-600">মাস:</span>
                <span className="font-medium text-gray-800">
                  {transaction.monthName || getMonthName(transaction.month)}
                </span>
              </div>
            )}

            {transaction.time && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">সময়:</span>
                <span className="text-gray-600">{transaction.time}</span>
              </div>
            )}
          </div>

          {/* Payment & Processing Information */}
          <div className="payment-info-section border-t border-gray-100 pt-4 space-y-3">
            {transaction.paymentMethod && (
              <div className="transaction-detail-row flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <CreditCard className="transaction-icon h-4 w-4" />
                  পেমেন্ট পদ্ধতি:
                </span>
                <span className="font-medium text-gray-800">
                  {getPaymentMethodLabel(transaction.paymentMethod)}
                </span>
              </div>
            )}

            {transaction.processedBy && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">প্রক্রিয়াকারী:</span>
                <span className="font-medium text-gray-800">{transaction.processedBy}</span>
              </div>
            )}
          </div>

          {/* Technical Information */}
          <div className="technical-info-section border-t border-gray-100 pt-4 space-y-3">
            {(transaction.id || transaction.transactionId) && (
              <div className="transaction-detail-row flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <Hash className="transaction-icon h-4 w-4" />
                  লেনদেন ID:
                </span>
                <span className="font-mono text-sm text-gray-600">
                  {transaction.transactionId || transaction.id}
                </span>
              </div>
            )}

            {transaction.reference && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">রেফারেন্স:</span>
                <span className="font-medium text-gray-800">{transaction.reference}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {transaction.description && (
            <div className="description-section border-t border-gray-100 pt-4">
              <p className="text-gray-600 text-sm mb-2">বিবরণ:</p>
              <p className="text-gray-800 text-sm bg-gray-50 p-3 rounded-lg leading-relaxed">
                {transaction.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TransactionDetailsCard;