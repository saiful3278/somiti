import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMode } from '../../contexts/ModeContext';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, User, Shield, Wallet } from 'lucide-react';
import '../../styles/components/DemoRoleSwitcher.css';

console.log('[DemoRoleSwitcher] File loaded');

const DemoRoleSwitcher = () => {
    const { user, switchRole } = useAuth();
    const { isDemo } = useMode();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    // Only show in demo mode
    if (!isDemo()) {
        return null;
    }

    // Must have a user
    if (!user) {
        return null;
    }

    const roles = [
        { id: 'admin', label: 'অ্যাডমিন', icon: Shield, color: '#667eea' },
        { id: 'cashier', label: 'ক্যাশিয়ার', icon: Wallet, color: '#f093fb' },
        { id: 'member', label: 'সদস্য', icon: User, color: '#10b981' }
    ];

    const currentRole = roles.find(r => r.id === user.role);

    const handleRoleSwitch = (newRole) => {
        if (newRole !== user.role) {
            // Update role in localStorage
            localStorage.setItem('somiti_role', newRole);

            console.log('[DemoRoleSwitcher] Switching to', newRole, '- reloading page');

            // Reload page to let AuthContext pick up new role
            window.location.href = `/#/${newRole}`;
            window.location.reload();

            setShowMenu(false);
        }
    };

    return (
        <div className="demo-role-switcher">
            <button
                className="demo-role-button"
                onClick={() => setShowMenu(!showMenu)}
                style={{ '--role-color': currentRole?.color }}
            >
                <RefreshCw size={18} className={showMenu ? 'spinning' : ''} />
                <span className="role-label">{currentRole?.label}</span>
                <span className="demo-badge">ডেমো</span>
            </button>

            {showMenu && (
                <>
                    <div className="role-menu-backdrop" onClick={() => setShowMenu(false)} />
                    <div className="role-menu">
                        <div className="role-menu-header">
                            <span>রোল পরিবর্তন করুন</span>
                        </div>
                        {roles.map((role) => {
                            const RoleIcon = role.icon;
                            const isActive = role.id === user.role;

                            return (
                                <button
                                    key={role.id}
                                    className={`role-menu-item ${isActive ? 'active' : ''}`}
                                    onClick={() => handleRoleSwitch(role.id)}
                                    style={{ '--role-color': role.color }}
                                    disabled={isActive}
                                >
                                    <RoleIcon size={20} />
                                    <span>{role.label}</span>
                                    {isActive && <span className="active-indicator">✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default DemoRoleSwitcher;
