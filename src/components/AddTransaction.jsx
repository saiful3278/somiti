import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
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
    notes: ''
  });

  // Sample member data - in real app this would come from API
  const members = [
    { id: 'SM-001', name: 'মোহাম্মদ রহিম উদ্দিন', currentShares: 5 },
    { id: 'SM-002', name: 'ফাতেমা খাতুন', currentShares: 3 },
    { id: 'SM-003', name: 'আব্দুল কাদের', currentShares: 7 },
    { id: 'SM-004', name: 'নাসির উদ্দিন আহমেদ', currentShares: 4 },
    { id: 'SM-005', name: 'সালমা বেগম', currentShares: 6 },
    { id: 'SM-006', name: 'আব্দুর রহমান', currentShares: 2 },
    { id: 'SM-007', name: 'রোকেয়া বেগম', currentShares: 8 },
    { id: 'SM-008', name: 'মোহাম্মদ করিম', currentShares: 5 }
  ];

  const transactionTypes = [
    { value: 'monthly_deposit', label: 'মাসিক জমা' },
    { value: 'share_purchase', label: 'শেয়ার ক্রয়' },
    { value: 'loan_disbursement', label: 'ঋণ প্রদান' },
    { value: 'loan_repayment', label: 'ঋণ পরিশোধ' },
    { value: 'profit_distribution', label: 'লাভ বিতরণ' },
    { value: 'penalty', label: 'জরিমানা' },
    { value: 'other', label: 'অন্যান্য' }
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would be an API call
      console.log('Transaction Data:', transactionData);
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
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
          notes: ''
        });
        setSubmitStatus(null);
      }, 2000);
      
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMember = members.find(member => member.id === transactionData.memberId);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/cashier')}
                className="mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">নতুন লেনদেন যোগ করুন</h1>
                <p className="text-sm text-gray-600">সদস্যের লেনদেনের বিস্তারিত তথ্য প্রদান করুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member Selection Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">সদস্য নির্বাচন</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">সদস্য নির্বাচন করুন *</label>
                <select
                  required
                  value={transactionData.memberId}
                  onChange={(e) => handleMemberSelect(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">সদস্য নির্বাচন করুন</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.id} - {member.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMember && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">{selectedMember.name}</p>
                      <p className="text-sm text-blue-700">সদস্য আইডি: {selectedMember.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-700">বর্তমান শেয়ার</p>
                      <p className="font-bold text-blue-900">{selectedMember.currentShares} টি</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Details Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">লেনদেনের বিবরণ</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">লেনদেনের ধরন *</label>
                <select
                  required
                  value={transactionData.transactionType}
                  onChange={(e) => handleTransactionTypeChange(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {transactionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">পরিমাণ (৳) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData({...transactionData, amount: e.target.value})}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="লেনদেনের পরিমাণ"
                />
              </div>

              {transactionData.transactionType === 'share_purchase' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">শেয়ার সংখ্যা *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={transactionData.shareAmount}
                    onChange={(e) => setTransactionData({...transactionData, shareAmount: e.target.value})}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ক্রয় করার শেয়ার সংখ্যা"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">তারিখ *</label>
                <input
                  type="date"
                  required
                  value={transactionData.date}
                  onChange={(e) => setTransactionData({...transactionData, date: e.target.value})}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">বিবরণ</label>
              <textarea
                value={transactionData.description}
                onChange={(e) => setTransactionData({...transactionData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="লেনদেনের বিস্তারিত বিবরণ"
              />
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">পেমেন্ট তথ্য</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">পেমেন্ট পদ্ধতি *</label>
                <select
                  required
                  value={transactionData.paymentMethod}
                  onChange={(e) => setTransactionData({...transactionData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              {transactionData.paymentMethod !== 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">রেফারেন্স নম্বর</label>
                  <input
                    type="text"
                    value={transactionData.paymentReference}
                    onChange={(e) => setTransactionData({...transactionData, paymentReference: e.target.value})}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ট্রানজেকশন/চেক নম্বর"
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">অতিরিক্ত নোট</label>
              <textarea
                value={transactionData.notes}
                onChange={(e) => setTransactionData({...transactionData, notes: e.target.value})}
                rows="2"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="অতিরিক্ত তথ্য বা মন্তব্য"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting || !transactionData.memberId || !transactionData.amount}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${
                  isSubmitting || !transactionData.memberId || !transactionData.amount
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
                onClick={() => navigate('/cashier')}
                className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                বাতিল করুন
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus && (
            <div className={`rounded-lg p-4 ${
              submitStatus === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {submitStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                )}
                <p className={`font-medium ${
                  submitStatus === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
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
  );
};

export default AddTransaction;