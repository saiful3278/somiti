import React, { useState } from 'react';
import { 
  DollarSign,
  CheckCircle,
  Clock,
  Plus,
  Search
} from 'lucide-react';

const ShareTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Simplified data structure
  const deposits = [
    {
      id: 1,
      memberName: 'মোহাম্মদ রহিম উদ্দিন',
      memberId: 'SM-001',
      amount: 2000,
      status: 'paid'
    },
    {
      id: 2,
      memberName: 'ফাতেমা খাতুন',
      memberId: 'SM-002',
      amount: 1500,
      status: 'paid'
    },
    {
      id: 3,
      memberName: 'আব্দুল কাদের',
      memberId: 'SM-003',
      amount: 1000,
      status: 'pending'
    },
    {
      id: 4,
      memberName: 'নাসির উদ্দিন',
      memberId: 'SM-004',
      amount: 2000,
      status: 'paid'
    },
    {
      id: 5,
      memberName: 'সালমা বেগম',
      memberId: 'SM-005',
      amount: 1200,
      status: 'pending'
    }
  ];

  // Simple calculations
  const totalCollected = deposits.filter(d => d.status === 'paid').reduce((sum, d) => sum + d.amount, 0);
  const pendingCount = deposits.filter(d => d.status === 'pending').length;
  const paidCount = deposits.filter(d => d.status === 'paid').length;

  // Filter deposits based on search
  const filteredDeposits = deposits.filter(deposit =>
    deposit.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deposit.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="md-dashboard">
      <div className="md-surface-container">
        <div className="md-dashboard-content">
          
          {/* Simple Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">শেয়ার ট্র্যাকিং</h1>
            <p className="text-gray-600">সদস্যদের মাসিক জমার সংক্ষিপ্ত তথ্য</p>
          </div>

          {/* Simple Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">মোট সংগৃহীত</p>
                  <p className="text-lg font-semibold text-gray-900">৳ {totalCollected.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">পরিশোধিত</p>
                  <p className="text-lg font-semibold text-gray-900">{paidCount} জন</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">বকেয়া</p>
                  <p className="text-lg font-semibold text-gray-900">{pendingCount} জন</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Search */}
          <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
            <div className="flex items-center space-x-3">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="সদস্যের নাম বা আইডি খুঁজুন..."
                className="flex-1 border-0 focus:ring-0 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Simple Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900">মাসিক জমার তালিকা</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredDeposits.map((deposit) => (
                <div key={deposit.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{deposit.memberName}</p>
                          <p className="text-xs text-gray-500">আইডি: {deposit.memberId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">৳ {deposit.amount.toLocaleString()}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            deposit.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {deposit.status === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredDeposits.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500">কোনো রেকর্ড পাওয়া যায়নি</p>
              </div>
            )}
          </div>

          {/* Simple Add Button */}
          <div className="mt-6 text-center">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              নতুন জমা যোগ করুন
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShareTracking;