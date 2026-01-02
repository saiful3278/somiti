// Demo data for demonstration mode
// All data here is fictional and for testing purposes only

console.log('[demoData] File loaded');

// Demo Members Data
export const demoMembers = [
    {
        id: 'demo-member-1',
        name: 'রহিম আলী',
        email: 'rahim@demo.com',
        role: 'member',
        membershipType: 'নিয়মিত সদস্য',
        joinDate: new Date('2023-01-15'),
        shareCount: 25,
        totalInvestment: 125000,
        phone: '০১৭১১-১২৩৪৫৬',
        address: 'ঢাকা, বাংলাদেশ',
        status: 'active'
    },
    {
        id: 'demo-member-2',
        name: 'করিম মিয়া',
        email: 'karim@demo.com',
        role: 'member',
        membershipType: 'নিয়মিত সদস্য',
        joinDate: new Date('2023-02-20'),
        shareCount: 15,
        totalInvestment: 75000,
        phone: '০১৮১১-২৩৪৫৬৭',
        address: 'চট্টগ্রাম, বাংলাদেশ',
        status: 'active'
    },
    {
        id: 'demo-member-3',
        name: 'সালমা বেগম',
        email: 'salma@demo.com',
        role: 'member',
        membershipType: 'প্রিমিয়াম সদস্য',
        joinDate: new Date('2023-03-10'),
        shareCount: 50,
        totalInvestment: 250000,
        phone: '০১৯১১-৩৪৫৬৭৮',
        address: 'সিলেট, বাংলাদেশ',
        status: 'active'
    },
    {
        id: 'demo-member-4',
        name: 'জামাল উদ্দিন',
        email: 'jamal@demo.com',
        role: 'member',
        membershipType: 'নিয়মিত সদস্য',
        joinDate: new Date('2023-04-05'),
        shareCount: 10,
        totalInvestment: 50000,
        phone: '০১৬১১-৪৫৬৭৮৯',
        address: 'রাজশাহী, বাংলাদেশ',
        status: 'active'
    },
    {
        id: 'demo-member-5',
        name: 'ফাতেমা খাতুন',
        email: 'fatema@demo.com',
        role: 'member',
        membershipType: 'নিয়মিত সদস্য',
        joinDate: new Date('2023-05-12'),
        shareCount: 20,
        totalInvestment: 100000,
        phone: '০১৭২২-৫৬৭৮৯০',
        address: 'খুলনা, বাংলাদেশ',
        status: 'active'
    },
    {
        id: 'demo-member-6',
        name: 'হাসান মাহমুদ',
        email: 'hasan@demo.com',
        role: 'member',
        membershipType: 'প্রিমিয়াম সদস্য',
        joinDate: new Date('2023-06-18'),
        shareCount: 40,
        totalInvestment: 200000,
        phone: '০১৮২২-৬৭৮৯০১',
        address: 'বরিশাল, বাংলাদেশ',
        status: 'active'
    },
    {
        id: 'demo-member-7',
        name: 'নাজমা আক্তার',
        email: 'nazma@demo.com',
        role: 'member',
        membershipType: 'নিয়মিত সদস্য',
        joinDate: new Date('2023-07-22'),
        shareCount: 12,
        totalInvestment: 60000,
        phone: '০১৯২২-৭৮৯০১২',
        address: 'রংপুর, বাংলাদেশ',
        status: 'active'
    },
    {
        id: 'demo-member-8',
        name: 'আবদুল কাদের',
        email: 'abdul@demo.com',
        role: 'member',
        membershipType: 'নিয়মিত সদস্য',
        joinDate: new Date('2023-08-30'),
        shareCount: 18,
        totalInvestment: 90000,
        phone: '০১৬২২-৮৯০১২৩',
        address: 'ময়মনসিংহ, বাংলাদেশ',
        status: 'active'
    },
    {
        id: 'demo-member-9',
        name: 'রোকেয়া সুলতানা',
        email: 'rokeya@demo.com',
        role: 'member',
        membershipType: 'প্রিমিয়াম সদস্য',
        joinDate: new Date('2023-09-14'),
        shareCount: 35,
        totalInvestment: 175000,
        phone: '০১৭৩৩-৯০১২৩৪',
        address: 'কুমিল্লা, বাংলাদেশ',
        status: 'active'
    },
    {
        id: 'demo-member-10',
        name: 'মোস্তফা কামাল',
        email: 'mostafa@demo.com',
        role: 'member',
        membershipType: 'নিয়মিত সদস্য',
        joinDate: new Date('2023-10-08'),
        shareCount: 22,
        totalInvestment: 110000,
        phone: '০১৮৩৩-০১২৩৪৫',
        address: 'যশোর, বাংলাদেশ',
        status: 'active'
    }
];

