import { Search, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import './TopNavbar.css';

export function TopNavbar({ collapsed }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const [searchValue, setSearchValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
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
        <header className={`top-navbar ${collapsed ? 'collapsed' : ''}`}>
            <div className="top-navbar-search">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search tickets, contacts, articles..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="search-input"
                />
                <kbd className="search-shortcut">⌘K</kbd>
            </div>

            <div className="top-navbar-actions">
                <ThemeToggle />

                <button className="navbar-icon-btn notification-btn">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </button>

                <div className="navbar-user-container" ref={dropdownRef}>
                    <div
                        className={`navbar-user ${isDropdownOpen ? 'active' : ''}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <Avatar name={user ? `${user.first_name} ${user.last_name}` : "User"} size="sm" status="online" />
                        <div className="navbar-user-info">
                            <span className="navbar-user-name">
                                {user ? `${user.first_name} ${user.last_name}` : "User"}
                            </span>
                            <span className="navbar-user-role">{user?.role || 'User'}</span>
                        </div>
                        <ChevronDown size={16} className={`navbar-user-chevron ${isDropdownOpen ? 'rotate' : ''}`} />
                    </div>

                    {isDropdownOpen && (
                        <div className="navbar-user-dropdown">
                            <div className="dropdown-header">
                                <span className="dropdown-user-name">{user ? `${user.first_name} ${user.last_name}` : "User"}</span>
                                <span className="dropdown-user-email">{user?.email || ''}</span>
                            </div>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                <User size={16} />
                                <span>Profile</span>
                            </button>
                            <button className="dropdown-item" onClick={() => navigate('/settings')}>
                                <Settings size={16} />
                                <span>Settings</span>
                            </button>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item danger" onClick={handleLogout}>
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
