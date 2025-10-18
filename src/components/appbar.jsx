import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useLocation } from 'react-router-dom';
import { User, Shield, DollarSign } from 'lucide-react';
import useSidebarLogic from '../hooks/useSidebarLogic';

export default function PrimarySearchAppBar({ 
  userRole, 
  setUserRole, 
  sidebarVisible, 
  setSidebarVisible, 
  mobileSidebarOpen, 
  setMobileSidebarOpen, 
  isMobile 
}) {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const location = useLocation();
  const { navigationItems } = useSidebarLogic(userRole);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Role definitions
  const roles = [
    {
      value: 'admin',
      label: 'অ্যাডমিন',
      icon: Shield,
      color: '#dc2626'
    },
    {
      value: 'cashier',
      label: 'ক্যাশিয়ার',
      icon: DollarSign,
      color: '#059669'
    },
    {
      value: 'member',
      label: 'সদস্য',
      icon: User,
      color: '#2563eb'
    }
  ];

  const currentRole = roles.find(role => role.value === userRole);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    handleMobileMenuClose();
  };

  const handleSidebarToggle = () => {
    if (isMobile) {
      setMobileSidebarOpen(true);
    } else {
      setSidebarVisible(!sidebarVisible);
    }
  };

  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find(item => item.href === location.pathname);
    return currentItem?.name || 'ড্যাশবোর্ড';
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: '16px',
          mt: 1,
          minWidth: 200,
          '& .MuiMenuItem-root': {
            borderRadius: '12px',
            mx: 1,
            my: 0.5,
          },
        },
      }}
    >
      {roles.map((role) => {
        const RoleIcon = role.icon;
        const isSelected = role.value === userRole;
        
        return (
          <MenuItem 
            key={role.value}
            onClick={() => handleRoleChange(role.value)}
            sx={{
              backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.04)',
              },
              py: 1.5,
              px: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '8px',
                  backgroundColor: isSelected ? `${role.color}15` : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RoleIcon 
                  size={18} 
                  style={{ color: role.color }}
                />
              </Box>
              <Typography 
                sx={{ 
                  color: isSelected ? '#2563eb' : 'text.primary',
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: '0.9rem'
                }}
              >
                {role.label}
              </Typography>
              {isSelected && (
                <Box 
                  sx={{ 
                    ml: 'auto', 
                    width: 6, 
                    height: 6, 
                    backgroundColor: '#2563eb', 
                    borderRadius: '50%' 
                  }} 
                />
              )}
            </Box>
          </MenuItem>
        );
      })}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          margin: 0,
          padding: 0
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: 56, md: 64 }, 
          px: { xs: 2, md: 3 },
          gap: 1
        }}>
          {/* Navigation Button */}
          <IconButton
            size={isMobile ? "medium" : "large"}
            edge="start"
            color="inherit"
            aria-label="মেনু"
            onClick={handleSidebarToggle}
            sx={{ 
              mr: 1,
              p: isMobile ? 1 : 1.5,
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              '&:active': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                transform: 'scale(0.95)',
              },
              transition: 'all 0.15s ease',
            }}
          >
            <MenuIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
          </IconButton>

          {/* Page Title */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 500,
                color: 'text.primary',
                letterSpacing: '-0.01em'
              }}
            >
              {getCurrentPageTitle()}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Search Button */}
            <IconButton
              size={isMobile ? "medium" : "large"}
              aria-label="অনুসন্ধান"
              color="inherit"
              sx={{
                p: isMobile ? 1 : 1.5,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                '&:active': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  transform: 'scale(0.95)',
                },
                transition: 'all 0.15s ease',
              }}
            >
              <SearchIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
            </IconButton>

            {/* Notifications */}
            <IconButton
              size={isMobile ? "medium" : "large"}
              aria-label="বিজ্ঞপ্তি"
              color="inherit"
              sx={{
                p: isMobile ? 1 : 1.5,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                '&:active': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  transform: 'scale(0.95)',
                },
                transition: 'all 0.15s ease',
              }}
            >
              <Badge 
                badgeContent={3} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    minWidth: 16,
                    height: 16,
                  }
                }}
              >
                <NotificationsIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
              </Badge>
            </IconButton>

            {/* Role Selector */}
            <IconButton
              size={isMobile ? "medium" : "large"}
              aria-label="ভূমিকা নির্বাচন"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              sx={{
                p: isMobile ? 1 : 1.5,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                '&:active': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  transform: 'scale(0.95)',
                },
                transition: 'all 0.15s ease',
              }}
            >
              <MoreIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
}