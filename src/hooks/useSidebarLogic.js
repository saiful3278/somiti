import { 
  Home, 
  Users, 
  PiggyBank, 
  TrendingUp, 
  DollarSign, 
  Bell, 
  Settings,
  UserPlus
} from 'lucide-react';

const useSidebarLogic = (userRole) => {
  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'নোটিশ বোর্ড', href: '/notices', icon: Bell },
      { name: 'প্রোফাইল ও সেটিংস', href: '/profile', icon: Settings },
    ];

    switch (userRole) {
      case 'admin':
        return [
          { name: 'অ্যাডমিন ড্যাশবোর্ড', href: '/admin', icon: Home },
          { name: 'শেয়ার ট্র্যাকিং', href: '/shares', icon: PiggyBank },
          { name: 'বিনিয়োগ ব্যবস্থাপনা', href: '/investments', icon: TrendingUp },
          { name: 'লাভ বণ্টন', href: '/profits', icon: DollarSign },
          ...baseItems,
        ];
      case 'cashier':
        return [
          { name: 'ক্যাশিয়ার ড্যাশবোর্ড', href: '/cashier', icon: Home },
          { name: 'শেয়ার ট্র্যাকিং', href: '/shares', icon: PiggyBank },
          ...baseItems,
        ];
      case 'member':
        return [
          { name: 'সদস্য ড্যাশবোর্ড', href: '/member', icon: Home },
          ...baseItems,
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const roleNames = {
    admin: 'অ্যাডমিন',
    cashier: 'ক্যাশিয়ার',
    member: 'সদস্য'
  };

  return {
    navigationItems,
    roleNames
  };
};

export default useSidebarLogic;