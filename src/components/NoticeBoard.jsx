import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
import LoadingAnimation from './common/LoadingAnimation';
import { NoticeService } from '../firebase/noticeService';
import '../styles/components/notice.css';

const NoticeBoard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pinned: 0,
    expiring: 0
  });

  // New notice form state
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'announcement',
    priority: 'medium',
    expiryDate: '',
    tags: '',
    isPinned: false,
    attachments: []
  });

  useEffect(() => {
    console.log('NoticeBoard mounted', { role: user?.role });
    loadNotices();
    loadStats();
  }, []);

  // Load all notices from Firestore
  const loadNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await NoticeService.getAllNotices();
      if (result.success) {
        setNotices(result.data);
      } else {
        setError(result.error);
        console.error('Failed to load notices:', result.error);
      }
    } catch (err) {
      setError('নোটিশ লোড করতে সমস্যা হয়েছে');
      console.error('Error loading notices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const result = await NoticeService.getNoticesStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  // Handle creating new notice
  const handleCreateNotice = async () => {
    try {
      const noticeData = {
        ...newNotice,
        tags: newNotice.tags ? newNotice.tags.split(',').map(tag => tag.trim()) : [],
        author: 'বর্তমান ব্যবহারকারী', // This should come from auth context
        authorRole: 'সদস্য', // This should come from user profile
        attachments: newNotice.attachments || []
      };

      const result = await NoticeService.addNotice(noticeData);
      if (result.success) {
        setShowCreateModal(false);
        setNewNotice({
          title: '',
          content: '',
          category: 'announcement',
          priority: 'medium',
          expiryDate: '',
          tags: '',
          isPinned: false,
          attachments: []
        });
        // Reload notices and stats
        await loadNotices();
        await loadStats();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('নোটিশ তৈরি করতে সমস্যা হয়েছে');
      console.error('Error creating notice:', err);
    }
  };

  // Handle notice view increment
  const handleNoticeView = async (notice) => {
    try {
      await NoticeService.incrementViews(notice.id);
      setSelectedNotice({...notice, views: (notice.views || 0) + 1});
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error incrementing views:', err);
      setSelectedNotice(notice);
      setShowDetailsModal(true);
    }
  };

  // Handle delete notice
  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) {
      try {
        const result = await NoticeService.deleteNotice(noticeId);
        if (result.success) {
          await loadNotices();
          await loadStats();
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('নোটিশ মুছতে সমস্যা হয়েছে');
        console.error('Error deleting notice:', err);
      }
    }
  };

  // Handle toggle pin
  const handleTogglePin = async (notice) => {
    try {
      const result = await NoticeService.togglePin(notice.id, notice.isPinned);
      if (result.success) {
        await loadNotices();
        await loadStats();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('পিন স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে');
      console.error('Error toggling pin:', err);
    }
  };

  // Categories
  const categories = [
    { value: 'all', label: 'সকল বিভাগ' },
    { value: 'announcement', label: 'ঘোষণা', icon: Bell },
    { value: 'meeting', label: 'সভা', icon: Users },
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
    return new Date(b.publishDate || b.createdAt) - new Date(a.publishDate || a.createdAt);
  });

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
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.icon : Bell;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'তারিখ নেই';
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD');
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewNotice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  if (loading) {
    return (
      <div className="notice-board">
        <div className="notice-loading">
          <LoadingAnimation />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notice-board">
        <div className="notice-error">
          <AlertCircle size={48} />
          <h3>ত্রুটি ঘটেছে</h3>
          <p>{error}</p>
          <button onClick={loadNotices} className="retry-button">
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-board">
      <div className="notice-board__container">
        
        {/* Page Header */}
        <div className="notice-board__header">
          <div>
            <h1 className="notice-board__title">নোটিশ বোর্ড</h1>
            <p className="notice-board__subtitle">সমিতির সকল নোটিশ ও ঘোষণা</p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="notice-board__create-btn"
            >
              <Plus size={16} />
              নতুন নোটিশ
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="notice-board__summary">
          <div className="summary-card">
            <div className="summary-card__icon summary-card__icon--total">
              <FileText size={20} />
            </div>
            <div className="summary-card__content">
              <h3>{stats.total}</h3>
              <p>মোট নোটিশ</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-card__icon summary-card__icon--active">
              <CheckCircle size={20} />
            </div>
            <div className="summary-card__content">
              <h3>{stats.active}</h3>
              <p>সক্রিয় নোটিশ</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-card__icon summary-card__icon--pinned">
              <Pin size={20} />
            </div>
            <div className="summary-card__content">
              <h3>{stats.pinned}</h3>
              <p>পিন করা নোটিশ</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="summary-card__icon summary-card__icon--expiring">
              <Clock size={20} />
            </div>
            <div className="summary-card__content">
              <h3>{stats.expiring}</h3>
              <p>শীঘ্রই মেয়াদ শেষ</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="notice-board__filters">
          <div className="filters-row">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="নোটিশ খুঁজুন..."
              className="search-input"
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="filter-select"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notices List */}
        <div className="notice-board__content">
          {sortedNotices.length === 0 ? (
            <div className="notice-board__empty">
              <FileText size={48} />
              <h3>কোন নোটিশ পাওয়া যায়নি</h3>
              <p>আপনার অনুসন্ধানের সাথে মিলে এমন কোন নোটিশ নেই।</p>
            </div>
          ) : (
            <div className="notices-grid">
              {sortedNotices.map(notice => {
                const CategoryIcon = getCategoryIcon(notice.category);
                return (
                  <div key={notice.id} className="notice-card">
                    {notice.isPinned && (
                      <div className="notice-card__pin">
                        <Pin size={14} />
                      </div>
                    )}
                    
                    <div className="notice-card__header">
                      <div className="notice-card__category">
                        <CategoryIcon size={16} />
                        <span>{categories.find(cat => cat.value === notice.category)?.label}</span>
                      </div>
                      
                      <div className="notice-card__actions">
                        <button
                          onClick={() => handleTogglePin(notice)}
                          className={`action-btn ${notice.isPinned ? 'action-btn--pinned' : ''}`}
                          title={notice.isPinned ? 'আনপিন করুন' : 'পিন করুন'}
                        >
                          <Pin size={14} />
                        </button>
                        <button
                          onClick={() => handleNoticeView(notice)}
                          className="action-btn"
                          title="বিস্তারিত দেখুন"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="action-btn action-btn--danger"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="notice-card__content">
                      <h3 className="notice-card__title">{notice.title}</h3>
                      <p className="notice-card__excerpt">
                        {notice.content.length > 120 
                          ? notice.content.substring(0, 120) + '...' 
                          : notice.content}
                      </p>
                    </div>
                    
                    <div className="notice-card__meta">
                      <div className="notice-meta">
                        <span className="notice-meta__author">{notice.author}</span>
                        <span className="notice-meta__role">({notice.authorRole})</span>
                      </div>
                      <div className="notice-meta">
                        <span className="notice-meta__date">
                          {formatDate(notice.publishDate || notice.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="notice-card__footer">
                      <div className="notice-badges">
                        <span className={`priority-badge priority-badge--${notice.priority}`}>
                          {priorities.find(p => p.value === notice.priority)?.label}
                        </span>
                        <span className={`status-badge status-badge--${notice.status}`}>
                          {notice.status === 'active' ? 'সক্রিয়' : 
                           notice.status === 'draft' ? 'খসড়া' : 'মেয়াদ শেষ'}
                        </span>
                      </div>
                      
                      <div className="notice-stats">
                        <span className="notice-stats__views">
                          <Eye size={12} />
                          {notice.views || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Notice Modal */}
      {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)}>
            <div className="modal__content">
              <div className="modal__header">
                <h2 className="modal__title">নতুন নোটিশ তৈরি করুন</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="modal__close"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleCreateNotice(); }} className="modal__form">
                <div className="form-group">
                  <label className="form-label">নোটিশের শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    value={newNotice.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="form-input"
                    placeholder="নোটিশের শিরোনাম লিখুন"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">বিস্তারিত বিবরণ *</label>
                  <textarea
                    required
                    value={newNotice.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="form-textarea"
                    placeholder="নোটিশের বিস্তারিত বিবরণ লিখুন"
                    rows="4"
                  />
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">বিভাগ *</label>
                    <select
                      required
                      value={newNotice.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="form-select"
                    >
                      {categories.filter(cat => cat.value !== 'all').map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">অগ্রাধিকার *</label>
                    <select
                      required
                      value={newNotice.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="form-select"
                    >
                      {priorities.filter(p => p.value !== 'all').map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">মেয়াদ শেষের তারিখ</label>
                    <input
                      type="date"
                      value={newNotice.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">ট্যাগসমূহ</label>
                    <input
                      type="text"
                      value={newNotice.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="form-input"
                      placeholder="কমা দিয়ে আলাদা করুন"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-checkbox">
                    <input
                      type="checkbox"
                      checked={newNotice.isPinned}
                      onChange={(e) => handleInputChange('isPinned', e.target.checked)}
                    />
                    <span className="checkbox-label">এই নোটিশটি পিন করুন</span>
                  </label>
                </div>
                
                <div className="modal__actions">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn btn--secondary"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="btn btn--primary"
                  >
                    <Send size={16} />
                    নোটিশ প্রকাশ করুন
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        )}

      {/* Notice Details Modal */}
      {showDetailsModal && selectedNotice && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <div className="modal__content modal__content--large">
              <div className="modal__header">
                <h2 className="modal__title">{selectedNotice.title}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="modal__close"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="notice-details">
                <div className="notice-details__meta">
                  <div className="notice-meta-grid">
                    <div className="meta-item">
                      <span className="meta-label">লেখক:</span>
                      <span className="meta-value">{selectedNotice.author} ({selectedNotice.authorRole})</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">প্রকাশের তারিখ:</span>
                      <span className="meta-value">{formatDate(selectedNotice.publishDate || selectedNotice.createdAt)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">বিভাগ:</span>
                      <span className="meta-value">{categories.find(cat => cat.value === selectedNotice.category)?.label}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">অগ্রাধিকার:</span>
                      <span className={`priority-badge priority-badge--${selectedNotice.priority}`}>
                        {priorities.find(p => p.value === selectedNotice.priority)?.label}
                      </span>
                    </div>
                    {selectedNotice.expiryDate && (
                      <div className="meta-item">
                        <span className="meta-label">মেয়াদ শেষ:</span>
                        <span className="meta-value">{formatDate(selectedNotice.expiryDate)}</span>
                      </div>
                    )}
                    <div className="meta-item">
                      <span className="meta-label">দেখা হয়েছে:</span>
                      <span className="meta-value">{selectedNotice.views || 0} বার</span>
                    </div>
                  </div>
                </div>
                
                <div className="notice-details__content">
                  <h3>বিস্তারিত বিবরণ</h3>
                  <div className="notice-content">
                    {selectedNotice.content}
                  </div>
                </div>
                
                {selectedNotice.tags && selectedNotice.tags.length > 0 && (
                  <div className="notice-details__tags">
                    <h4>ট্যাগসমূহ</h4>
                    <div className="tags-list">
                      {selectedNotice.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                  <div className="notice-details__attachments">
                    <h4>সংযুক্তি</h4>
                    <div className="attachments-list">
                      {selectedNotice.attachments.map((attachment, index) => (
                        <div key={index} className="attachment-item">
                          <Paperclip size={16} />
                          <span>{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
    </div>
  );
};

export default NoticeBoard;