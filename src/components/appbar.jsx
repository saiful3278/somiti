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

import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useLocation } from 'react-router-dom';
import { User, Shield, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import useSidebarLogic from '../hooks/useSidebarLogic';

export default function PrimarySearchAppBar({ 
  isMobile 
}) {
  const { user, logout } = useAuth();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const location = useLocation();
  const { navigationItems } = useSidebarLogic(user?.role);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // Current role display only (no switching allowed)
  const currentRole = {
    admin: { label: 'অ্যাডমিন', icon: Shield, color: '#dc2626' },
    cashier: { label: 'ক্যাশিয়ার', icon: DollarSign, color: '#059669' },
    member: { label: 'সদস্য', icon: User, color: '#2563eb' }
  }[user?.role] || { label: 'সদস্য', icon: User, color: '#2563eb' };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    handleMobileMenuClose();
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
      {/* Current Role Display (Read-only) */}
      <MenuItem 
        sx={{
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          py: 1.5,
          px: 2,
          cursor: 'default',
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
          },
        }}
        disabled
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '8px',
              backgroundColor: `${currentRole.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <currentRole.icon 
              size={18} 
              style={{ color: currentRole.color }}
            />
          </Box>
          <Typography 
            sx={{ 
              color: '#2563eb',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {currentRole.label}
          </Typography>
          <Box 
            sx={{ 
              ml: 'auto', 
              width: 6, 
              height: 6, 
              backgroundColor: '#2563eb', 
              borderRadius: '50%' 
            }} 
          />
        </Box>
      </MenuItem>

      <MenuItem 
        onClick={handleLogout}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(220, 38, 38, 0.04)',
          },
          py: 1.5,
          px: 2,
          mt: 1,
          borderTop: '1px solid #e5e7eb'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={18} style={{ color: '#dc2626' }} />
          </Box>
          <Typography sx={{ color: '#dc2626', fontWeight: 500, fontSize: '0.9rem' }}>
            লগ আউট
          </Typography>
        </Box>
      </MenuItem>
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
          {/* Logout Button */}
          <IconButton
            size={isMobile ? "medium" : "large"}
            edge="start"
            color="inherit"
            aria-label="লগ আউট"
            onClick={handleLogout}
            sx={{ 
              mr: 1,
              p: isMobile ? 1 : 1.5,
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(220, 38, 38, 0.04)',
              },
              '&:active': {
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                transform: 'scale(0.95)',
              },
              transition: 'all 0.15s ease',
            }}
          >
            <LogOut size={isMobile ? 20 : 24} style={{ color: '#dc2626' }} />
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