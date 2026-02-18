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
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/authSlice';
import './Sidebar.css';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tickets', icon: Ticket, label: 'Tickets' },
    { path: '/contacts', icon: Users, label: 'Contacts' },
    { path: '/agents', icon: UserCircle, label: 'Agents' },
    { path: '/groups', icon: UsersRound, label: 'Groups' },
    { path: '/organizations', icon: Building2, label: 'Organizations' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
];

const bottomItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
];

export function Sidebar({ collapsed, onToggle }) {
    const user = useAppSelector(selectCurrentUser);
    const isAdmin = user?.role_type === 'admin';

    return (
        <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
            <div className="sidebar-header">
                {!collapsed && (
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">S</div>
                        <span className="sidebar-logo-text">SupportDesk</span>
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
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-nav-item ${isActive ? 'active' : ''}`
                                }
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon size={20} />
                                {!collapsed && <span>{item.label}</span>}
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
                                className={({ isActive }) =>
                                    `sidebar-nav-item sidebar-admin-link ${isActive ? 'active' : ''}`
                                }
                                title={collapsed ? 'Admin Panel' : undefined}
                            >
                                <Shield size={20} />
                                {!collapsed && <span>Admin Panel</span>}
                            </NavLink>
                        </li>
                    )}
                    {bottomItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-nav-item ${isActive ? 'active' : ''}`
                                }
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon size={20} />
                                {!collapsed && <span>{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
