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

export function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
    const navigate = useNavigate();

    const handleNavClick = () => {
        if (mobileOpen && onMobileClose) {
            onMobileClose();
        }
    };

    return (
        <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar-collapsed' : ''} ${mobileOpen ? 'admin-sidebar-mobile-open' : ''}`}>
            <div className="admin-sidebar-header">
                {!collapsed && (
                    <div className="admin-sidebar-logo">
                        <div className="admin-sidebar-logo-icon">A</div>
                        <span className="admin-sidebar-logo-text">Admin Panel</span>
                    </div>
                )}
                {collapsed && (
                    <div className="admin-sidebar-logo admin-sidebar-logo-small">
                        <div className="admin-sidebar-logo-icon">A</div>
                    </div>
                )}
            </div>

            <div className="admin-sidebar-return" onClick={() => { navigate('/'); handleNavClick(); }}>
                <ArrowLeft size={16} />
                {!collapsed && <span>Back to App</span>}
            </div>

            <nav className="admin-sidebar-nav">
                {adminNavSections.map((section) => (
                    <div key={section.title} className="admin-nav-section">
                        {!collapsed && <div className="admin-nav-section-title">{section.title}</div>}
                        {section.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `admin-nav-item ${isActive ? 'admin-nav-item-active' : ''}`
                                }
                                onClick={handleNavClick}
                            >
                                <item.icon size={20} />
                                {!collapsed && <span>{item.label}</span>}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="admin-sidebar-collapse-btn" onClick={onToggle}>
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                {!collapsed && <span>Collapse</span>}
            </div>
        </aside>
    );
}
