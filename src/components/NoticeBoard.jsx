import React, { useState } from 'react';
import { 
  Plus, 
  Eye,
  Edit,
  Trash2,
  Pin,
  Bell,
  Clock,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Send,
  Paperclip,
  Star,
  Calendar
} from 'lucide-react';
import SearchInput from './common/SearchInput';
import Modal from './common/Modal';

const NoticeBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Dummy notices data
  const notices = [
    {
      id: 1,
      title: 'মাসিক সাধারণ সভা - ডিসেম্বর ২০২৪',
      content: 'আগামী ১৫ ডিসেম্বর ২০২৪ তারিখে সন্ধ্যা ৬টায় সমিতির মাসিক সাধারণ সভা অনুষ্ঠিত হবে। সকল সদস্যদের উপস্থিত থাকার জন্য অনুরোধ করা হচ্ছে।',
      category: 'meeting',
      priority: 'high',
      author: 'মোহাম্মদ রহিম উদ্দিন',
      authorRole: 'সভাপতি',
      publishDate: '2024-12-01',
      expiryDate: '2024-12-15',
      status: 'active',
      isPinned: true,
      views: 45,
      attachments: ['সভার_এজেন্ডা.pdf'],
      tags: ['সভা', 'মাসিক', 'উপস্থিতি']
    },
    {
      id: 2,
      title: 'ঈদ বোনাস বিতরণ সংক্রান্ত',
      content: 'আসন্ন ঈদুল ফিতর উপলক্ষে সমিতির সকল সদস্যদের মধ্যে বোনাস বিতরণ করা হবে। বিস্তারিত জানতে অফিসে যোগাযোগ করুন।',
      category: 'announcement',
      priority: 'medium',
      author: 'ফাতেমা খাতুন',
      authorRole: 'সাধারণ সম্পাদক',
      publishDate: '2024-11-28',
      expiryDate: '2024-12-20',
      status: 'active',
      isPinned: false,
      views: 32,
      attachments: [],
      tags: ['বোনাস', 'ঈদ', 'বিতরণ']
    },
    {
      id: 3,
      title: 'নতুন বিনিয়োগ প্রকল্প অনুমোদন',
      content: 'সমিতির পরিচালনা পর্ষদের সিদ্ধান্ত অনুযায়ী নতুন একটি বিনিয়োগ প্রকল্প অনুমোদন করা হয়েছে। এই প্রকল্পে ৫ লক্ষ টাকা বিনিয়োগ করা হবে।',
      category: 'decision',
      priority: 'high',
      author: 'আব্দুল কাদের',
      authorRole: 'কোষাধ্যক্ষ',
      publishDate: '2024-11-25',
      expiryDate: '2024-12-31',
      status: 'active',
      isPinned: true,
      views: 67,
      attachments: ['বিনিয়োগ_প্রস্তাব.pdf', 'আর্থিক_বিশ্লেষণ.xlsx'],
      tags: ['বিনিয়োগ', 'অনুমোদন', 'প্রকল্প']
    },
    {
      id: 4,
      title: 'অফিস বন্ধের তারিখ',
      content: 'আগামী ২৫ ডিসেম্বর থেকে ২ জানুয়ারি পর্যন্ত সমিতির অফিস বন্ধ থাকবে। জরুরি প্রয়োজনে মোবাইলে যোগাযোগ করুন।',
      category: 'information',
      priority: 'low',
      author: 'নাসির উদ্দিন আহমেদ',
      authorRole: 'সহকারী সম্পাদক',
      publishDate: '2024-11-20',
      expiryDate: '2025-01-03',
      status: 'active',
      isPinned: false,
      views: 28,
      attachments: [],
      tags: ['অফিস', 'বন্ধ', 'ছুটি']
    },
    {
      id: 5,
      title: 'মাসিক জমার হার বৃদ্ধি',
      content: 'আগামী জানুয়ারি ২০২৫ থেকে মাসিক জমার হার ১০০০ টাকা থেকে বৃদ্ধি করে ১২০০ টাকা করা হবে।',
      category: 'policy',
      priority: 'high',
      author: 'মোহাম্মদ রহিম উদ্দিন',
      authorRole: 'সভাপতি',
      publishDate: '2024-11-15',
      expiryDate: '2025-01-31',
      status: 'draft',
      isPinned: false,
      views: 15,
      attachments: ['নীতিমালা_সংশোধনী.pdf'],
      tags: ['জমা', 'হার', 'বৃদ্ধি']
    }
  ];

  // Categories
  const categories = [
    { value: 'all', label: 'সকল ক্যাটেগরি', icon: FileText },
    { value: 'meeting', label: 'সভা', icon: Users },
    { value: 'announcement', label: 'ঘোষণা', icon: Bell },
    { value: 'decision', label: 'সিদ্ধান্ত', icon: CheckCircle },
    { value: 'information', label: 'তথ্য', icon: AlertCircle },
    { value: 'policy', label: 'নীতিমালা', icon: FileText }
  ];

  // Priority levels
  const priorities = [
    { value: 'all', label: 'সকল অগ্রাধিকার' },
    { value: 'high', label: 'উচ্চ', color: 'text-red-600 bg-red-100' },
    { value: 'medium', label: 'মধ্যম', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'low', label: 'নিম্ন', color: 'text-green-600 bg-green-100' }
  ];

  // Filter notices
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || notice.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Sort notices (pinned first, then by date)
  const sortedNotices = filteredNotices.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.publishDate) - new Date(a.publishDate);
  });

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'announcement',
    priority: 'medium',
    expiryDate: '',
    isPinned: false,
    tags: '',
    attachments: []
  });

  const handleCreateNotice = () => {
    console.log('Creating notice:', newNotice);
    setShowCreateModal(false);
    setNewNotice({
      title: '',
      content: '',
      category: 'announcement',
      priority: 'medium',
      expiryDate: '',
      isPinned: false,
      tags: '',
      attachments: []
    });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-blue-600 bg-blue-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : FileText;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">নোটিশ বোর্ড</h1>
          <p className="text-gray-600 mt-1">সমিতির সকল নোটিশ ও ঘোষণা</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          নতুন নোটিশ
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">মোট নোটিশ</p>
              <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">সক্রিয় নোটিশ</p>
              <p className="text-2xl font-bold text-gray-900">{notices.filter(n => n.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Pin className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">পিন করা</p>
              <p className="text-2xl font-bold text-gray-900">{notices.filter(n => n.isPinned).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">শীঘ্রই মেয়াদ শেষ</p>
              <p className="text-2xl font-bold text-gray-900">{notices.filter(n => isExpiringSoon(n.expiryDate)).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নোটিশ খুঁজুন..."
              className="w-64"
            />

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredNotices.length} টি নোটিশ পাওয়া গেছে
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {sortedNotices.map((notice) => {
          const CategoryIcon = getCategoryIcon(notice.category);
          
          return (
            <div key={notice.id} className="bg-white rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {notice.isPinned && (
                      <Pin className="h-4 w-4 text-yellow-500" />
                    )}
                    <CategoryIcon className="h-5 w-5 text-gray-500" />
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notice.priority)}`}>
                      {priorities.find(p => p.value === notice.priority)?.label}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notice.status)}`}>
                      {notice.status === 'active' && 'সক্রিয়'}
                      {notice.status === 'draft' && 'খসড়া'}
                      {notice.status === 'expired' && 'মেয়াদ শেষ'}
                    </span>
                    {isExpiringSoon(notice.expiryDate) && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        শীঘ্রই মেয়াদ শেষ
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{notice.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {notice.author} ({notice.authorRole})
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(notice.publishDate)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {notice.views} বার দেখা হয়েছে
                      </div>
                      {notice.attachments.length > 0 && (
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 mr-1" />
                          {notice.attachments.length} টি ফাইল
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedNotice(notice);
                          setShowDetailsModal(true);
                        }}
                        className="text-primary hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-secondary hover:text-teal-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {notice.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {notice.tags.map((tag, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Notice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">নতুন নোটিশ তৈরি করুন</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleCreateNotice(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">নোটিশের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="নোটিশের শিরোনাম লিখুন"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">বিস্তারিত বিবরণ *</label>
                <textarea
                  required
                  rows={6}
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="নোটিশের বিস্তারিত বিবরণ লিখুন"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ক্যাটেগরি *</label>
                  <select
                    required
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({...newNotice, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {categories.filter(cat => cat.value !== 'all').map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">অগ্রাধিকার *</label>
                  <select
                    required
                    value={newNotice.priority}
                    onChange={(e) => setNewNotice({...newNotice, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {priorities.filter(p => p.value !== 'all').map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">মেয়াদ শেষের তারিখ</label>
                  <input
                    type="date"
                    value={newNotice.expiryDate}
                    onChange={(e) => setNewNotice({...newNotice, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ট্যাগ</label>
                <input
                  type="text"
                  value={newNotice.tags}
                  onChange={(e) => setNewNotice({...newNotice, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="কমা দিয়ে আলাদা করুন (যেমন: সভা, মাসিক, উপস্থিতি)"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={newNotice.isPinned}
                  onChange={(e) => setNewNotice({...newNotice, isPinned: e.target.checked})}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-900">
                  এই নোটিশটি পিন করুন (শীর্ষে রাখুন)
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  খসড়া হিসেবে সংরক্ষণ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                >
                  প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice Details Modal */}
      {showDetailsModal && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-gray-900">{selectedNotice.title}</h2>
                {selectedNotice.isPinned && (
                  <Pin className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Notice Meta Info */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedNotice.priority)}`}>
                    {priorities.find(p => p.value === selectedNotice.priority)?.label}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedNotice.status)}`}>
                    {selectedNotice.status === 'active' && 'সক্রিয়'}
                    {selectedNotice.status === 'draft' && 'খসড়া'}
                    {selectedNotice.status === 'expired' && 'মেয়াদ শেষ'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  লেখক: {selectedNotice.author} ({selectedNotice.authorRole})
                </div>
                <div className="text-sm text-gray-600">
                  প্রকাশিত: {formatDate(selectedNotice.publishDate)}
                </div>
                {selectedNotice.expiryDate && (
                  <div className="text-sm text-gray-600">
                    মেয়াদ শেষ: {formatDate(selectedNotice.expiryDate)}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  {selectedNotice.views} বার দেখা হয়েছে
                </div>
              </div>
              
              {/* Notice Content */}
              <div className="prose max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedNotice.content}
                </div>
              </div>
              
              {/* Attachments */}
              {selectedNotice.attachments.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">সংযুক্ত ফাইল</h4>
                  <div className="space-y-2">
                    {selectedNotice.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{attachment}</span>
                        </div>
                        <button className="text-primary hover:text-blue-600 text-sm">
                          ডাউনলোড
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {selectedNotice.tags.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">ট্যাগ</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNotice.tags.map((tag, index) => (
                      <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                বন্ধ করুন
              </button>
              <button className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-teal-600">
                সম্পাদনা করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;