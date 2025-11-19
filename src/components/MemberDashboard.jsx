import React, { useState, useEffect, useMemo } from 'react';
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
  Bell,
  Camera
} from 'lucide-react';
import { MemberService } from '../firebase/memberService';
import LoadingAnimation from './common/LoadingAnimation';
import { useUser } from '../contexts/UserContext';
import ProfilePhotoModal from './ProfilePhotoModal';
import '../styles/components/MemberDashboard.css';
import '../styles/components/UnifiedMembersFinanceCard.css';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config.js';

// Console log at module load to aid debugging across sessions
console.log('[MemberDashboard] module loaded');

const monthLabelsBn = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const MemberDashboard = () => {
  // Lightweight render trace (timestamped) for debugging without impacting performance
  console.log('[MemberDashboard] render', { time: new Date().toISOString() });
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
  const [photoURL, setPhotoURL] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [ownTransactions, setOwnTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(undefined);
  const nowYear = useMemo(() => new Date().getFullYear(), []);
  const nowMonth = useMemo(() => new Date().getMonth(), []);

  // Log mount/unmount lifecycle
  useEffect(() => {
    console.log('[MemberDashboard] mounted');
    return () => {
      console.log('[MemberDashboard] unmounted');
    };
  }, []);

  // Load member data
  useEffect(() => {
    const loadMemberData = async () => {
      if (!currentUser?.uid) return;

      try {
        console.log('[MemberDashboard] loadMemberData:start', { uid: currentUser?.uid });
        setLoading({ initial: true });

        // Calculate somiti_user_id
        const membersResult = await MemberService.getActiveMembers();
        if (membersResult.success && membersResult.data) {
          const allMembers = membersResult.data;
          console.log('[MemberDashboard] activeMembers:fetched', { count: allMembers.length });
          
          const sortedByCreatedAt = [...allMembers].sort((a, b) => {
            const createdA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
            const createdB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
            if (createdA.getTime() !== createdB.getTime()) {
              return createdA - createdB;
            }
            return (a.id || '').localeCompare(b.id || '');
          });
          console.log('[MemberDashboard] somitiUserId ordered by createdAt ascending');
          
          const currentUserIndex = sortedByCreatedAt.findIndex(member => member.id === currentUser.uid);
          const calculatedSomitiUserId = currentUserIndex !== -1 ? currentUserIndex + 1 : '';
          setSomitiUserId(calculatedSomitiUserId);
          console.log('[MemberDashboard] somitiUserId:calculated', { somitiUserId: calculatedSomitiUserId });
           
           // Also get the actual joining date for the current user
           const currentUserData = sortedByCreatedAt.find(member => member.id === currentUser.uid);
           if (currentUserData) {
             setPhotoURL(currentUserData.photoURL || null);
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
                console.log('[MemberDashboard] stats:updated', {
                  totalMembers: allMembers.length,
                  memberRank: calculatedSomitiUserId,
                  yearsOfMembership: Math.max(0, yearsOfMembership)
                });
             }
           }
        }

        setLoading({ initial: false });
        console.log('[MemberDashboard] loadMemberData:done');
      } catch (error) {
        console.error('[MemberDashboard] সদস্য তথ্য লোড করতে ত্রুটি:', error);
        setLoading({ initial: false });
      }
    };

    loadMemberData();
  }, [currentUser]);

  // Subscribe to current user's transactions (realtime)
  useEffect(() => {
    const uid = currentUser?.uid || currentUser?.id;
    if (!uid) return;
    console.log('[MemberDashboard] ownTransactions:subscribe', { uid });
    const q = query(collection(db, 'transactions'), where('memberId', '==', uid));
    const unsub = onSnapshot(q, (snap) => {
      const tx = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log('[MemberDashboard] ownTransactions:update', { count: tx.length });
      setOwnTransactions(tx);
    }, (err) => {
      console.error('[MemberDashboard] ownTransactions:error', err);
      setOwnTransactions([]);
    });
    return () => {
      console.log('[MemberDashboard] ownTransactions:unsub');
      unsub && unsub();
    };
  }, [currentUser]);

  const availableYears = useMemo(() => {
    const years = new Set();
    ownTransactions.forEach((t) => {
      const d = (typeof t.date?.toDate === 'function') ? t.date.toDate() : (t.date?.seconds ? new Date(t.date.seconds * 1000) : (t.date ? new Date(t.date) : (t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1000) : undefined)));
      const y = d?.getFullYear?.();
      if (typeof y === 'number') years.add(y);
    });
    const arr = Array.from(years).sort((a, b) => b - a);
    console.log('[MemberDashboard] ownTransactions:availableYears', arr);
    return arr;
  }, [ownTransactions]);

  useEffect(() => {
    if (!selectedYear) {
      const def = availableYears.includes(nowYear) ? nowYear : availableYears[0];
      if (def) {
        setSelectedYear(def);
        console.log('[MemberDashboard] ownTransactions:selectedYear:default', def);
      }
    } else {
      if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
        setSelectedYear(availableYears[0]);
        console.log('[MemberDashboard] ownTransactions:selectedYear:adjusted', availableYears[0]);
      }
    }
  }, [availableYears, selectedYear, nowYear]);

  const ownAggregation = useMemo(() => {
    const monthlyTotals = Array(12).fill(0);
    let totalPaid = 0;
    ownTransactions.forEach((t) => {
      const dateObj = (typeof t.date?.toDate === 'function') ? t.date.toDate() : (t.date?.seconds ? new Date(t.date.seconds * 1000) : (t.date ? new Date(t.date) : (t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1000) : undefined)));
      const yearInt = dateObj?.getFullYear?.();
      const monthInt = typeof t.month === 'number' ? t.month : dateObj?.getMonth?.();
      if (typeof yearInt !== 'number' || typeof monthInt !== 'number') return;
      if (typeof selectedYear === 'number' && yearInt !== selectedYear) return;
      const amount = Number(t.amount) || 0;
      monthlyTotals[monthInt] += amount;
      totalPaid += amount;
    });
    console.log('[MemberDashboard] ownAggregation built', { totalPaid });
    return { monthlyTotals, totalPaid };
  }, [ownTransactions, selectedYear]);

  const shareCount = Number(currentUser?.shareCount || 0);
  const monthlyRate = shareCount * 500;
  const joinRaw = currentUser?.joiningDate || currentUser?.joinDate || null;
  const joinDate = joinRaw ? new Date(joinRaw) : undefined;
  const joinYear = joinDate?.getFullYear?.();
  const joinMonth = joinDate?.getMonth?.();
  let monthsDueCount = 0;
  if (typeof selectedYear === 'number' && typeof joinYear === 'number') {
    if (selectedYear < nowYear) {
      if (joinYear < selectedYear) monthsDueCount = 12;
      else if (joinYear === selectedYear && typeof joinMonth === 'number') monthsDueCount = 12 - joinMonth;
    } else if (selectedYear === nowYear) {
      if (joinYear < selectedYear) monthsDueCount = nowMonth + 1;
      else if (joinYear === selectedYear && typeof joinMonth === 'number') monthsDueCount = Math.max(0, (nowMonth - joinMonth + 1));
    } else {
      monthsDueCount = 0;
    }
  }
  const plannedDue = monthlyRate * Math.max(0, monthsDueCount);
  const totalDueOwn = plannedDue - (ownAggregation.totalPaid || 0);

  // Show loading animation if user is still loading or initial data is loading
  if (userLoading || loading.initial) {
    console.log('[MemberDashboard] loading:active', { userLoading, initialData: loading.initial });
    return <LoadingAnimation />;
  }

  console.log('[MemberDashboard] render:final', { state: { somitiUserId, joiningDate, memberStats } });

  return (
    <div className="member-dashboard-home">
      {/* Member Profile Header */}
      <div className="member-profile-header">
        <div className="profile-content">
          <div 
            className="profile-avatar" 
            onClick={() => setIsPhotoModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIsPhotoModalOpen(true)}
          >
            {photoURL ? (
              <>
                <img src={photoURL} alt="Profile" className="profile-photo" />
                <div className="photo-overlay">
                  <Camera className="h-8 w-8" />
                </div>
              </>
            ) : (
              <>
                <User className="h-20 w-20" />
                <div className="photo-overlay">
                  <Camera className="h-8 w-8" />
                </div>
              </>
            )}
          </div>
          <div className="profile-info">
            <div className="profile-details">
              <h1>{currentUser?.name || 'লোড হচ্ছে...'}</h1>
            </div>
          </div>
          <div className="profile-right-info">
            <p>সদস্য আইডি: {somitiUserId || 'লোড হচ্ছে...'}</p>
            <p>যোগদানের তারিখ: {joiningDate || 'লোড হচ্ছে...'}</p>
            <div className="membership-badge">
              <p>সদস্যপদের ধরন</p>
              <p>{currentUser?.membershipType || 'নিয়মিত সদস্য'}</p>
            </div>
          </div>
        </div>
      </div>

      <ProfilePhotoModal 
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        userId={currentUser?.uid}
        currentPhotoURL={photoURL}
        onPhotoUpdate={(newPhotoURL) => setPhotoURL(newPhotoURL)}
      />

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
              <span>বিনিযোগের সুযোগ</span>
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

      {/* আমার আর্থিক টেবিল — removed per request */}
    </div>
  );
};

export default MemberDashboard;