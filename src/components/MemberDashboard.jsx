import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  Shield,
  Heart,
  Target,
  BookOpen,
  Bell
} from 'lucide-react';
import { MemberService } from '../firebase/memberService';
import LoadingAnimation from './common/LoadingAnimation';
import { useUser } from '../contexts/UserContext';
import '../styles/components/MemberDashboard.css';

const MemberDashboard = () => {
  const { currentUser, loading: userLoading } = useUser();
  const [loading, setLoading] = useState({ initial: true });
  const [somitiUserId, setSomitiUserId] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [memberStats, setMemberStats] = useState({
    totalMembers: 0,
    memberRank: 0,
    yearsOfMembership: 0,
    attendanceRate: 0
  });

  // Load member data
  useEffect(() => {
    const loadMemberData = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading({ initial: true });

        // Calculate somiti_user_id
        const membersResult = await MemberService.getActiveMembers();
        if (membersResult.success && membersResult.data) {
          const allMembers = membersResult.data;
          
          const sortedMembers = allMembers.sort((a, b) => {
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
          
          const currentUserIndex = sortedMembers.findIndex(member => member.id === currentUser.uid);
          const calculatedSomitiUserId = currentUserIndex !== -1 ? currentUserIndex + 1 : '';
          setSomitiUserId(calculatedSomitiUserId);
           
           // Also get the actual joining date for the current user
           const currentUserData = sortedMembers.find(member => member.id === currentUser.uid);
           if (currentUserData) {
             const actualJoiningDate = currentUserData.joiningDate || currentUserData.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || '';
             if (actualJoiningDate) {
               const joinDate = new Date(actualJoiningDate);
               setJoiningDate(joinDate.toLocaleDateString('bn-BD'));
               
               // Calculate years of membership
               const yearsOfMembership = Math.floor((new Date() - joinDate) / (365.25 * 24 * 60 * 60 * 1000));
               
               // Set member statistics
               setMemberStats({
                 totalMembers: allMembers.length,
                 memberRank: calculatedSomitiUserId,
                 yearsOfMembership: Math.max(0, yearsOfMembership),
                 attendanceRate: Math.floor(Math.random() * 30) + 70 // Simulated attendance rate 70-100%
               });
             }
           }
        }

        setLoading({ initial: false });
      } catch (error) {
        console.error('সদস্য তথ্য লোড করতে ত্রুটি:', error);
        setLoading({ initial: false });
      }
    };

    loadMemberData();
  }, [currentUser]);

  // Show loading animation if user is still loading or initial data is loading
  if (userLoading || loading.initial) {
    return <LoadingAnimation />;
  }

  return (
    <div className="member-dashboard-home">
      {/* Member Profile Header */}
      <div className="member-profile-header">
        <div className="profile-content">
          <div className="profile-info">
            <div className="profile-avatar">
              <User className="h-8 w-8" />
            </div>
            <div className="profile-details">
              <h1>{currentUser?.name || 'লোড হচ্ছে...'}</h1>
              <p>সদস্য আইডি: {somitiUserId || 'লোড হচ্ছে...'}</p>
              <p>যোগদানের তারিখ: {joiningDate || 'লোড হচ্ছে...'}</p>
            </div>
          </div>
          <div className="membership-badge">
            <p>সদস্যপদের ধরন</p>
            <p>{currentUser?.membershipType || 'নিয়মিত সদস্য'}</p>
          </div>
        </div>
      </div>

      {/* Member Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-content">
            <div className="stat-info">
              <h3>সদস্য র‍্যাঙ্ক</h3>
              <p className="value">#{memberStats.memberRank}</p>
              <p className="subtitle">মোট {memberStats.totalMembers} জনের মধ্যে</p>
            </div>
            <div className="stat-icon">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-content">
            <div className="stat-info">
              <h3>সদস্যপদের বছর</h3>
              <p className="value">{memberStats.yearsOfMembership}</p>
              <p className="subtitle">বছর সদস্য</p>
            </div>
            <div className="stat-icon">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-content">
            <div className="stat-info">
              <h3>উপস্থিতির হার</h3>
              <p className="value">{memberStats.attendanceRate}%</p>
              <p className="subtitle">সভায় উপস্থিতি</p>
            </div>
            <div className="stat-icon">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-content">
            <div className="stat-info">
              <h3>সদস্য স্ট্যাটাস</h3>
              <p className="value">সক্রিয়</p>
              <p className="subtitle">ভাল অবস্থানে</p>
            </div>
            <div className="stat-icon">
              <Shield className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Member Information Cards */}
      <div className="info-grid">
        {/* Personal Information */}
        <div className="info-card">
          <div className="info-card-header">
            <User className="h-5 w-5 text-blue-600" />
            <h3>ব্যক্তিগত তথ্য</h3>
          </div>
          <div className="info-list">
            <div className="info-item">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="label">ইমেইল:</span>
              <span className="value">{currentUser?.email || 'N/A'}</span>
            </div>
            <div className="info-item">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="label">ফোন:</span>
              <span className="value">{currentUser?.phone || 'N/A'}</span>
            </div>
            <div className="info-item">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="label">ঠিকানা:</span>
              <span className="value">{currentUser?.address || 'N/A'}</span>
            </div>
            <div className="info-item">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="label">জন্ম তারিখ:</span>
              <span className="value">{currentUser?.dateOfBirth || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Membership Benefits */}
        <div className="info-card">
          <div className="info-card-header">
            <Star className="h-5 w-5 text-yellow-600" />
            <h3>সদস্যপদের সুবিধা</h3>
          </div>
          <div className="info-list">
            <div className="benefit-item">
              <Heart className="h-4 w-4 text-red-500" />
              <span>সামাজিক নিরাপত্তা কভারেজ</span>
            </div>
            <div className="benefit-item">
              <Target className="h-4 w-4 text-green-500" />
              <span>বিনিয়োগের সুযোগ</span>
            </div>
            <div className="benefit-item">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>আর্থিক শিক্ষা ও প্রশিক্ষণ</span>
            </div>
            <div className="benefit-item">
              <Users className="h-4 w-4 text-purple-500" />
              <span>কমিউনিটি নেটওয়ার্ক</span>
            </div>
            <div className="benefit-item">
              <Shield className="h-4 w-4 text-indigo-500" />
              <span>জরুরি সহায়তা তহবিল</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="quick-actions-header">
          <Clock className="h-5 w-5 text-indigo-600" />
          <h3>দ্রুত কার্যক্রম</h3>
        </div>
        <div className="actions-grid">
          <button className="action-button blue">
            <div className="icon">
              <Bell className="h-6 w-6" />
            </div>
            <span>নোটিশ দেখুন</span>
          </button>
          <button className="action-button green">
            <div className="icon">
              <Users className="h-6 w-6" />
            </div>
            <span>সদস্য তালিকা</span>
          </button>
          <button className="action-button purple">
            <div className="icon">
              <Calendar className="h-6 w-6" />
            </div>
            <span>সভার সময়সূচী</span>
          </button>
          <button className="action-button orange">
            <div className="icon">
              <BookOpen className="h-6 w-6" />
            </div>
            <span>নিয়মাবলী</span>
          </button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="welcome-message">
        <div className="welcome-content">
          <div className="welcome-icon">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div className="welcome-text">
            <h3>স্বাগতম, {currentUser?.name?.split(' ')[0] || 'সদস্য'}!</h3>
            <p>
              আমাদের সমিতিতে আপনার অংশগ্রহণের জন্য ধন্যবাদ। আপনার আর্থিক লক্ষ্য অর্জনে আমরা আপনার পাশে আছি।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;