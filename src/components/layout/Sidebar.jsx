import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Ticket,
    Users,
    UserCircle,
    UsersRound,
    Building2,
    BarChart3,
    BookOpen,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Shield
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/authSlice';
import './Sidebar.css';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Workspace' },
    { path: '/tickets', icon: Ticket, label: 'Work Items' },
    { path: '/contacts', icon: Users, label: 'People' },
    { path: '/agents', icon: UserCircle, label: 'Agents' },
    { path: '/groups', icon: UsersRound, label: 'Groups' },
    { path: '/organizations', icon: Building2, label: 'Organizations', adminOnly: true },
    { path: '/reports', icon: BarChart3, label: 'Insights' },
    { path: '/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
];

const bottomItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
    const user = useAppSelector(selectCurrentUser);
    const isAdmin = user?.role_type === 'admin';

    const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

    const handleNavClick = () => {
        if (mobileOpen && onMobileClose) {
            onMobileClose();
        }
    };

    return (
        <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
            <div className="sidebar-header">
                {(!collapsed || mobileOpen) && (
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">O</div>
                        <span className="sidebar-logo-text">OrbitDesk</span>
                    </div>
                )}
                <button
                    className="sidebar-toggle"
                    onClick={onToggle}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                <ul className="sidebar-nav-list">
                    {visibleNavItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `sidebar-nav-item ${isActive ? 'active' : ''}`
                                }
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon size={20} />
                                {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                                <span className="sidebar-active-dot" />
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <ul className="sidebar-nav-list">
                    {isAdmin && (
                        <li>
                            <NavLink
                                to="/admin"
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `sidebar-nav-item sidebar-admin-link ${isActive ? 'active' : ''}`
                                }
                                title={collapsed ? 'Admin Panel' : undefined}
                            >
                                <Shield size={20} />
                                {(!collapsed || mobileOpen) && <span>Admin Panel</span>}
                                <span className="sidebar-active-dot" />
                            </NavLink>
                        </li>
                    )}
                    {bottomItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `sidebar-nav-item ${isActive ? 'active' : ''}`
                                }
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon size={20} />
                                {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                                <span className="sidebar-active-dot" />
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