// Demo Transactions Data
export const demoTransactions = [
    {
        id: 'demo-txn-1',
        memberId: 'demo-member-1',
        memberName: 'রহিম আলী',
        type: 'deposit',
        amount: 5000,
        date: new Date('2025-12-01'),
        description: 'মাসিক সঞ্চয়',
        status: 'completed',
        category: 'savings'
    },
    {
        id: 'demo-txn-2',
        memberId: 'demo-member-2',
        memberName: 'করিম মিয়া',
        type: 'deposit',
        amount: 3000,
        date: new Date('2025-12-02'),
        description: 'শেয়ার ক্রয়',
        status: 'completed',
        category: 'share'
    },
    {
        id: 'demo-txn-3',
        memberId: 'demo-member-3',
        memberName: 'সালমা বেগম',
        type: 'investment',
        amount: 20000,
        date: new Date('2025-12-05'),
        description: 'বিনিয়োগ তহবিলে জমা',
        status: 'completed',
        category: 'investment'
    },
    {
        id: 'demo-txn-4',
        memberId: 'demo-member-1',
        memberName: 'রহিম আলী',
        type: 'withdrawal',
        amount: 2000,
        date: new Date('2025-12-08'),
        description: 'জরুরী উত্তোলন',
        status: 'completed',
        category: 'withdrawal'
    },
    {
        id: 'demo-txn-5',
        memberId: 'demo-member-4',
        memberName: 'জামাল উদ্দিন',
        type: 'deposit',
        amount: 4000,
        date: new Date('2025-12-10'),
        description: 'মাসিক সঞ্চয়',
        status: 'completed',
        category: 'savings'
    },
    {
        id: 'demo-txn-6',
        memberId: 'demo-member-5',
        memberName: 'ফাতেমা খাতুন',
        type: 'deposit',
        amount: 6000,
        date: new Date('2025-12-12'),
        description: 'শেয়ার ক্রয়',
        status: 'completed',
        category: 'share'
    },
    {
        id: 'demo-txn-7',
        memberId: 'demo-member-6',
        memberName: 'হাসান মাহমুদ',
        type: 'investment',
        amount: 15000,
        date: new Date('2025-12-15'),
        description: 'বিনিয়োগ তহবিলে জমা',
        status: 'completed',
        category: 'investment'
    },
    {
        id: 'demo-txn-8',
        memberId: 'demo-member-7',
        memberName: 'নাজমা আক্তার',
        type: 'deposit',
        amount: 3500,
        date: new Date('2025-12-18'),
        description: 'মাসিক সঞ্চয়',
        status: 'completed',
        category: 'savings'
    },
    {
        id: 'demo-txn-9',
        memberId: 'demo-member-8',
        memberName: 'আবদুল কাদের',
        type: 'deposit',
        amount: 5000,
        date: new Date('2025-12-20'),
        description: 'শেয়ার ক্রয়',
        status: 'completed',
        category: 'share'
    },
    {
        id: 'demo-txn-10',
        memberId: 'demo-member-9',
        memberName: 'রোকেয়া সুলতানা',
        type: 'investment',
        amount: 10000,
        date: new Date('2025-12-22'),
        description: 'বিনিয়োগ তহবিলে জমা',
        status: 'completed',
        category: 'investment'
    },
    {
        id: 'demo-txn-11',
        memberId: 'demo-member-10',
        memberName: 'মোস্তফা কামাল',
        type: 'deposit',
        amount: 4500,
        date: new Date('2025-12-24'),
        description: 'মাসিক সঞ্চয়',
        status: 'completed',
        category: 'savings'
    },
    {
        id: 'demo-txn-12',
        memberId: 'demo-member-2',
        memberName: 'করিম মিয়া',
        type: 'withdrawal',
        amount: 1500,
        date: new Date('2025-12-26'),
        description: 'জরুরী উত্তোলন',
        status: 'completed',
        category: 'withdrawal'
    },
    {
        id: 'demo-txn-13',
        memberId: 'demo-member-3',
        memberName: 'সালমা বেগম',
        type: 'deposit',
        amount: 8000,
        date: new Date('2025-12-28'),
        description: 'শেয়ার ক্রয়',
        status: 'completed',
        category: 'share'
    },
    {
        id: 'demo-txn-14',
        memberId: 'demo-member-4',
        memberName: 'জামাল উদ্দিন',
        type: 'investment',
        amount: 12000,
        date: new Date('2025-12-30'),
        description: 'বিনিয়োগ তহবিলে জমা',
        status: 'completed',
        category: 'investment'
    }
];

// Demo Treasury Data
export const demoTreasury = {
    totalBalance: 1250000,
    cashInHand: 150000,
    bankBalance: 1100000,
    totalDeposits: 850000,
    totalWithdrawals: 150000,
    totalInvestments: 550000,
    monthlyIncome: 85000,
    monthlyExpense: 25000,
    lastUpdated: new Date()
};

// Demo Notices Data
export const demoNotices = [
    {
        id: 'demo-notice-1',
        title: 'মাসিক সভার আমন্ত্রণ',
        content: 'আগামী ১৫ জানুয়ারী ২০২৬ তারিখে মাসিক সাধারণ সভা অনুষ্ঠিত হবে। সকল সদস্যদের উপস্থিত থাকার জন্য অনুরোধ করা হচ্ছে।',
        date: new Date('2025-12-20'),
        author: 'এডমিন',
        priority: 'high',
        status: 'active'
    },
    {
        id: 'demo-notice-2',
        title: 'নতুন শেয়ার মূল্য ঘোষণা',
        content: 'জানুয়ারী ২০২৬ থেকে প্রতি শেয়ারের মূল্য ৫,৫০০ টাকা নির্ধারণ করা হয়েছে।',
        date: new Date('2025-12-18'),
        author: 'এডমিন',
        priority: 'medium',
        status: 'active'
    },
    {
        id: 'demo-notice-3',
        title: 'বার্ষিক লভ্যাংশ বিতরণ',
        content: '২০২৫ সালের বার্ষিক লভ্যাংশ আগামী মাসে বিতরণ করা হবে। প্রতি শেয়ারে ৮% লভ্যাংশ ঘোষণা করা হয়েছে।',
        date: new Date('2025-12-15'),
        author: 'এডমিন',
        priority: 'high',
        status: 'active'
    },
    {
        id: 'demo-notice-4',
        title: 'অফিস সময়সূচী পরিবর্তন',
        content: 'শীতকালীন সময়সূচী অনুযায়ী অফিস সকাল ৯টা থেকে বিকাল ৫টা পর্যন্ত খোলা থাকবে।',
        date: new Date('2025-12-10'),
        author: 'এডমিন',
        priority: 'low',
        status: 'active'
    },
    {
        id: 'demo-notice-5',
        title: 'নতুন সদস্য ভর্তি',
        content: 'জানুয়ারী মাসে নতুন সদস্য ভর্তি কার্যক্রম চলবে। আগ্রহী ব্যক্তিরা যোগাযোগ করুন।',
        date: new Date('2025-12-05'),
        author: 'এডমিন',
        priority: 'medium',
        status: 'active'
    }
];

// Demo Investment Data
export const demoInvestments = [
    {
        id: 'demo-inv-1',
        name: 'ব্যাংক ফিক্সড ডিপোজিট',
        type: 'fixed_deposit',
        amount: 500000,
        startDate: new Date('2025-01-01'),
        maturityDate: new Date('2026-01-01'),
        interestRate: 8.5,
        status: 'active'
    },
    {
        id: 'demo-inv-2',
        name: 'ক্ষুদ্র ব্যবসা ঋণ',
        type: 'loan',
        amount: 200000,
        startDate: new Date('2025-06-01'),
        maturityDate: new Date('2026-06-01'),
        interestRate: 10,
        status: 'active'
    },
    {
        id: 'demo-inv-3',
        name: 'শেয়ার বাজার বিনিয়োগ',
        type: 'stocks',
        amount: 150000,
        startDate: new Date('2025-03-15'),
        status: 'active'
    }
];

// Demo Profit Distribution Data
export const demoProfitDistributions = [
    {
        id: 'demo-profit-1',
        year: 2025,
        quarter: 'Q4',
        totalProfit: 125000,
        profitPerShare: 400,
        distributionDate: new Date('2025-12-31'),
        status: 'pending'
    },
    {
        id: 'demo-profit-2',
        year: 2025,
        quarter: 'Q3',
        totalProfit: 110000,
        profitPerShare: 350,
        distributionDate: new Date('2025-09-30'),
        status: 'distributed'
    },
    {
        id: 'demo-profit-3',
        year: 2025,
        quarter: 'Q2',
        totalProfit: 95000,
        profitPerShare: 300,
        distributionDate: new Date('2025-06-30'),
        status: 'distributed'
    }
];

// Demo Statistics
export const demoStats = {
    totalMembers: 10,
    activeMembers: 10,
    totalShares: 247,
    totalInvestment: 1235000,
    totalProfit: 330000,
    monthlyGrowth: 5.2,
    totalTransactions: 14,
    pendingTransactions: 0
};

// Helper function to get demo data based on user role
export const getDemoDataForRole = (role, userId) => {
    const currentMember = demoMembers.find(m => m.id === userId) || demoMembers[0];

    return {
        members: demoMembers,
        transactions: demoTransactions,
        treasury: demoTreasury,
        notices: demoNotices,
        investments: demoInvestments,
        profitDistributions: demoProfitDistributions,
        stats: demoStats,
        currentMember
    };
};
