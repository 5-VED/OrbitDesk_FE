import { Search, Bell, ChevronDown, LogOut, User, ArrowLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import './AdminTopbar.css';

export function AdminTopbar({ collapsed }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className={`admin-topbar ${collapsed ? 'collapsed' : ''}`}>
            <div className="admin-topbar-left">
                <div className="admin-topbar-breadcrumb">
                    <span className="admin-breadcrumb-label">Administration</span>
                    <span className="admin-breadcrumb-badge">Admin</span>
                </div>
            </div>

            <div className="admin-topbar-actions">
                <ThemeToggle />

                <button className="admin-navbar-icon-btn" title="Notifications">
                    <Bell size={20} />
                </button>

                <div className="admin-navbar-user-container" ref={dropdownRef}>
                    <div
                        className={`admin-navbar-user ${isDropdownOpen ? 'active' : ''}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <Avatar name={user ? `${user.first_name} ${user.last_name}` : "Admin"} size="sm" status="online" />
                        {!collapsed && (
                            <div className="admin-navbar-user-info">
                                <span className="admin-navbar-user-name">
                                    {user ? `${user.first_name} ${user.last_name}` : "Admin"}
                                </span>
                                <span className="admin-navbar-user-role">Administrator</span>
                            </div>
                        )}
                        <ChevronDown size={16} className={`admin-navbar-chevron ${isDropdownOpen ? 'rotate' : ''}`} />
                    </div>

                    {isDropdownOpen && (
                        <div className="admin-navbar-dropdown">
                            <div className="admin-dropdown-header">
                                <span className="admin-dropdown-user-name">{user ? `${user.first_name} ${user.last_name}` : "Admin"}</span>
                                <span className="admin-dropdown-user-email">{user?.email || ''}</span>
                            </div>
                            <div className="admin-dropdown-divider"></div>
                            <button className="admin-dropdown-item" onClick={() => navigate('/dashboard')}>
                                <ArrowLeft size={16} />
                                <span>Back to App</span>
                            </button>
                            <button className="admin-dropdown-item" onClick={() => navigate('/profile')}>
                                <User size={16} />
                                <span>Profile</span>
                            </button>
                            <div className="admin-dropdown-divider"></div>
                            <button className="admin-dropdown-item danger" onClick={handleLogout}>
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
