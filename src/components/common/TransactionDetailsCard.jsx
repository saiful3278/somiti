import React, { useEffect, useRef, useState } from 'react';
import { X, Calendar, User, DollarSign, CreditCard, FileText, Hash, Clock, Copy, CheckCircle, Loader2, Download, Eye } from 'lucide-react';
import { openReceiptPdf, downloadReceiptPdf } from '../../utils/pdfReceipt';
import jsPDF from 'jspdf';
import '../../styles/components/TransactionDetailsCard.css';

const TransactionDetailsCard = ({ 
  transaction, 
  isVisible, 
  onClose, 
  position = { x: 0, y: 0 } 
}) => {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  // Document-level outside-click with capture to ensure reliability
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        console.log('TransactionDetailsCard: Escape pressed');
        onClose();
      }
    };

    const handlePointerDown = (event) => {
      const el = cardRef.current;
      if (!el) return;
      const clickedInside = el.contains(event.target);
      if (!clickedInside) {
        console.log('TransactionDetailsCard: outside click detected');
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Capture phase to ensure we detect outside taps/clicks reliably
    document.addEventListener('pointerdown', handlePointerDown, true);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    console.log('TransactionDetailsCard: opened', transaction);
    if (cardRef.current) {
      try {
        cardRef.current.focus();
      } catch {}
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.body.style.overflow = 'unset';
      console.log('TransactionDetailsCard: closed');
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

  // English label mappers (for receipts)
  const getTransactionTypeLabelEn = (type) => {
    const typeMap = {
      'monthly_deposit': 'Monthly Deposit',
      'share_purchase': 'Share Purchase',
      'loan_disbursement': 'Loan Disbursement',
      'loan_repayment': 'Loan Repayment',
      'profit_distribution': 'Profit Distribution',
      'penalty': 'Penalty',
      'subscription': 'Monthly Subscription',
      'loan': 'Loan',
      'donation': 'Donation',
      'fine': 'Fine',
      'share': 'Share',
      'withdrawal': 'Withdrawal',
      'other': 'Other'
    };
    return typeMap[type] || 'Other';
  };

  const getPaymentMethodLabelEn = (method) => {
    const methodMap = {
      'cash': 'Cash',
      'bank': 'Bank',
      'bank_transfer': 'Bank Transfer',
      'mobile': 'Mobile Banking',
      'mobile_banking': 'Mobile Banking',
      'card': 'Card',
      'check': 'Check'
    };
    return methodMap[method] || 'Other';
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

  const getGeneratedAtText = () => {
    try {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      let hours = d.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
      const hh = String(hours).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      const text = `Generated by fulmurigram.site on ${yyyy}-${mm}-${dd} at ${hh}:${min} ${ampm}`;
      console.log('TransactionDetailsCard: footer generatedAtText', text);
      return text;
    } catch (e) {
      console.log('TransactionDetailsCard: footer generatedAtText failed', e);
      return 'Generated by fulmurigram.site';
    }
  };

  const getReceiptPrintMode = () => {
    try {
      const mode = localStorage.getItem('receiptPrint') || 'auto';
      console.log('TransactionDetailsCard: receiptPrint mode', mode);
      return mode;
    } catch {
      return 'auto';
    }
  };

  const handleViewPdf = () => {
    console.log('TransactionDetailsCard: view pdf requested', transaction);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
      const loadFontAsBase64 = async (url) => {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      };
      const ensureBengaliFont = async () => {
        try {
          console.log('TransactionDetailsCard: loading Bengali font (view)');
          const base64 = await loadFontAsBase64('/fonts/NotoSansBengali-Regular.ttf');
          doc.addFileToVFS('NotoSansBengali-Regular.ttf', base64);
          doc.addFont('NotoSansBengali-Regular.ttf', 'NotoSansBengali', 'normal');
          doc.setFont('NotoSansBengali', 'normal');
        } catch (e) {
          console.log('TransactionDetailsCard: Bengali font load failed (view)', e);
          doc.setFont('helvetica', 'normal');
        }
      };
      const pxToMm = (px) => (px * 25.4) / 96;
      const renderBanglaTextImage = async (text, fontSizePx = 12) => {
        try {
          const fontFace = new FontFace('NotoSansBengaliInline', 'url(/fonts/NotoSansBengali-Regular.ttf)');
          await fontFace.load();
          document.fonts.add(fontFace);
          await document.fonts.ready;
          const scale = 4;
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCtx.font = `${fontSizePx}px "NotoSansBengaliInline", "Noto Sans Bengali", sans-serif`;
          const metrics = tempCtx.measureText(text);
          const ascent = Math.ceil(metrics.actualBoundingBoxAscent || fontSizePx * 0.8);
          const descent = Math.ceil(metrics.actualBoundingBoxDescent || fontSizePx * 0.2);
          const w = Math.ceil(metrics.width) + 8;
          const h = ascent + descent + 6;
          const canvas = document.createElement('canvas');
          canvas.width = w * scale;
          canvas.height = h * scale;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.setTransform(scale, 0, 0, scale, 0, 0);
          ctx.fillStyle = '#000000';
          ctx.font = `${fontSizePx}px "NotoSansBengaliInline", "Noto Sans Bengali", sans-serif`;
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(text, 0, ascent);
          const dataUrl = canvas.toDataURL('image/png');
          return { dataUrl, wMm: pxToMm(w), hMm: pxToMm(h) };
        } catch {
          return null;
        }
      };
      const drawHeader = async () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleImg = await renderBanglaTextImage('লেনদেন রসিদ', 14);
        if (titleImg) {
          const x = (pageWidth / 2) - (titleImg.wMm / 2);
          doc.addImage(titleImg.dataUrl, 'PNG', x, 12, titleImg.wMm, titleImg.hMm);
        }
      };
      const drawBody = async () => {
        doc.setDrawColor(220);
        doc.setFontSize(9);
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = Math.min(120, pageWidth - 20);
        const contentX = (pageWidth - contentWidth) / 2;
        const startY = 28;
        const rows = [
          ['সদস্য', transaction.memberName || 'অজানা সদস্য'],
          ['ধরন', getTransactionTypeLabel(transaction.type || transaction.transactionType || 'other')],
          ['পরিমাণ', `৳ ${(transaction.amount || 0).toLocaleString('bn-BD')}`],
          ['পেমেন্ট পদ্ধতি', getPaymentMethodLabel(transaction.paymentMethod || 'cash')],
          ['তারিখ/সময়', `${transaction.date ? (new Date(transaction.date)).toLocaleDateString('bn-BD', { year:'numeric', month:'long', day:'numeric' }) : ''}${transaction.time ? ` • ${transaction.time}` : ''}`],
          ['রেফারেন্স', transaction.reference || ''],
          ['প্রক্রিয়াকারী', transaction.processedBy || 'ক্যাশিয়ার']
        ];
        let y = startY;
        for (const [label, value] of rows) {
          const labelImg = await renderBanglaTextImage(String(label), 10);
          if (labelImg) doc.addImage(labelImg.dataUrl, 'PNG', contentX + 4, y, labelImg.wMm, labelImg.hMm);
          const valImg = await renderBanglaTextImage(String(value), 11);
          if (valImg) doc.addImage(valImg.dataUrl, 'PNG', contentX + 38, y, valImg.wMm, valImg.hMm);
          const lineHeight = Math.max(8, (valImg?.hMm || 8) + 2);
          y += lineHeight;
        }
        const totalHeight = y - startY;
        doc.roundedRect(contentX, startY - 4, contentWidth, totalHeight + 8, 2, 2);
      };
      const drawFooter = () => {
        console.log('TransactionDetailsCard: footer render (view mode)');
        const pageWidth = doc.internal.pageSize.getWidth();
        const footerText = getGeneratedAtText();
        try {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(37, 99, 235);
          doc.setFontSize(10);
          doc.text(footerText, pageWidth / 2, 138, { align: 'center' });
        } catch (e) {
          console.log('TransactionDetailsCard: footer text failed (view)', e);
        }
      };
      (async () => {
        await ensureBengaliFont();
        await drawHeader();
        await drawBody();
        drawFooter();
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        console.log('TransactionDetailsCard: pdf opened in new tab');
      })();
    } catch (e) {
      console.log('TransactionDetailsCard: view pdf failed', e);
    }
  };

  const handleDownloadPdf = () => {
    console.log('TransactionDetailsCard: pdf download requested', transaction);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

      const id = transaction?.transactionId || transaction?.id || 'N/A';
      const org = 'FULMURI YOUTH FOUNDATION';

      const loadFontAsBase64 = async (url) => {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      };

      const ensureBengaliFont = async () => {
        try {
          console.log('TransactionDetailsCard: loading Bengali font');
          const base64 = await loadFontAsBase64('/fonts/NotoSansBengali-Regular.ttf');
          doc.addFileToVFS('NotoSansBengali-Regular.ttf', base64);
          doc.addFont('NotoSansBengali-Regular.ttf', 'NotoSansBengali', 'normal');
          doc.setFont('NotoSansBengali', 'normal');
          console.log('TransactionDetailsCard: Bengali font applied');
        } catch (e) {
          console.log('TransactionDetailsCard: Bengali font load failed, using helvetica', e);
          doc.setFont('helvetica', 'normal');
        }
      };

      const drawHeader = async () => {
        try {
          console.log('TransactionDetailsCard: header render (download; no logo/no receipt no)');
          const pageWidth = doc.internal.pageSize.getWidth();
          const titleImg = await renderBanglaTextImage('লেনদেন রসিদ', 14);
          if (titleImg) {
            const x = (pageWidth / 2) - (titleImg.wMm / 2);
            doc.addImage(titleImg.dataUrl, 'PNG', x, 18, titleImg.wMm, titleImg.hMm);
          }
        } catch (e) {
          console.log('TransactionDetailsCard: header render failed (download)', e);
        }
      };

      const pxToMm = (px) => (px * 25.4) / 96;

      const renderBanglaTextImage = async (text, fontSizePx = 12) => {
        try {
          console.log('TransactionDetailsCard: rendering Bangla text image (download)', { text });
          const fontFace = new FontFace('NotoSansBengaliInline', 'url(/fonts/NotoSansBengali-Regular.ttf)');
          await fontFace.load();
          document.fonts.add(fontFace);
          await document.fonts.ready;
          const scale = 4;
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCtx.font = `${fontSizePx}px "NotoSansBengaliInline", "Noto Sans Bengali", sans-serif`;
          const metrics = tempCtx.measureText(text);
          const ascent = Math.ceil(metrics.actualBoundingBoxAscent || fontSizePx * 0.8);
          const descent = Math.ceil(metrics.actualBoundingBoxDescent || fontSizePx * 0.2);
          const w = Math.ceil(metrics.width) + 8;
          const h = ascent + descent + 6;
          const canvas = document.createElement('canvas');
          canvas.width = w * scale;
          canvas.height = h * scale;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.setTransform(scale, 0, 0, scale, 0, 0);
          ctx.fillStyle = '#000000';
          ctx.font = `${fontSizePx}px "NotoSansBengaliInline", "Noto Sans Bengali", sans-serif`;
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(text, 0, ascent);
          const dataUrl = canvas.toDataURL('image/png');
          return { dataUrl, wMm: pxToMm(w), hMm: pxToMm(h) };
        } catch (e) {
          console.log('TransactionDetailsCard: Bangla text image render failed (download)', e);
          return null;
        }
      };

      const drawBody = async () => {
        doc.setDrawColor(220);
        doc.setFontSize(9);
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = Math.min(120, pageWidth - 20);
        const contentX = (pageWidth - contentWidth) / 2;
        const startY = 28;
        const processedBySanitized = (() => {
          const val = transaction.processedBy || '';
          if (/[ -]/.test(val) && !/[\u0980-\u09FF]/.test(val)) return val; // plain ASCII
          if (/[\u0980-\u09FF]/.test(val)) return 'Cashier';
          return val || 'Cashier';
        })();

        const rows = [
          ['সদস্য', transaction.memberName || 'অজানা সদস্য'],
          ['ধরন', getTransactionTypeLabel(transaction.type || transaction.transactionType || 'other')],
          ['পরিমাণ', `৳ ${(transaction.amount || 0).toLocaleString('bn-BD')}`],
          ['পেমেন্ট পদ্ধতি', getPaymentMethodLabel(transaction.paymentMethod || 'cash')],
          ['তারিখ/সময়', `${transaction.date ? (new Date(transaction.date)).toLocaleDateString('bn-BD', { year:'numeric', month:'long', day:'numeric' }) : ''}${transaction.time ? ` • ${transaction.time}` : ''}`],
          ['রেফারেন্স', transaction.reference || ''],
          ['প্রক্রিয়াকারী', processedBySanitized === 'Cashier' ? 'ক্যাশিয়ার' : processedBySanitized]
        ];
        let y = startY;
        for (const [label, value] of rows) {
          doc.setTextColor(100);
          const labelImg = await renderBanglaTextImage(String(label), 10);
          if (labelImg) {
            doc.addImage(labelImg.dataUrl, 'PNG', contentX + 4, y, labelImg.wMm, labelImg.hMm);
          } else {
            doc.text(String(label), contentX + 4, y);
          }
          doc.setTextColor(30);
          const valImg = await renderBanglaTextImage(String(value), 11);
          if (valImg) {
            doc.addImage(valImg.dataUrl, 'PNG', contentX + 38, y, valImg.wMm, valImg.hMm);
          } else {
            doc.text(String(value), contentX + 38, y);
          }
          const lineHeight = Math.max(8, (valImg?.hMm || 8) + 2);
          y += lineHeight;
        }
        const totalHeight = y - startY;
        doc.roundedRect(contentX, startY - 4, contentWidth, totalHeight + 8, 2, 2);
      };

      const drawFooter = () => {
        console.log('TransactionDetailsCard: footer render (download mode)');
        const pageWidth = doc.internal.pageSize.getWidth();
        const footerText = getGeneratedAtText();
        try {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(37, 99, 235);
          doc.setFontSize(10);
          doc.text(footerText, pageWidth / 2, 138, { align: 'center' });
        } catch (e) {
          console.log('TransactionDetailsCard: footer text failed (download)', e);
        }
      };

      (async () => {
        await ensureBengaliFont();
        await drawHeader();
        await drawBody();
        drawFooter();
        doc.save(`receipt_${id}.pdf`);
      })();
    } catch (e) {
      console.log('TransactionDetailsCard: pdf generation failed', e);
    }
  };

  const copyId = () => {
    const id = transaction?.transactionId || transaction?.id;
    if (!id) return;
    const text = String(id);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          console.log('TransactionDetailsCard: ID copied', text);
          setTimeout(() => setCopied(false), 1200);
        })
        .catch((e) => {
          console.log('TransactionDetailsCard: ID copy failed', e);
        });
    }
  };

  // Center the card on screen with smaller size
  const cardStyle = {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <>
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
          if (e.target === e.currentTarget) {
            console.log('TransactionDetailsCard: backdrop clicked');
            onClose();
          }
        }}
        onTouchEnd={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault();
            console.log('TransactionDetailsCard: backdrop touched');
            onClose();
          }
        }}
      />
      
      <div 
        ref={cardRef}
        className={`transaction-card minimal-card fixed w-[640px] max-w-3xl transition-all duration-200 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ 
          ...cardStyle, 
          zIndex: 10000,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-card-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="toolbar flex justify-between items-center px-8 py-4">
          <h3 id="transaction-card-title" className="font-semibold flex items-center gap-3 text-base text-gray-900">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
              <FileText className="h-5 w-5 text-gray-700" />
            </span>
            লেনদেনের বিস্তারিত
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={async () => { console.log('TransactionDetailsCard: view pdf button clicked'); await openReceiptPdf(transaction); console.log('TransactionDetailsCard: pdf opened in new tab'); }}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              aria-label="ভিউ"
              title="PDF দেখুন"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button 
              onClick={async () => { console.log('TransactionDetailsCard: download pdf button clicked'); await downloadReceiptPdf(transaction); console.log('TransactionDetailsCard: pdf downloaded'); }}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              aria-label="PDF ডাউনলোড"
              title="PDF ডাউনলোড"
            >
              <Download className="h-5 w-5" />
            </button>
            <button 
              onClick={() => { console.log('TransactionDetailsCard: close clicked'); onClose(); }}
              className="transaction-card-close p-2 rounded-full"
              aria-label="বন্ধ করুন"
              title="বন্ধ করুন"
            >
              <X className="h-6 w-6" />
            </button>
        </div>
        
      </div>
        
        <div className="transaction-card-content px-8 py-5 space-y-4">
          <div className="space-y-3">
            <div className="member-info-section flex items-center gap-3 p-4 rounded-lg">
              <User className="transaction-icon h-5 w-5 text-gray-700" />
              <div>
                <p className="text-xs text-gray-600">সদস্যের নাম</p>
                <p className="font-medium text-gray-800 text-sm">{transaction.memberName || 'অজানা সদস্য'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="chip">
                <FileText className="h-3 w-3 mr-1" />
                {getTransactionTypeLabel(transaction.type || transaction.transactionType)}
              </span>
              <span className="transaction-amount font-semibold text-green-700 text-base">
                ৳ {transaction.amount?.toLocaleString('bn-BD') || '0'}
              </span>
              <span className={`pill flex items-center gap-2 text-xs`}>
                <span className={`dot ${transaction.status}`}></span>
                <span className="font-medium text-gray-700">{statusInfo.label}</span>
                {transaction.status === 'processing' ? <Loader2 className="h-3 w-3 text-blue-600" /> : null}
              </span>
            </div>
          </div>

          <div className="datetime-info-section border-t border-gray-100 pt-3 space-y-3">
            {transaction.date && (
              <div className="transaction-detail-row flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2 text-sm">
                  <Calendar className="transaction-icon h-4 w-4" />
                  তারিখ
                </span>
                <span className="font-medium text-gray-800 text-sm">
                  {formatDate(transaction.date)}
                </span>
              </div>
            )}

            {(transaction.month !== undefined || transaction.monthName) && (
              <div className="transaction-detail-row flex justify-between items-center">
                <span className="text-gray-600 text-sm">মাস</span>
                <span className="font-medium text-gray-800 chip">
                  {transaction.monthName || getMonthName(transaction.month)}
                </span>
              </div>
            )}

            {transaction.time && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 text-xs">সময়</span>
                <span className="text-gray-600 text-sm">{transaction.time}</span>
              </div>
            )}
          </div>

          <div className="payment-info-section border-t border-gray-100 pt-3 space-y-3">
            {transaction.paymentMethod && (
              <div className="transaction-detail-row flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2 text-sm">
                  <CreditCard className="transaction-icon h-4 w-4" />
                  পেমেন্ট পদ্ধতি
                </span>
                <span className="font-medium text-gray-800 pill">
                  {getPaymentMethodLabel(transaction.paymentMethod)}
                </span>
              </div>
            )}

            {transaction.processedBy && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">প্রক্রিয়াকারী</span>
                <span className="font-medium text-gray-800 text-sm">{transaction.processedBy}</span>
              </div>
            )}
          </div>

          <div className="technical-info-section border-t border-gray-100 pt-3 space-y-3">
            {(transaction.id || transaction.transactionId) && (
              <div className="transaction-detail-row flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2 text-sm">
                  <Hash className="transaction-icon h-4 w-4" />
                  লেনদেন ID
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-sm text-gray-600">
                    {transaction.transactionId || transaction.id}
                  </span>
                  <button className="id-copy p-1 rounded" onClick={() => { console.log('TransactionDetailsCard: copy ID clicked'); copyId(); }} aria-label="কপি করুন" title="কপি করুন">
                    {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                  </button>
                </span>
              </div>
            )}

            {transaction.reference && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">রেফারেন্স</span>
                <span className="font-medium text-gray-800 text-sm">{transaction.reference}</span>
              </div>
            )}
          </div>

          {transaction.description && (
            <div className="description-section border-t border-gray-100 pt-3">
              <p className="text-gray-800 text-sm bg-gray-50 px-4 py-3 rounded-lg leading-relaxed">
                {transaction.description}
              </p>
            </div>
          )}
        </div>

      </div>
      <div className="transaction-receipt-print">
        <div className="receipt-header">
          <div className="receipt-meta" style={{ marginLeft: 'auto' }}>
            <div className="receipt-title">লেনদেন রসিদ</div>
          </div>
        </div>
        <div className="receipt-body">
          <div className="receipt-row">
            <div className="label">সদস্য</div>
            <div className="value">{transaction.memberName || 'অজানা সদস্য'}</div>
          </div>
          <div className="receipt-row">
            <div className="label">ধরন</div>
            <div className="value">{getTransactionTypeLabel(transaction.type || transaction.transactionType)}</div>
          </div>
          <div className="receipt-row">
            <div className="label">পরিমাণ</div>
            <div className="value">৳ {(transaction.amount || 0).toLocaleString('bn-BD')}</div>
          </div>
          <div className="receipt-row">
            <div className="label">পেমেন্ট পদ্ধতি</div>
            <div className="value">{getPaymentMethodLabel(transaction.paymentMethod)}</div>
          </div>
          {(transaction.date || transaction.time) && (
            <div className="receipt-row">
              <div className="label">তারিখ/সময়</div>
              <div className="value">{transaction.date ? new Date(transaction.date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}{transaction.time ? ` • ${transaction.time}` : ''}</div>
            </div>
          )}
          {(transaction.reference) && (
            <div className="receipt-row">
              <div className="label">রেফারেন্স</div>
              <div className="value">{transaction.reference}</div>
            </div>
          )}
          {(transaction.processedBy) && (
            <div className="receipt-row">
              <div className="label">প্রক্রিয়াকারী</div>
              <div className="value">{transaction.processedBy === 'Cashier' ? 'ক্যাশিয়ার' : transaction.processedBy}</div>
            </div>
          )}
        </div>
        
      </div>
    </>
  );
};

export default TransactionDetailsCard;