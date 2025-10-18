import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PiggyBank, 
  TrendingUp, 
  DollarSign, 
  Bell, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Plus,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MemberService, TransactionService, FundService } from '../firebase';

const AdminDashboard = () => {
  const [loading, setLoading] = useState({
    members: true,
    transactions: true,
    fundData: true,
    initial: true
  });
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalFunds: 0,
    monthlyDeposits: 0,
    monthlyProfits: 0,
    recentTransactions: [],
    monthlyData: [],
    investmentData: []
  });
  const [activeTab, setActiveTab] = useState('overview');

  // Load dashboard data from Firebase
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(prev => ({ ...prev, initial: true }));
        
        // Load all data in parallel for better performance
        const [membersResult, fundSummaryResult, transactionsResult] = await Promise.all([
          MemberService.getAllMembers().then(members => {
            const activeMembers = members.filter(member => member.status === 'active');
            setDashboardData(prev => ({
              ...prev,
              totalMembers: members.length,
              activeMembers: activeMembers.length
            }));
            setLoading(prev => ({ ...prev, members: false }));
            return { members, activeMembers };
          }).catch(error => {
            console.error('Error loading members:', error);
            setLoading(prev => ({ ...prev, members: false }));
            return { members: [], activeMembers: [] };
          }),
          
          FundService.getFundSummary().then(fundSummary => {
            setDashboardData(prev => ({
              ...prev,
              totalFunds: fundSummary.totalAmount || 0,
              monthlyDeposits: fundSummary.monthlyDeposits || 0,
              monthlyProfits: fundSummary.monthlyProfits || 0,
              investmentData: fundSummary.investmentBreakdown || []
            }));
            setLoading(prev => ({ ...prev, fundData: false }));
            return fundSummary;
          }).catch(error => {
            console.error('Error loading fund summary:', error);
            setLoading(prev => ({ ...prev, fundData: false }));
            return {};
          }),
          
          TransactionService.getRecentTransactions(10).then(transactions => {
            setDashboardData(prev => ({
              ...prev,
              recentTransactions: transactions
            }));
            setLoading(prev => ({ ...prev, transactions: false }));
            return transactions;
          }).catch(error => {
            console.error('Error loading transactions:', error);
            setLoading(prev => ({ ...prev, transactions: false }));
            return [];
          })
        ]);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    loadDashboardData();
  }, []);

  // Generate summary stats from Firebase data
  const summaryStats = [
    {
      title: 'মোট সদস্য',
      value: dashboardData.totalMembers.toString(),
      change: `+${dashboardData.activeMembers}`,
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'মোট তহবিল',
      value: `৳ ${dashboardData.totalFunds.toLocaleString()}`,
      change: '+১২%',
      changeType: 'increase',
      icon: PiggyBank,
      color: 'bg-green-500',
    },
    {
      title: 'মাসিক জমা',
      value: `৳ ${dashboardData.monthlyDeposits.toLocaleString()}`,
      change: '+৫%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'এই মাসের লাভ',
      value: `৳ ${dashboardData.monthlyProfits.toLocaleString()}`,
      change: '-২%',
      changeType: 'decrease',
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ];

  // Use Firebase data or fallback to dummy data
  const monthlyData = dashboardData.monthlyData.length > 0 ? dashboardData.monthlyData : [
    { month: 'জানুয়ারি', deposits: 75000, profits: 15000 },
    { month: 'ফেব্রুয়ারি', deposits: 82000, profits: 17000 },
    { month: 'মার্চ', deposits: 78000, profits: 16500 },
    { month: 'এপ্রিল', deposits: 85000, profits: 18500 },
    { month: 'মে', deposits: 90000, profits: 19000 },
    { month: 'জুন', deposits: 85000, profits: 18500 },
  ];

  const investmentData = dashboardData.investmentData.length > 0 ? dashboardData.investmentData : [
    { name: 'ব্যাংক ডিপোজিট', value: 60, amount: 325000 },
    { name: 'শেয়ার বাজার', value: 25, amount: 135000 },
    { name: 'ব্যবসায়িক ঋণ', value: 15, amount: 85000 },
  ];

  const COLORS = ['#0A6CFF', '#00BFA5', '#F59E0B'];

  // Generate recent activities from Firebase data
  const recentActivities = dashboardData.recentTransactions.length > 0 
    ? dashboardData.recentTransactions.map((transaction, index) => ({
        id: transaction.id || index,
        type: transaction.type,
        message: `${transaction.memberName || 'সদস্য'} ${transaction.amount.toLocaleString()} টাকা ${transaction.type === 'deposit' ? 'জমা দিয়েছেন' : 'উত্তোলন করেছেন'}`,
        time: transaction.createdAt ? new Date(transaction.createdAt.seconds * 1000).toLocaleDateString('bn-BD') : 'আজ',
        icon: transaction.type === 'deposit' ? PiggyBank : DollarSign,
        color: transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600',
      }))
    : [
        {
          id: 1,
          type: 'member_join',
          message: 'নতুন সদস্য মোহাম্মদ রহিম যোগদান করেছেন',
          time: '২ ঘন্টা আগে',
          icon: Users,
          color: 'text-blue-600',
        },
        {
          id: 2,
          type: 'deposit',
          message: 'ফাতেমা খাতুন ৫,০০০ টাকা জমা দিয়েছেন',
          time: '৪ ঘন্টা আগে',
          icon: PiggyBank,
          color: 'text-green-600',
        },
        {
          id: 3,
          type: 'investment',
          message: 'নতুন বিনিয়োগ: ব্যাংক ডিপোজিট ৫০,০০০ টাকা',
          time: '১ দিন আগে',
          icon: TrendingUp,
          color: 'text-purple-600',
        },
        {
          id: 4,
          type: 'notice',
          message: 'মাসিক সভার নোটিশ প্রকাশিত হয়েছে',
          time: '২ দিন আগে',
          icon: Bell,
          color: 'text-orange-600',
        },
      ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'মাসিক সাধারণ সভা',
      date: '১৫ জুন, ২০২৪',
      time: 'সকাল ১০:০০',
      location: 'কমিউনিটি হল',
    },
    {
      id: 2,
      title: 'লাভ বণ্টন সভা',
      date: '২৮ জুন, ২০২৪',
      time: 'বিকাল ৪:০০',
      location: 'সমিতি অফিস',
    },
    {
      id: 3,
      title: 'নতুন বিনিয়োগ পরিকল্পনা আলোচনা',
      date: '৫ জুলাই, ২০২৪',
      time: 'সকাল ১১:০০',
      location: 'কমিউনিটি হল',
    },
  ];

  // Helper function to create loading skeleton
  const LoadingSkeleton = ({ className = "", height = "h-4" }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${height} ${className}`}></div>
  );

  return (
    <div className="admin-dashboard-mobile">
      <div className="md-surface-container">
        <div className="md-dashboard-content">
          
          {/* Material Design 3 Stats Cards */}
          <div className="md-stats-grid">
            {summaryStats.map((stat, index) => (
              <div key={index} className="md-card md-stats-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="md-card-content">
                  <div className="md-stats-icon-container">
                    <div className={`md-stats-icon ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="md-stats-content">
                    <h3 className="md-title-large">
                      {(index === 0 && loading.members) || (index === 1 && loading.fundData) || (index === 2 && loading.fundData) || (index === 3 && loading.fundData) ? 
                        <LoadingSkeleton className="w-16 h-6" /> : 
                        stat.value
                      }
                    </h3>
                    <p className="md-body-medium">{stat.title}</p>
                    <div className={`md-stats-change ${stat.changeType === 'increase' ? 'positive' : 'negative'}`}>
                      {stat.changeType === 'increase' ? 
                        <ArrowUpRight className="h-4 w-4" /> : 
                        <ArrowDownRight className="h-4 w-4" />
                      }
                      <span className="md-label-medium">
                        {(index === 0 && loading.members) || (index === 1 && loading.fundData) || (index === 2 && loading.fundData) || (index === 3 && loading.fundData) ? 
                          <LoadingSkeleton className="w-8" /> : 
                          stat.change
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Material Design 3 Tab Navigation */}
          <div className="md-tab-container">
            <div className="md-tab-bar">
              <button 
                className={`md-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <TrendingUp className="h-5 w-5" />
                <span className="md-label-medium">সংক্ষিপ্ত</span>
              </button>
              <button 
                className={`md-tab ${activeTab === 'activities' ? 'active' : ''}`}
                onClick={() => setActiveTab('activities')}
              >
                <Bell className="h-5 w-5" />
                <span className="md-label-medium">কার্যক্রম</span>
              </button>
              <button 
                className={`md-tab ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                <Calendar className="h-5 w-5" />
                <span className="md-label-medium">ইভেন্ট</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="md-tab-content">
            {activeTab === 'overview' && (
              <div className="md-overview-content">
                {/* Charts Section */}
                <div className="md-charts-container">
                  {/* Monthly Chart Card */}
                  <div className="md-card md-chart-card">
                    <div className="md-card-header">
                      <div>
                        <h3 className="md-title-medium">মাসিক জমা ও লাভ</h3>
                        <p className="md-body-small">গত ৬ মাসের পরিসংখ্যান</p>
                      </div>
                      <button className="md-text-button">
                        <span className="md-label-large">বিস্তারিত</span>
                      </button>
                    </div>
                    <div className="md-chart-container">
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value) => `৳ ${value.toLocaleString()}`}
                            contentStyle={{
                              backgroundColor: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          />
                          <Bar dataKey="deposits" fill="#6366f1" name="মাসিক জমা" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="profits" fill="#06b6d4" name="মাসিক লাভ" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Investment Distribution Card */}
                  <div className="md-card md-chart-card">
                    <div className="md-card-header">
                      <div>
                        <h3 className="md-title-medium">বিনিয়োগ বিতরণ</h3>
                        <p className="md-body-small">মোট ৫,৪৫,০০০ টাকা</p>
                      </div>
                      <button className="md-text-button">
                        <span className="md-label-large">বিস্তারিত</span>
                      </button>
                    </div>
                    <div className="md-chart-container">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={investmentData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                            stroke="white"
                            strokeWidth={2}
                          >
                            {investmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name) => [`${value}%`, name]}
                            contentStyle={{
                              backgroundColor: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="md-investment-list">
                      {investmentData.map((item, index) => (
                        <div key={index} className="md-investment-item">
                          <div className="md-investment-indicator" style={{ backgroundColor: COLORS[index] }} />
                          <div className="md-investment-info">
                            <span className="md-body-medium">{item.name}</span>
                            <span className="md-title-small">৳ {item.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="md-activities-content">
                <div className="md-card">
                  <div className="md-card-header">
                    <h3 className="md-title-medium">সাম্প্রতিক কার্যক্রম</h3>
                    <button className="md-text-button">
                      <span className="md-label-large">সব দেখুন</span>
                    </button>
                  </div>
                  <div className="md-list">
                    {recentActivities.map((activity, index) => (
                      <div key={activity.id} className="md-list-item" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="md-list-item-leading">
                          <div className={`md-list-icon ${activity.color}`}>
                            <activity.icon className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="md-list-item-content">
                          <div className="md-list-item-headline">{activity.message}</div>
                          <div className="md-list-item-supporting-text">{activity.time}</div>
                        </div>
                        <div className="md-list-item-trailing">
                          <button className="md-icon-button-small">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="md-events-content">
                <div className="md-card">
                  <div className="md-card-header">
                    <h3 className="md-title-medium">আসন্ন কার্যক্রম</h3>
                    <button className="md-text-button">
                      <span className="md-label-large">সব দেখুন</span>
                    </button>
                  </div>
                  <div className="md-events-list">
                    {upcomingEvents.map((event, index) => (
                      <div key={event.id} className="md-event-card" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="md-event-content">
                          <h4 className="md-title-small">{event.title}</h4>
                          <div className="md-event-details">
                            <div className="md-event-detail">
                              <Calendar className="h-4 w-4" />
                              <span className="md-body-small">{event.date}</span>
                            </div>
                            <div className="md-event-detail">
                              <span className="md-body-small">{event.time}</span>
                            </div>
                            <div className="md-event-detail">
                              <span className="md-body-small">{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <button className="md-icon-button">
                          <ArrowUpRight className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Material Design 3 Floating Action Button */}
      <div className="md-fab-container">
        <button className="md-fab md-fab-primary">
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;