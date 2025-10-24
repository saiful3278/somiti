import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, UserPlus, Eye, EyeOff, X, Phone, Mail, MapPin, Save, Loader2, DollarSign, User, Users, Crown, Info, Copy, Check, AlertTriangle, Shield, Lock, Download } from 'lucide-react';
import { MemberService } from '../firebase/memberService';
import SuccessAnimation from './common/SuccessAnimation';
import LoadingAnimation from './common/LoadingAnimation';

import '../styles/components/member-list.css';

import { registerUser } from '../api/auth';

const MemberList = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add New Member Modal states
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    phone: '',
    address: '',
    shareCount: '',
    nomineeName: '',
    nomineePhone: '',
    nomineeRelation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    role: 'member' // Default role is member
  });
  const [memberFormErrors, setMemberFormErrors] = useState({});
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  const [addMemberSucceeded, setAddMemberSucceeded] = useState(false);

  // Success Animation states
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successAnimationData, setSuccessAnimationData] = useState({
    title: '',
    message: '',
    type: 'success'
  });

  // Floating detail card states
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailCard, setShowDetailCard] = useState(false);

  // Copy functionality states
  const [copiedField, setCopiedField] = useState(null);

  // Handle member card click
  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowDetailCard(true);
  };

  // Close detail card
  const closeDetailCard = () => {
    setShowDetailCard(false);
    setSelectedMember(null);
  };

  // Copy to clipboard function
  const copyToClipboard = async (text, fieldType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldType);
      setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers or when clipboard API fails
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedField(fieldType);
        setTimeout(() => setCopiedField(null), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr);
      }
    }
  };

  // Fetch members from Firebase
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await MemberService.getActiveMembers();
      
      if (result.success) {
        const sortedMembers = result.data.sort((a, b) => {
          // Ensure we have valid dates
          const joiningDateA = a.joiningDate || a.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0];
          const joiningDateB = b.joiningDate || b.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0];
          
          const dateA = new Date(joiningDateA);
          const dateB = new Date(joiningDateB);
          
          // First sort by joining date
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
          }
          
          // If joining dates are same, sort by createdAt timestamp
          const createdA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
          const createdB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
          
          // If creation times are also same, sort by document ID for consistency
          if (createdA.getTime() === createdB.getTime()) {
            return a.id.localeCompare(b.id);
          }
          
          return createdA - createdB;
        });
        const membersWithSomitiId = sortedMembers.map((member, index) => ({
          ...member,
          somiti_user_id: index + 1,
        }));
        setMembers(membersWithSomitiId);
        setFilteredMembers(membersWithSomitiId);
      } else {
        setError(result.error);
        console.error('সদস্য তালিকা লোড করতে ত্রুটি:', result.error);
      }
    } catch (err) {
      setError('সদস্য তালিকা লোড করতে ত্রুটি হয়েছে');
      console.error('সদস্য তালিকা লোড করতে ত্রুটি:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Check if we should open the add member modal from navigation state
  useEffect(() => {
    console.log('MemberList navigation state:', location.state);
    if (location.state?.openAddMemberModal) {
      console.log('Opening add member modal from navigation');
      setShowAddMemberModal(true);
    }
  }, [location.state]);

  // Add New Member Form Functions
  const handleInputChange = (field, value) => {
    setNewMemberData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (memberFormErrors[field]) {
      setMemberFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newMemberData.name.trim()) {
      errors.name = 'নাম আবশ্যক';
    }
    
    // Phone validation - only if provided
    if (newMemberData.phone.trim() && !/^01[3-9]\d{8}$/.test(newMemberData.phone)) {
      errors.phone = 'সঠিক ফোন নম্বর দিন (01XXXXXXXXX)';
    }
    
    // Share count validation - only if provided
    if (newMemberData.shareCount.trim() && (isNaN(newMemberData.shareCount) || Number(newMemberData.shareCount) <= 0)) {
      errors.shareCount = 'সঠিক শেয়ার সংখ্যা দিন';
    }
    
    // Nominee phone validation - only if provided
    if (newMemberData.nomineePhone.trim() && !/^01[3-9]\d{8}$/.test(newMemberData.nomineePhone)) {
      errors.nomineePhone = 'সঠিক নমিনির ফোন নম্বর দিন';
    }
    
    return errors;
  };

  const handleSubmitNewMember = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setMemberFormErrors(errors);
      return;
    }
    
    try {
      setSaving(true);
      
      // Step 1: Generate credentials with new format
      const randomDigits = Math.floor(Math.random() * 900) + 100; // 100-999
      const firstName = newMemberData.name.split(' ')[0].toLowerCase();

      const credentials = {
        email: `${firstName}${randomDigits}@fulmurigram.com`,
        password: `${firstName}${randomDigits}@123`
      };
      
      console.log('Generated credentials:', credentials);

      // Step 2: Register user in the backend
      const registrationResponse = await registerUser(credentials.email, credentials.password);

      if (!registrationResponse.success) {
        throw new Error(registrationResponse.message || 'Backend registration failed');
      }

      const { user_id } = registrationResponse;
      console.log('✅ Backend registration successful, user_id:', user_id);

      // Step 3: Save member to Firestore with user_id as document ID
      const memberData = {
        name: newMemberData.name,
        phone: newMemberData.phone,
        address: newMemberData.address,
        shareCount: newMemberData.shareCount,
        nomineeName: newMemberData.nomineeName,
        nomineePhone: newMemberData.nomineePhone,
        nomineeRelation: newMemberData.nomineeRelation,
        joiningDate: newMemberData.joiningDate,
        role: newMemberData.role || 'member',
        email: credentials.email,
        password: credentials.password,
        user_id: user_id, // Save user_id from backend
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Use user_id as the document ID in Firestore
      const addResult = await MemberService.addMember(memberData, user_id);

      if (addResult && addResult.success) {
        setAddMemberSucceeded(true);
        setSuccessAnimationData({
          title: 'সফল!',
          message: `${memberData.name} সফলভাবে সদস্য হিসেবে যোগ হয়েছেন`,
          type: 'success'
        });
        setShowSuccessAnimation(true);
        // Reset form
        setNewMemberData({
          name: '',
          phone: '',
          address: '',
          shareCount: '',
          nomineeName: '',
          nomineePhone: '',
          nomineeRelation: '',
          joiningDate: new Date().toISOString().split('T')[0],
          role: 'member'
        });
        setMemberFormErrors({});
        
        // Reload members after success animation closes (handled in SuccessAnimation onClose)
      } else {
        console.error('সদস্য যোগ করতে ত্রুটি:', addResult?.error);
        setAddMemberSucceeded(false);
        setError('সদস্য যোগ করতে ত্রুটি হয়েছে');
      }
    } catch (error) {
      console.error('সদস্য যোগ করতে ত্রুটি:', error);
      setError(error.message || 'সদস্য যোগ করতে ত্রুটি হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddMemberModal(false);
    setMemberFormErrors({});
  };

  useEffect(() => {
    let filtered = members;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
      );
    }

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(member => member.role === selectedRole);
    }

    setFilteredMembers(filtered);
  }, [searchTerm, selectedRole, members]);

  const getRoleInfo = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'অ্যাডমিন', color: 'bg-red-100 text-red-800', icon: Crown };
      case 'cashier':
        return { label: 'ক্যাশিয়ার', color: 'bg-blue-100 text-blue-800', icon: DollarSign };
      case 'member':
        return { label: 'সদস্য', color: 'bg-green-100 text-green-800', icon: User };
      default:
        return { label: 'সদস্য', color: 'bg-gray-100 text-gray-800', icon: User };
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const filterOptions = [
    { value: 'all', label: 'সকল সদস্য', icon: Users },
    { value: 'admin', label: 'অ্যাডমিন', icon: Crown },
    { value: 'cashier', label: 'ক্যাশিয়ার', icon: DollarSign },
    { value: 'member', label: 'সদস্য', icon: User }
  ];

  // Debug logs for state changes - moved to top level
  useEffect(() => {
    console.log('showSuccessAnimation changed:', showSuccessAnimation);
    console.log('successAnimationData changed:', successAnimationData);
  }, [showSuccessAnimation, successAnimationData]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">ত্রুটি ঘটেছে</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchMembers}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="member-list-container">
      {/* Header */}
      <div className="member-list-header">
        <div className="member-list-header-content">
          <div>
            <h1 className="member-list-title">সদস্য তালিকা</h1>
            <p className="member-list-subtitle">সমিতির সকল সদস্যদের তথ্য</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'cashier') && (
            <button 
              className="add-member-btn"
              onClick={() => setShowAddMemberModal(true)}
            >
              <UserPlus className="h-5 w-5" />
              <span>নতুন সদস্য যোগ করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="member-search-container">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="সদস্যের নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="member-search-input pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="member-filter-buttons">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedRole(option.value)}
              className={`member-filter-btn flex items-center space-x-2 ${
                selectedRole === option.value ? 'active' : ''
              }`}
            >
              <option.icon className="h-4 w-4" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards - Single Column Layout */}
      <div className="member-cards-container">
        {loading ? (
          <LoadingAnimation />
        ) : (
          filteredMembers.map((member, index) => {
            const roleInfo = getRoleInfo(member.role);
            const RoleIcon = roleInfo.icon;
            const displayId = member.somiti_user_id;

            return (
              <div 
                key={member.id} 
                className="member-card member-card-minimal"
                onClick={() => handleMemberClick(member)}
              >
                <div className="member-serial-number">
                  #{displayId}
                </div>

                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="member-avatar"
                  />
                ) : (
                  <div className="member-avatar-placeholder">
                    {getInitials(member.name)}
                  </div>
                )}

                <div className="member-info">
                  <h3 className="member-name">
                    {member.name}
                  </h3>
                  
                  <div className="member-address">
                    <MapPin className="w-4 h-4" />
                    <span>{member.address || 'ঠিকানা যোগ করা হয়নি'}</span>
                  </div>
                  
                  <div className="member-details-row">
                    <div className="member-share-info">
                      <DollarSign className="w-4 h-4" />
                      <span>{member.shareCount} শেয়ার</span>
                    </div>
                    <span className={`member-role-badge ${member.role}`}>
                      <RoleIcon className="w-3 h-3" />
                      {roleInfo.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* No Results */}
      {filteredMembers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">কোনো সদস্য পাওয়া যায়নি</h3>
          <p className="mt-1 text-sm text-gray-500">
            অনুসন্ধানের শর্ত পরিবর্তন করে আবার চেষ্টা করুন।
          </p>
        </div>
      )}

      {/* Add New Member Modal */}
      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">
                <UserPlus size={20} />
                নতুন সদস্য যোগ করুন
              </h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseModal}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmitNewMember} className="modal-form">
                {/* Basic Information */}
                <div className="form-section">
                  <h3 className="form-section-title">
                    <User size={18} />
                    মূল তথ্য
                  </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">নাম *</label>
                    <input
                      type="text"
                      className={`form-input ${memberFormErrors.name ? 'error' : ''}`}
                      value={newMemberData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="সদস্যের নাম লিখুন"
                    />
                    {memberFormErrors.name && (
                      <span className="error-message">{memberFormErrors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={16} />
                      ফোন নম্বর (ঐচ্ছিক)
                    </label>
                    <input
                      type="tel"
                      className={`form-input ${memberFormErrors.phone ? 'error' : ''}`}
                      value={newMemberData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="01XXXXXXXXX (ঐচ্ছিক)"
                    />
                    {memberFormErrors.phone && (
                      <span className="error-message">{memberFormErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} />
                    ঠিকানা (ঐচ্ছিক)
                  </label>
                  <textarea
                    className={`form-textarea ${memberFormErrors.address ? 'error' : ''}`}
                    value={newMemberData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="সম্পূর্ণ ঠিকানা লিখুন (ঐচ্ছিক)"
                    rows="2"
                  />
                  {memberFormErrors.address && (
                    <span className="error-message">{memberFormErrors.address}</span>
                  )}
                </div>
              </div>

              {/* Role Selection - Only visible to Admin */}
              {user?.role === 'admin' && (
                <div className="form-section">
                  <h3 className="form-section-title">
                    <Crown size={18} />
                    ভূমিকা নির্বাচন
                  </h3>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <Crown size={16} />
                      সদস্যের ভূমিকা (ঐচ্ছিক)
                    </label>
                    <select
                      className={`form-select ${memberFormErrors.role ? 'error' : ''}`}
                      value={newMemberData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                    >
                      <option value="member">সদস্য</option>
                      <option value="cashier">ক্যাশিয়ার</option>
                      <option value="admin">অ্যাডমিন</option>
                    </select>
                    {memberFormErrors.role && (
                      <span className="error-message">{memberFormErrors.role}</span>
                    )}
                    <div className="role-info-minimal">
                       <div className="role-info-trigger">
                         <span className="role-info-label">ভূমিকা সম্পর্কে জানুন</span>
                         <button 
                           type="button"
                           className="role-info-toggle"
                           onClick={() => setShowRoleInfo(!showRoleInfo)}
                           aria-label="ভূমিকার বিস্তারিত তথ্য দেখুন"
                         >
                           <Info size={16} />
                         </button>
                       </div>
                       
                       {showRoleInfo && (
                         <div className="role-info-details">
                           <div className="role-descriptions">
                             <div className="role-item">
                               <span className="role-badge member">সদস্য</span>
                               <span className="role-desc">সাধারণ অ্যাক্সেস ও তথ্য দেখার সুবিধা</span>
                             </div>
                             <div className="role-item">
                               <span className="role-badge cashier">ক্যাশিয়ার</span>
                               <span className="role-desc">লেনদেন ব্যবস্থাপনা ও আর্থিক কার্যক্রম</span>
                             </div>
                             <div className="role-item">
                               <span className="role-badge admin">অ্যাডমিন</span>
                               <span className="role-desc">সম্পূর্ণ নিয়ন্ত্রণ ও ব্যবস্থাপনা অধিকার</span>
                             </div>
                           </div>
                         </div>
                       )}
                     </div>
                  </div>
                </div>
              )}

                {/* Share Information */}
                <div className="form-section">
                  <h3 className="form-section-title">
                    <DollarSign size={18} />
                    শেয়ার তথ্য
                  </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <DollarSign size={16} />
                      শেয়ার সংখ্যা (ঐচ্ছিক)
                    </label>
                    <input
                      type="number"
                      className={`form-input ${memberFormErrors.shareCount ? 'error' : ''}`}
                      value={newMemberData.shareCount}
                      onChange={(e) => handleInputChange('shareCount', e.target.value)}
                      placeholder="কতটি শেয়ার কিনেছেন"
                      min="1"
                    />
                    {memberFormErrors.shareCount && (
                      <span className="error-message">{memberFormErrors.shareCount}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">যোগদানের তারিখ (ঐচ্ছিক)</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newMemberData.joiningDate}
                      onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>

                {/* Nominee Information */}
                <div className="form-section">
                  <h3 className="form-section-title">
                    <Users size={18} />
                    নমিনি তথ্য
                  </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      নমিনির নাম (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      className={`form-input ${memberFormErrors.nomineeName ? 'error' : ''}`}
                      value={newMemberData.nomineeName}
                      onChange={(e) => handleInputChange('nomineeName', e.target.value)}
                      placeholder="নমিনির নাম লিখুন (ঐচ্ছিক)"
                    />
                    {memberFormErrors.nomineeName && (
                      <span className="error-message">{memberFormErrors.nomineeName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={16} />
                      নমিনির ফোন (ঐচ্ছিক)
                    </label>
                    <input
                      type="tel"
                      className={`form-input ${memberFormErrors.nomineePhone ? 'error' : ''}`}
                      value={newMemberData.nomineePhone}
                      onChange={(e) => handleInputChange('nomineePhone', e.target.value)}
                      placeholder="01XXXXXXXXX (ঐচ্ছিক)"
                    />
                    {memberFormErrors.nomineePhone && (
                      <span className="error-message">{memberFormErrors.nomineePhone}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">নমিনির সাথে সম্পর্ক (ঐচ্ছিক)</label>
                  <select
                    className={`form-select ${memberFormErrors.nomineeRelation ? 'error' : ''}`}
                    value={newMemberData.nomineeRelation}
                    onChange={(e) => handleInputChange('nomineeRelation', e.target.value)}
                  >
                    <option value="">সম্পর্ক নির্বাচন করুন (ঐচ্ছিক)</option>
                    <option value="পিতা">পিতা</option>
                    <option value="মাতা">মাতা</option>
                    <option value="স্বামী">স্বামী</option>
                    <option value="স্ত্রী">স্ত্রী</option>
                    <option value="ভাই">ভাই</option>
                    <option value="বোন">বোন</option>
                    <option value="ছেলে">ছেলে</option>
                    <option value="মেয়ে">মেয়ে</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                  {memberFormErrors.nomineeRelation && (
                    <span className="error-message">{memberFormErrors.nomineeRelation}</span>
                  )}
                </div>
              </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button
                    type="button"
                    className="form-btn form-btn-cancel"
                    onClick={handleCloseModal}
                  >
                    <X size={16} />
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="form-btn form-btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        সংরক্ষণ করা হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        সংরক্ষণ করুন
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Member Detail Card */}
      {showDetailCard && selectedMember && (
        <div className="member-detail-overlay" onClick={closeDetailCard}>
          <div className="member-detail-card" onClick={(e) => e.stopPropagation()}>
            <div className="member-detail-header">
              <div className="member-detail-avatar">
                {selectedMember.avatar ? (
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="member-detail-avatar-img"
                  />
                ) : (
                  <div className="member-detail-avatar-placeholder">
                    {getInitials(selectedMember.name)}
                  </div>
                )}
              </div>
              <div className="member-detail-info">
                <h3 className="member-detail-name">{selectedMember.name}</h3>
                <span className={`member-detail-role-badge ${selectedMember.role}`}>
                  {getRoleInfo(selectedMember.role).label}
                </span>
              </div>
              <button className="member-detail-close" onClick={closeDetailCard}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="member-detail-content">
              {/* Login Credentials */}
              {(user?.role === 'admin' || user?.role === 'cashier') && (
                <div className="member-detail-section">
                  <h4 className="member-detail-section-title">
                    <Lock className="w-4 h-4" />
                    লগইন তথ্য
                  </h4>
                  <div className="member-detail-grid">
                    <div className="member-detail-item">
                      <span className="member-detail-label">ইমেইল:</span>
                      <div className="member-detail-value-with-copy">
                        <span className="member-detail-value code">{selectedMember.email}</span>
                        <button
                          className="copy-btn"
                          onClick={() => copyToClipboard(selectedMember.email, 'email')}
                          title="ইমেইল কপি করুন"
                        >
                          {copiedField === 'email' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="member-detail-item">
                      <span className="member-detail-label">পাসওয়ার্ড:</span>
                      <div className="member-detail-value-with-copy">
                        <span className="member-detail-value code">{selectedMember.password}</span>
                        <button
                          className="copy-btn"
                          onClick={() => copyToClipboard(selectedMember.password, 'password')}
                          title="পাসওয়ার্ড কপি করুন"
                        >
                          {copiedField === 'password' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="member-detail-section">
                <h4 className="member-detail-section-title">
                  <Phone className="w-4 h-4" />
                  যোগাযোগের তথ্য
                </h4>
                <div className="member-detail-grid">
                  <div className="member-detail-item">
                    <span className="member-detail-label">ফোন:</span>
                    <span className="member-detail-value">{selectedMember.phone}</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="member-detail-label">ঠিকানা:</span>
                    <span className="member-detail-value">{selectedMember.address}</span>
                  </div>
                </div>
              </div>

              <div className="member-detail-section">
                <h4 className="member-detail-section-title">
                  <DollarSign className="w-4 h-4" />
                  শেয়ার তথ্য
                </h4>
                <div className="member-detail-grid">
                  <div className="member-detail-item">
                    <span className="member-detail-label">মোট শেয়ার:</span>
                    <span className="member-detail-value">{selectedMember.shareCount} টি</span>
                  </div>
                  <div className="member-detail-item">
                    <span className="member-detail-label">যোগদানের তারিখ:</span>
                    <span className="member-detail-value">
                      {new Date(selectedMember.joinDate).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                </div>
                
                {/* Share Progress Bar */}
                <div className="member-detail-progress">
                  <div className="member-detail-progress-header">
                    <span>শেয়ার অগ্রগতি</span>
                    <span className="member-detail-progress-percentage">
                      {Math.min(100, (selectedMember.shareCount / 200) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="member-detail-progress-bar">
                    <div
                      className="member-detail-progress-fill"
                      style={{ width: `${Math.min(100, (selectedMember.shareCount / 200) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {selectedMember.nomineeName && (
                <div className="member-detail-section">
                  <h4 className="member-detail-section-title">
                    <Users className="w-4 h-4" />
                    নমিনি তথ্য
                  </h4>
                  <div className="member-detail-grid">
                    <div className="member-detail-item">
                      <span className="member-detail-label">নমিনির নাম:</span>
                      <span className="member-detail-value">{selectedMember.nomineeName}</span>
                    </div>
                    <div className="member-detail-item">
                      <span className="member-detail-label">সম্পর্ক:</span>
                      <span className="member-detail-value">{selectedMember.nomineeRelation}</span>
                    </div>
                    <div className="member-detail-item">
                      <span className="member-detail-label">ফোন:</span>
                      <span className="member-detail-value">{selectedMember.nomineePhone}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Animation */}
      <SuccessAnimation
        isVisible={showSuccessAnimation}
        onClose={() => {
          setShowSuccessAnimation(false);
          fetchMembers();
        }}
        title={successAnimationData.title}
        message={successAnimationData.message}
        type={successAnimationData.type}
        autoClose={true}
        duration={3000}
      />
    </div>
  );
};

export default MemberList;