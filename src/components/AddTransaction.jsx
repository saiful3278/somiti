import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  DollarSign, 
  CreditCard, 
  Calendar,
  FileText,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { MemberService } from '../firebase/memberService';
import { TransactionService } from '../firebase/transactionService';
import LoadingAnimation from './common/LoadingAnimation';
import { toast } from 'react-hot-toast';
import '../styles/components/add-transaction-modal.css';

const AddTransaction = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  
  
  
  const [transactionData, setTransactionData] = useState({
    memberId: '',
    memberName: '',
    transactionType: 'monthly_deposit',
    amount: '',
    shareAmount: '',
    paymentMethod: 'cash',
    paymentReference: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    month: new Date().getMonth(), // Current month (0-11)
    notes: ''
  });

  // Fetch real member data from Firebase
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoadingMembers(true);
      try {
        const result = await MemberService.getActiveMembers();
        if (result.success) {
          // Transform the data to match the expected format
          const transformedMembers = result.data.map(member => ({
            id: member.id,
            name: member.name,
            currentShares: member.shareCount || 0,
            membershipId: member.somiti_user_id
          }));
          setMembers(transformedMembers);
        } else {
          console.error('Failed to fetch members:', result.error);
          // Fallback to empty array if fetch fails
          setMembers([]);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, []);

  const transactionTypes = [
    { value: 'monthly_deposit', label: 'মাসিক জমা' },
    { value: 'share_purchase', label: 'শেয়ার ক্রয়' },
    { value: 'loan_disbursement', label: 'ঋণ প্রদান' },
    { value: 'loan_repayment', label: 'ঋণ পরিশোধ' },
    { value: 'profit_distribution', label: 'লাভ বিতরণ' },
    { value: 'penalty', label: 'জরিমানা' },
    { value: 'other', label: 'অন্যান্য' }
  ];

  const months = [
    { value: 0, label: 'জানুয়ারি' },
    { value: 1, label: 'ফেব্রুয়ারি' },
    { value: 2, label: 'মার্চ' },
    { value: 3, label: 'এপ্রিল' },
    { value: 4, label: 'মে' },
    { value: 5, label: 'জুন' },
    { value: 6, label: 'জুলাই' },
    { value: 7, label: 'আগস্ট' },
    { value: 8, label: 'সেপ্টেম্বর' },
    { value: 9, label: 'অক্টোবর' },
    { value: 10, label: 'নভেম্বর' },
    { value: 11, label: 'ডিসেম্বর' }
  ];

  const paymentMethods = [
    { value: 'cash', label: 'নগদ' },
    { value: 'bank_transfer', label: 'ব্যাংক ট্রান্সফার' },
    { value: 'mobile_banking', label: 'মোবাইল ব্যাংকিং' },
    { value: 'check', label: 'চেক' }
  ];

  const handleMemberSelect = (memberId) => {
    const selectedMember = members.find(member => member.id === memberId);
    setTransactionData({
      ...transactionData,
      memberId,
      memberName: selectedMember ? selectedMember.name : ''
    });
  };

  const handleTransactionTypeChange = (transactionType) => {
    setTransactionData({
      ...transactionData,
      transactionType,
      // Clear share amount if not share purchase
      shareAmount: transactionType === 'share_purchase' ? transactionData.shareAmount : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare transaction data for Firebase
      const transactionToSave = {
        memberId: transactionData.memberId,
        memberName: transactionData.memberName,
        transactionType: transactionData.transactionType,
        amount: parseFloat(transactionData.amount),
        shareAmount: transactionData.shareAmount ? parseInt(transactionData.shareAmount) : null,
        paymentMethod: transactionData.paymentMethod,
        paymentReference: transactionData.paymentReference || null,
        description: transactionData.description || '',
        date: transactionData.date,
        month: transactionData.month,
        monthName: months[transactionData.month].label,
        notes: transactionData.notes || '',
        status: 'completed'
      };

      // Save transaction to Firebase
      const result = await TransactionService.addTransaction(transactionToSave);
      
      if (result.success) {
        console.log('Transaction saved successfully with ID:', result.id);
        console.log('AddTransaction: toast success - লেনদেন সফল');
        toast.success(`${selectedMember?.name || 'সদস্য'} এর জন্য ${transactionData.amount} টাকার লেনদেন সফলভাবে সংরক্ষিত হয়েছে।`);
        setTransactionData({
          memberId: '',
          memberName: '',
          transactionType: 'monthly_deposit',
          amount: '',
          shareAmount: '',
          paymentMethod: 'cash',
          paymentReference: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          month: new Date().getMonth(),
          notes: ''
        });
        setSubmitStatus(null);
        onClose();
      } else {
        console.error('Failed to save transaction:', result.error);
        setSubmitStatus('error');
      }
      
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMember = members.find(member => member.id === transactionData.memberId);

  return (
    <div className="add-transaction-backdrop" onClick={onClose}>
      <div className="add-transaction-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="add-transaction-header">
          <div className="add-transaction-header-content">
            <div>
              <h1 className="add-transaction-title">নতুন লেনদেন যোগ করুন</h1>
              <p className="add-transaction-subtitle">সদস্যের লেনদেনের বিস্তারিত তথ্য প্রদান করুন</p>
            </div>
            <button
              onClick={onClose}
              className="add-transaction-close-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="add-transaction-body">
        <form onSubmit={handleSubmit}>
          {/* Member Selection Card */}
          <div className="add-transaction-section">
            <div className="add-transaction-section-header">
              <User className="add-transaction-section-icon" />
              <h3 className="add-transaction-section-title">সদস্য নির্বাচন</h3>
            </div>
            
            <div>
              <div className="add-transaction-form-group">
                <label className="add-transaction-label">সদস্য নির্বাচন করুন *</label>
                <select
                  required
                  value={transactionData.memberId}
                  onChange={(e) => handleMemberSelect(e.target.value)}
                  disabled={isLoadingMembers}
                  className="add-transaction-select"
                >
                  <option value="">
                    {isLoadingMembers ? 'সদস্য তালিকা লোড হচ্ছে...' : 
                     members.length === 0 ? 'কোনো সক্রিয় সদস্য পাওয়া যায়নি' : 
                     'সদস্য নির্বাচন করুন'}
                  </option>
                  {!isLoadingMembers && members.map((member) => (
                    <option key={member.id} value={member.id}>
                        {member.somiti_user_id} - {member.name}
                      </option>
                  ))}
                </select>
                {isLoadingMembers && (
                  <p className="text-sm text-gray-500 mt-1">সদস্য তালিকা ডাটাবেস থেকে লোড হচ্ছে...</p>
                )}
                {!isLoadingMembers && members.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">কোনো সক্রিয় সদস্য পাওয়া যায়নি। প্রথমে সদস্য যোগ করুন।</p>
                )}
              </div>

              {selectedMember && (
                <div className="add-transaction-member-info">
                  <div className="add-transaction-member-info-row">
                    <span className="add-transaction-member-info-label">সদস্যের নাম:</span>
                    <span className="add-transaction-member-info-value">{selectedMember.name}</span>
                  </div>
                  <div className="add-transaction-member-info-row">
                    <span className="add-transaction-member-info-label">সদস্য আইডি:</span>
                    <span className="add-transaction-member-info-value">{selectedMember.somiti_user_id}</span>
                  </div>
                  <div className="add-transaction-member-info-row">
                    <span className="add-transaction-member-info-label">বর্তমান শেয়ার:</span>
                    <span className="add-transaction-member-info-value">{selectedMember.currentShares} টি</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Details Card */}
          <div className="add-transaction-section">
            <div className="add-transaction-section-header">
              <DollarSign className="add-transaction-section-icon" />
              <h3 className="add-transaction-section-title">লেনদেনের বিবরণ</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="add-transaction-form-group">
                <label className="add-transaction-label">লেনদেনের ধরন *</label>
                <select
                  required
                  value={transactionData.transactionType}
                  onChange={(e) => handleTransactionTypeChange(e.target.value)}
                  className="add-transaction-select"
                >
                  {transactionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="add-transaction-form-group">
                <label className="add-transaction-label">পরিমাণ (৳) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData({...transactionData, amount: e.target.value})}
                  className="add-transaction-input"
                  placeholder="লেনদেনের পরিমাণ"
                />
              </div>

              {transactionData.transactionType === 'share_purchase' && (
                <div className="add-transaction-form-group">
                  <label className="add-transaction-label">শেয়ার সংখ্যা *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={transactionData.shareAmount}
                    onChange={(e) => setTransactionData({...transactionData, shareAmount: e.target.value})}
                    className="add-transaction-input"
                    placeholder="ক্রয় করার শেয়ার সংখ্যা"
                  />
                </div>
              )}

              <div className="add-transaction-form-group">
                <label className="add-transaction-label">তারিখ *</label>
                <input
                  type="date"
                  required
                  value={transactionData.date}
                  onChange={(e) => setTransactionData({...transactionData, date: e.target.value})}
                  className="add-transaction-input"
                />
              </div>

              <div className="add-transaction-form-group">
                <label className="add-transaction-label">মাস *</label>
                <select
                  required
                  value={transactionData.month}
                  onChange={(e) => setTransactionData({...transactionData, month: parseInt(e.target.value)})}
                  className="add-transaction-select"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="add-transaction-form-group">
              <label className="add-transaction-label">বিবরণ</label>
              <textarea
                value={transactionData.description}
                onChange={(e) => setTransactionData({...transactionData, description: e.target.value})}
                rows="3"
                className="add-transaction-textarea"
                placeholder="লেনদেনের বিস্তারিত বিবরণ"
              />
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="add-transaction-section">
            <div className="add-transaction-section-header">
              <CreditCard className="add-transaction-section-icon" />
              <h3 className="add-transaction-section-title">পেমেন্ট তথ্য</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="add-transaction-form-group">
                <label className="add-transaction-label">পেমেন্ট পদ্ধতি *</label>
                <select
                  required
                  value={transactionData.paymentMethod}
                  onChange={(e) => setTransactionData({...transactionData, paymentMethod: e.target.value})}
                  className="add-transaction-select"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              {transactionData.paymentMethod !== 'cash' && (
                <div className="add-transaction-form-group">
                  <label className="add-transaction-label">রেফারেন্স নম্বর</label>
                  <input
                    type="text"
                    value={transactionData.paymentReference}
                    onChange={(e) => setTransactionData({...transactionData, paymentReference: e.target.value})}
                    className="add-transaction-input"
                    placeholder="ট্রানজেকশন/চেক নম্বর"
                  />
                </div>
              )}
            </div>

            <div className="add-transaction-form-group">
              <label className="add-transaction-label">অতিরিক্ত নোট</label>
              <textarea
                value={transactionData.notes}
                onChange={(e) => setTransactionData({...transactionData, notes: e.target.value})}
                rows="2"
                className="add-transaction-textarea"
                placeholder="অতিরিক্ত তথ্য বা মন্তব্য"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="add-transaction-section">
            <div className="add-transaction-actions">
              <button
                type="submit"
                disabled={isSubmitting || !transactionData.memberId || !transactionData.amount}
                className={`add-transaction-submit-btn ${
                  isSubmitting || !transactionData.memberId || !transactionData.amount
                    ? 'disabled'
                    : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="add-transaction-spinner"></div>
                    লেনদেন সংরক্ষণ করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    লেনদেন সংরক্ষণ করুন
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="add-transaction-cancel-btn"
              >
                বাতিল করুন
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus && (
            <div className={`add-transaction-status ${
              submitStatus === 'success' ? 'success' : 'error'
            }`}>
              <div className="add-transaction-status-content">
                {submitStatus === 'success' ? (
                  <CheckCircle className="add-transaction-status-icon" />
                ) : (
                  <AlertCircle className="add-transaction-status-icon" />
                )}
                <p className="add-transaction-status-text">
                  {submitStatus === 'success' 
                    ? 'লেনদেন সফলভাবে সংরক্ষিত হয়েছে!' 
                    : 'লেনদেন সংরক্ষণে ত্রুটি হয়েছে। আবার চেষ্টা করুন।'
                  }
                </p>
              </div>
            </div>
          )}
        </form>
        </div>
      </div>
      
      
    </div>
  );
};

export default AddTransaction;