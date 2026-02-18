import { useState } from 'react';
import {
    ScrollText,
    Search,
    Filter,
    Download,
    Calendar,
    Users,
    Shield,
    Activity,
    Clock,
    Ticket,
    Settings,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import './AdminAuditLog.css';

const mockAuditLogs = [
    { id: 1, timestamp: '2026-02-18 23:12:04', user: 'Jane Cooper', userRole: 'admin', action: 'Updated', resource: 'SLA Policy', target: 'Premium Support', ip: '192.168.1.45', category: 'policy' },
    { id: 2, timestamp: '2026-02-18 22:58:31', user: 'System', userRole: 'system', action: 'Auto-escalated', resource: 'Ticket', target: '#TK-1892', ip: '—', category: 'automation' },
    { id: 3, timestamp: '2026-02-18 22:45:12', user: 'Jane Cooper', userRole: 'admin', action: 'Created', resource: 'User', target: 'mike.wilson@acme.com', ip: '192.168.1.45', category: 'user' },
    { id: 4, timestamp: '2026-02-18 22:30:00', user: 'Emily Davis', userRole: 'admin', action: 'Modified', resource: 'Role', target: 'Support Lead permissions', ip: '10.0.0.23', category: 'security' },
    { id: 5, timestamp: '2026-02-18 21:15:44', user: 'System', userRole: 'system', action: 'Bulk assigned', resource: 'Tickets', target: '23 tickets → Tier 2', ip: '—', category: 'automation' },
    { id: 6, timestamp: '2026-02-18 20:42:18', user: 'Jane Cooper', userRole: 'admin', action: 'Disabled', resource: 'User', target: 'old.agent@acme.com', ip: '192.168.1.45', category: 'security' },
    { id: 7, timestamp: '2026-02-18 19:30:55', user: 'Sarah Chen', userRole: 'agent', action: 'Deleted', resource: 'Ticket Comment', target: 'on #TK-1856', ip: '172.16.0.8', category: 'data' },
    { id: 8, timestamp: '2026-02-18 18:20:33', user: 'System', userRole: 'system', action: 'Sent', resource: 'Email Notification', target: 'SLA breach alert to admin@acme.com', ip: '—', category: 'notification' },
    { id: 9, timestamp: '2026-02-18 17:45:21', user: 'Emily Davis', userRole: 'admin', action: 'Updated', resource: 'System Setting', target: 'Auto-assign toggle → ON', ip: '10.0.0.23', category: 'settings' },
    { id: 10, timestamp: '2026-02-18 16:10:08', user: 'Mike Johnson', userRole: 'agent', action: 'Exported', resource: 'Report', target: 'Monthly ticket summary', ip: '192.168.1.102', category: 'data' },
    { id: 11, timestamp: '2026-02-18 15:55:44', user: 'Jane Cooper', userRole: 'admin', action: 'Created', resource: 'Organization', target: 'NewCorp Inc.', ip: '192.168.1.45', category: 'data' },
    { id: 12, timestamp: '2026-02-18 14:30:19', user: 'System', userRole: 'system', action: 'Auto-closed', resource: 'Tickets', target: '5 stale tickets', ip: '—', category: 'automation' },
];

const categoryColors = {
    policy: 'primary',
    automation: 'info',
    user: 'success',
    security: 'danger',
    data: 'warning',
    notification: 'default',
    settings: 'primary',
};

const categoryIcons = {
    policy: Clock,
    automation: Activity,
    user: Users,
    security: Shield,
    data: ScrollText,
    notification: Activity,
    settings: Settings,
};

const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'policy', label: 'Policy' },
    { value: 'automation', label: 'Automation' },
    { value: 'user', label: 'User' },
    { value: 'security', label: 'Security' },
    { value: 'data', label: 'Data' },
    { value: 'notification', label: 'Notification' },
    { value: 'settings', label: 'Settings' },
];

export function AdminAuditLog() {
    const [logs] = useState(mockAuditLogs);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const filteredLogs = logs.filter((log) => {
        const matchesSearch = !searchQuery ||
            log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.target.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !categoryFilter || log.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="admin-audit-log">
            {/* Page Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Audit Log</h1>
                    <p className="admin-page-subtitle">Track all system events and administrative actions</p>
                </div>
                <div className="admin-page-actions">
                    <Button variant="secondary" icon={Download}>Export Log</Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="admin-audit-toolbar">
                <div className="admin-users-toolbar">
                    <div className="admin-users-search">
                        <Search size={18} className="admin-users-search-icon" />
                        <input
                            type="text"
                            placeholder="Search by user, action, or target..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="admin-users-search-input"
                        />
                        {searchQuery && (
                            <button className="admin-users-search-clear" onClick={() => setSearchQuery('')}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className="admin-users-filters">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="admin-users-filter-select"
                        >
                            {categoryOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Audit Table */}
            <Card className="admin-audit-table-card">
                <div className="admin-audit-table">
                    <div className="admin-audit-table-header">
                        <span className="admin-audit-col-time">Timestamp</span>
                        <span className="admin-audit-col-user">User</span>
                        <span className="admin-audit-col-action">Action</span>
                        <span className="admin-audit-col-resource">Resource</span>
                        <span className="admin-audit-col-target">Target</span>
                        <span className="admin-audit-col-category">Category</span>
                        <span className="admin-audit-col-ip">IP Address</span>
                    </div>
                    <div className="admin-audit-table-body">
                        {filteredLogs.map((log) => {
                            const CategoryIcon = categoryIcons[log.category] || Activity;
                            return (
                                <div key={log.id} className="admin-audit-table-row">
                                    <span className="admin-audit-col-time">
                                        <Calendar size={13} />
                                        {log.timestamp}
                                    </span>
                                    <div className="admin-audit-col-user">
                                        <Avatar name={log.user} size="xs" />
                                        <div>
                                            <span className="admin-audit-user-name">{log.user}</span>
                                            <span className="admin-audit-user-role">{log.userRole}</span>
                                        </div>
                                    </div>
                                    <span className="admin-audit-col-action">{log.action}</span>
                                    <span className="admin-audit-col-resource">{log.resource}</span>
                                    <span className="admin-audit-col-target">{log.target}</span>
                                    <div className="admin-audit-col-category">
                                        <Badge variant={categoryColors[log.category] || 'default'}>
                                            {log.category}
                                        </Badge>
                                    </div>
                                    <span className="admin-audit-col-ip">{log.ip}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pagination */}
                <div className="admin-audit-pagination">
                    <span className="admin-audit-pagination-info">
                        Showing {filteredLogs.length} of {logs.length} events
                    </span>
                    <div className="admin-audit-pagination-controls">
                        <button className="admin-audit-page-btn" disabled>
                            <ChevronLeft size={16} />
                        </button>
                        <button className="admin-audit-page-btn active">1</button>
                        <button className="admin-audit-page-btn">2</button>
                        <button className="admin-audit-page-btn">3</button>
                        <button className="admin-audit-page-btn">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
