import React, { useEffect, useRef, useState } from 'react';
import { X, Hash, Copy, CheckCircle, Download, Eye } from 'lucide-react';
import { openReceiptPdf, downloadReceiptPdf } from '../../utils/pdfReceipt';
import '../../styles/components/TransactionDetailsCard.css';

const DetailItem = ({ label, value, statusInfo }) => {
  console.log('TransactionDetailsCard: render detail', { label, value });
  return (
    <div className="detail-item">
      <div className="label">{label}</div>
      <div className={`value ${statusInfo ? 'status' : ''}`} style={statusInfo ? { backgroundColor: statusInfo.bgColor, color: statusInfo.color } : {}}>
        {value ?? 'N/A'}
      </div>
    </div>
  );
};

const TransactionDetailsCard = ({ transaction, isVisible, onClose }) => {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        console.log('TransactionDetailsCard: escape pressed');
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    console.log('TransactionDetailsCard: opened', transaction);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      console.log('TransactionDetailsCard: closed');
    };
  }, [isVisible, onClose]);

  if (!isVisible || !transaction) return null;

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

  const getStatusInfo = (status) => {
    const statusMap = {
      'completed': { label: 'সম্পন্ন', color: '#28a745', bgColor: 'rgba(40, 167, 69, 0.1)' },
      'pending': { label: 'অপেক্ষমাণ', color: '#ffc107', bgColor: 'rgba(255, 193, 7, 0.1)' },
      'failed': { label: 'ব্যর্থ', color: '#dc3545', bgColor: 'rgba(220, 53, 69, 0.1)' },
      'processing': { label: 'প্রক্রিয়াধীন', color: '#17a2b8', bgColor: 'rgba(23, 162, 184, 0.1)' }
    };
    return statusMap[status] || { label: 'অজানা', color: '#6c757d', bgColor: 'rgba(108, 117, 125, 0.1)' };
  };

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

  const pickFirst = (...args) => args.find(v => v !== undefined && v !== null && v !== '') ?? null;

  const getMemberNameValue = (t) => {
    const v = pickFirst(t?.member_name, t?.memberName, t?.member?.name, t?.user_name, t?.user?.name, t?.name);
    console.log('TransactionDetailsCard: member name resolved', v);
    return v ?? 'N/A';
  };

  const getAmountValue = (t) => {
    const v = pickFirst(t?.amount, t?.value, t?.total);
    console.log('TransactionDetailsCard: amount resolved', v);
    return v != null ? `৳${v}` : 'N/A';
  };

  const getTypeValue = (t) => {
    const v = pickFirst(t?.type, t?.transaction_type, t?.category);
    console.log('TransactionDetailsCard: type raw', v);
    return getTransactionTypeLabel(v);
  };

  const getPaymentMethodValue = (t) => {
    const v = pickFirst(t?.payment_method, t?.paymentMethod, t?.method);
    console.log('TransactionDetailsCard: payment method raw', v);
    return getPaymentMethodLabel(v);
  };

  const getDateValue = (t) => {
    const v = pickFirst(t?.date, t?.created_at, t?.createdAt, t?.timestamp);
    console.log('TransactionDetailsCard: date raw', v);
    return formatDate(v);
  };

  const getTimeValue = (t) => {
    const v = pickFirst(t?.created_at, t?.createdAt, t?.timestamp, t?.date);
    console.log('TransactionDetailsCard: time raw', v);
    try {
      return new Date(v).toLocaleTimeString('bn-BD');
    } catch {
      return 'N/A';
    }
  };

  const statusInfo = getStatusInfo(transaction.status);

  const handleCopy = () => {
    console.log('TransactionDetailsCard: copy transaction id', transaction?.id);
    navigator.clipboard.writeText(transaction.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewPdf = () => {
    console.log('TransactionDetailsCard: view receipt requested', transaction);
    openReceiptPdf(transaction);
  };

  const handleDownloadPdf = () => {
    console.log('TransactionDetailsCard: download receipt requested', transaction);
    downloadReceiptPdf(transaction);
  };

  return (
    <div className="transaction-details-card-overlay" onClick={onClose}>
      <div className="transaction-details-card" ref={cardRef} onClick={(e) => e.stopPropagation()}>
        <div className="transaction-details-card-header">
          <h2>লেনদেনের বিবরণ</h2>
          <button className="close-button" onClick={() => { console.log('TransactionDetailsCard: close clicked'); onClose(); }}>
            <X size={24} />
          </button>
        </div>
          <div className="transaction-details-card-body">
          <div className="transaction-details-grid">
            <DetailItem label="সদস্য" value={getMemberNameValue(transaction)} />
            <DetailItem label="পরিমাণ" value={getAmountValue(transaction)} />
            <DetailItem label="ধরণ" value={getTypeValue(transaction)} />
            <DetailItem label="পেমেন্ট পদ্ধতি" value={getPaymentMethodValue(transaction)} />
            <DetailItem label="তারিখ" value={getDateValue(transaction)} />
            <DetailItem label="সময়" value={getTimeValue(transaction)} />
          </div>
          <div className="transaction-id-section">
            <div className="transaction-id-wrapper">
              <Hash size={16} />
              <span className="value">{transaction.id}</span>
              <button className="copy-button" onClick={handleCopy}>
                {copied ? <CheckCircle size={16} color="green" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
        <div className="transaction-details-card-footer">
          <button className="action-button" onClick={handleViewPdf}>
            <Eye size={20} />
            রসিদ দেখুন
          </button>
          <button className="action-button" onClick={handleDownloadPdf}>
            <Download size={20} />
            ডাউনলোড
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsCard;