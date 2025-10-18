import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  MoreVertical,
  Loader2
} from 'lucide-react';
import SearchInput from './common/SearchInput';
import TableHeader from './common/TableHeader';
import Modal from './common/Modal';
import { MemberService } from '../firebase';

const MemberManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Firebase integrated member data
  const [members, setMembers] = useState([]);

  const [newMember, setNewMember] = useState({
    name: '',
    fatherName: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    nid: '',
    emergencyContact: '',
    monthlyDeposit: '',
  });

  // Load members from Firebase on component mount
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const result = await MemberService.getAllMembers();
      if (result.success) {
        setMembers(result.data);
      } else {
        console.error('সদস্য তালিকা লোড করতে ত্রুটি:', result.error);
        // Fallback to dummy data if Firebase fails
        setMembers([
          {
            id: 'dummy-1',
            name: 'মোহাম্মদ রহিম উদ্দিন',
            fatherName: 'আব্দুল করিম',
            phone: '০১৭১২৩৪৫৬৭২',
            email: 'rahim@email.com',
            address: 'ধানমন্ডি, ঢাকা',
            joinDate: '২০২৩-০১-১৫',
            membershipId: 'SM-001',
            status: 'active',
            totalShares: 50,
            monthlyDeposit: 2000,
            totalDeposit: 125000,
            occupation: 'ব্যবসায়ী',
            nid: '১২৩৪৫৬৭৮৯০',
            emergencyContact: '০১৮১২৩৪৫৬৭৮',
          }
        ]);
      }
    } catch (error) {
      console.error('সদস্য তালিকা লোড করতে ত্রুটি:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter members based on search and status
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.membershipId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone?.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddMember = async () => {
    setSaving(true);
    try {
      const membershipId = `SM-${String(members.length + 1).padStart(3, '0')}`;
      const newMemberData = {
        ...newMember,
        membershipId,
        joinDate: new Date().toISOString().split('T')[0],
        totalShares: 0,
        totalDeposit: 0,
      };
      
      const result = await MemberService.addMember(newMemberData);
      if (result.success) {
        await loadMembers(); // Reload members list
        setNewMember({
          name: '',
          fatherName: '',
          phone: '',
          email: '',
          address: '',
          occupation: '',
          nid: '',
          emergencyContact: '',
          monthlyDeposit: '',
        });
        setShowAddModal(false);
        alert('সদস্য সফলভাবে যোগ করা হয়েছে!');
      } else {
        alert('সদস্য যোগ করতে ত্রুটি: ' + result.error);
      }
    } catch (error) {
      console.error('সদস্য যোগ করতে ত্রুটি:', error);
      alert('সদস্য যোগ করতে ত্রুটি হয়েছে!');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই সদস্যকে মুছে ফেলতে চান?')) {
      try {
        const result = await MemberService.deleteMember(id);
        if (result.success) {
          await loadMembers(); // Reload members list
          alert('সদস্য সফলভাবে মুছে ফেলা হয়েছে!');
        } else {
          alert('সদস্য মুছতে ত্রুটি: ' + result.error);
        }
      } catch (error) {
        console.error('সদস্য মুছতে ত্রুটি:', error);
        alert('সদস্য মুছতে ত্রুটি হয়েছে!');
      }
    }
  };

  const toggleMemberStatus = async (id, currentStatus) => {
    try {
      const result = await MemberService.toggleMemberStatus(id, currentStatus);
      if (result.success) {
        await loadMembers(); // Reload members list
        alert('সদস্যের অবস্থা সফলভাবে পরিবর্তন করা হয়েছে!');
      } else {
        alert('অবস্থা পরিবর্তন করতে ত্রুটি: ' + result.error);
      }
    } catch (error) {
      console.error('অবস্থা পরিবর্তন করতে ত্রুটি:', error);
      alert('অবস্থা পরিবর্তন করতে ত্রুটি হয়েছে!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">সদস্য তালিকা লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="section-title gradient">সদস্য ব্যবস্থাপনা</h1>
          <p className="text-gray-600 mt-1">সমিতির সকল সদস্যের তথ্য ব্যবস্থাপনা ও নিয়ন্ত্রণ</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary btn-modern flex items-center"
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          নতুন সদস্য যোগ করুন
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="modern-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">মোট সদস্য</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
          </div>
        </div>
        <div className="modern-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">সক্রিয় সদস্য</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="modern-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">নিষ্ক্রিয় সদস্য</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
        <div className="modern-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">মোট জমা</p>
              <p className="text-2xl font-bold text-gray-900">
                ৳ {members.reduce((sum, m) => sum + m.totalDeposit, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="modern-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম, আইডি বা ফোন নম্বর দিয়ে খুঁজুন..."
              className="w-64"
            />
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
              >
                <option value="all">সব সদস্য</option>
                <option value="active">সক্রিয় সদস্য</option>
                <option value="inactive">নিষ্ক্রিয় সদস্য</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            মোট {filteredMembers.length} জন সদস্য পাওয়া গেছে
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="modern-card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader 
              columns={[
                'সদস্যের তথ্য',
                'যোগাযোগ', 
                'আর্থিক তথ্য',
                'অবস্থা',
                'কার্যক্রম'
              ]}
            />
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">আইডি: {member.membershipId}</div>
                      <div className="text-sm text-gray-500">যোগদান: {member.joinDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {member.phone}
                      </div>
                      <div className="flex items-center mb-1">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {member.email}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {member.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>শেয়ার: {member.totalShares}</div>
                      <div>মাসিক জমা: ৳ {member.monthlyDeposit.toLocaleString()}</div>
                      <div>মোট জমা: ৳ {member.totalDeposit.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="বিস্তারিত দেখুন"
                        disabled={saving}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                          onClick={() => toggleMemberStatus(member.id)}
                          className={`flex items-center ${
                            member.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          } disabled:opacity-50`}
                          title={member.status === 'active' ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                          disabled={saving}
                        >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          member.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        title="সম্পাদনা করুন"
                        disabled={saving}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                          onClick={() => deleteMember(member.id)}
                          className="text-red-600 hover:text-red-900 flex items-center disabled:opacity-50"
                          title="মুছে ফেলুন"
                          disabled={saving}
                        >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 modal-title-styled">নতুন সদস্য যোগ করুন</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAddMember(); }} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">নাম *</label>
                  <input
                    type="text"
                    required
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">পিতার নাম *</label>
                  <input
                    type="text"
                    required
                    value={newMember.fatherName}
                    onChange={(e) => setNewMember({...newMember, fatherName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">পেশা</label>
                  <input
                    type="text"
                    value={newMember.occupation}
                    onChange={(e) => setNewMember({...newMember, occupation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">জাতীয় পরিচয়পত্র</label>
                  <input
                    type="text"
                    value={newMember.nid}
                    onChange={(e) => setNewMember({...newMember, nid: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">জরুরি যোগাযোগ</label>
                  <input
                    type="tel"
                    value={newMember.emergencyContact}
                    onChange={(e) => setNewMember({...newMember, emergencyContact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">মাসিক জমা (৳)</label>
                  <input
                    type="number"
                    value={newMember.monthlyDeposit}
                    onChange={(e) => setNewMember({...newMember, monthlyDeposit: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা *</label>
                <textarea
                  required
                  rows={3}
                  value={newMember.address}
                  onChange={(e) => setNewMember({...newMember, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      যোগ করা হচ্ছে...
                    </>
                  ) : (
                    'সদস্য যোগ করুন'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {showDetailsModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">সদস্যের বিস্তারিত তথ্য</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ব্যক্তিগত তথ্য</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">নাম:</span>
                      <p className="text-sm text-gray-900">{selectedMember.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">পিতার নাম:</span>
                      <p className="text-sm text-gray-900">{selectedMember.fatherName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">সদস্য আইডি:</span>
                      <p className="text-sm text-gray-900">{selectedMember.membershipId}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">যোগদানের তারিখ:</span>
                      <p className="text-sm text-gray-900">{selectedMember.joinDate}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">পেশা:</span>
                      <p className="text-sm text-gray-900">{selectedMember.occupation}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">জাতীয় পরিচয়পত্র:</span>
                      <p className="text-sm text-gray-900">{selectedMember.nid}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">যোগাযোগের তথ্য</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">ফোন নম্বর:</span>
                      <p className="text-sm text-gray-900">{selectedMember.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">ইমেইল:</span>
                      <p className="text-sm text-gray-900">{selectedMember.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">ঠিকানা:</span>
                      <p className="text-sm text-gray-900">{selectedMember.address}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">জরুরি যোগাযোগ:</span>
                      <p className="text-sm text-gray-900">{selectedMember.emergencyContact}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">অবস্থা:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedMember.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedMember.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">আর্থিক তথ্য</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-600">মোট শেয়ার</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedMember.totalShares}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-600">মাসিক জমা</p>
                    <p className="text-2xl font-bold text-green-900">৳ {selectedMember.monthlyDeposit.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-purple-600">মোট জমা</p>
                    <p className="text-2xl font-bold text-purple-900">৳ {selectedMember.totalDeposit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                বন্ধ করুন
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600">
                সম্পাদনা করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;