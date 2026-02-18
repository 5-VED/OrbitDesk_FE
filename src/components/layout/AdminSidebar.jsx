import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Shield,
    Building2,
    UsersRound,
    Clock,
    Bell,
    Settings,
    ScrollText,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Activity,
    KeyRound
} from 'lucide-react';
import './AdminSidebar.css';

const adminNavSections = [
    {
        title: 'Overview',
        items: [
            { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
            { path: '/admin/audit-log', icon: ScrollText, label: 'Audit Log' },
        ]
    },
    {
        title: 'People',
        items: [
            { path: '/admin/users', icon: Users, label: 'Users & Agents' },
            { path: '/admin/roles', icon: Shield, label: 'Roles & Permissions' },
        ]
    },
    {
        title: 'Structure',
        items: [
            { path: '/admin/organizations', icon: Building2, label: 'Organizations' },
            { path: '/admin/groups', icon: UsersRound, label: 'Groups' },
        ]
    },
    {
        title: 'Policies',
        items: [
            { path: '/admin/sla-policies', icon: Clock, label: 'SLA Policies' },
            { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
        ]
    },
    {
        title: 'System',
        items: [
            { path: '/admin/settings', icon: Settings, label: 'System Settings' },
            { path: '/admin/api-keys', icon: KeyRound, label: 'API Keys' },
            { path: '/admin/system-health', icon: Activity, label: 'System Health' },
        ]
    },
];

export function AdminSidebar({ collapsed, onToggle }) {
    const navigate = useNavigate();

    return (
        <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar-collapsed' : ''}`}>
            <div className="admin-sidebar-header">
                {!collapsed && (
                    <div className="admin-sidebar-logo">
                        <div className="admin-sidebar-logo-icon">A</div>
                        <span className="admin-sidebar-logo-text">Admin Panel</span>
                    </div>
                )}
                <button
                    className="admin-sidebar-toggle"
                    onClick={onToggle}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Back to app button */}
            <div className="admin-sidebar-back">
                <button
                    className="admin-back-btn"
                    onClick={() => navigate('/dashboard')}
                    title={collapsed ? 'Back to App' : undefined}
                >
                    <ArrowLeft size={18} />
                    {!collapsed && <span>Back to App</span>}
                </button>
            </div>

            <nav className="admin-sidebar-nav">
                {adminNavSections.map((section) => (
                    <div key={section.title} className="admin-nav-section">
                        {!collapsed && (
                            <span className="admin-nav-section-title">{section.title}</span>
                        )}
                        <ul className="admin-nav-list">
                            {section.items.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            `admin-nav-item ${isActive ? 'active' : ''}`
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
                ))}
            </nav>

            <div className="admin-sidebar-footer">
                {!collapsed && (
                    <div className="admin-sidebar-version">
                        <span>OrbitDesk Admin</span>
                        <span className="admin-version-tag">v1.0</span>
                    </div>
                )}
            </div>
        </aside>
    );
}
