import { useState, useEffect, useCallback, useRef } from 'react';
import {
    ScrollText,
    Search,
    Download,
    Calendar,
    Users,
    Shield,
    Activity,
    Clock,
    Settings,
    X,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { auditLogService } from '@/services/auditLog.service';
import { toast } from 'react-hot-toast';
import './AdminAuditLog.css';

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
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0, limit: 50 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const debounceRef = useRef(null);

    const fetchLogs = useCallback(async (page, search, category) => {
        setLoading(true);
        try {
            const params = { page, limit: 50 };
            if (search) params.search = search;
            if (category) params.category = category;

            const res = await auditLogService.list(params);
            setLogs(res.data?.logs || []);
            setPagination(res.data?.pagination || { page: 1, total: 0, totalPages: 0, limit: 50 });
        } catch {
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs(currentPage, searchQuery, categoryFilter);
    }, [currentPage, categoryFilter, fetchLogs]);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setCurrentPage(1);
            fetchLogs(1, value, categoryFilter);
        }, 400);
    };

    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
        setCurrentPage(1);
    };

    const handleExport = async () => {
        try {
            const params = {};
            if (searchQuery) params.search = searchQuery;
            if (categoryFilter) params.category = categoryFilter;

            const blob = await auditLogService.exportCsv(params);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'audit-log.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Audit log exported');
        } catch {
            toast.error('Failed to export audit log');
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPageButtons = () => {
        const pages = [];
        const total = pagination.totalPages;
        const current = currentPage;

        let start = Math.max(1, current - 2);
        let end = Math.min(total, current + 2);
        if (end - start < 4) {
            if (start === 1) end = Math.min(total, start + 4);
            else start = Math.max(1, end - 4);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    className={`admin-audit-page-btn ${i === current ? 'active' : ''}`}
                    onClick={() => goToPage(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const formatTimestamp = (ts) => {
        if (!ts) return '—';
        const d = new Date(ts);
        return d.toLocaleString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        });
    };

    return (
        <div className="admin-audit-log">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Audit Log</h1>
                    <p className="admin-page-subtitle">Track all system events and administrative actions</p>
                </div>
                <div className="admin-page-actions">
                    <Button variant="secondary" icon={Download} onClick={handleExport}>Export Log</Button>
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
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="admin-users-search-input"
                        />
                        {searchQuery && (
                            <button className="admin-users-search-clear" onClick={() => handleSearchChange('')}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className="admin-users-filters">
                        <select
                            value={categoryFilter}
                            onChange={(e) => handleCategoryChange(e.target.value)}
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
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <Loader2 size={28} className="spin" />
                    </div>
                ) : logs.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: '3rem' }}>
                        No audit log entries found
                    </div>
                ) : (
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
                            {logs.map((log) => {
                                const CategoryIcon = categoryIcons[log.category] || Activity;
                                return (
                                    <div key={log._id} className="admin-audit-table-row">
                                        <span className="admin-audit-col-time">
                                            <Calendar size={13} />
                                            {formatTimestamp(log.createdAt)}
                                        </span>
                                        <div className="admin-audit-col-user">
                                            <Avatar name={log.user_name} size="xs" />
                                            <div>
                                                <span className="admin-audit-user-name">{log.user_name}</span>
                                                <span className="admin-audit-user-role">{log.user_role}</span>
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
                                        <span className="admin-audit-col-ip">{log.ip_address}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 0 && (
                    <div className="admin-audit-pagination">
                        <span className="admin-audit-pagination-info">
                            Showing {Math.min((currentPage - 1) * pagination.limit + 1, pagination.total)}–{Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} events
                        </span>
                        <div className="admin-audit-pagination-controls">
                            <button
                                className="admin-audit-page-btn"
                                disabled={currentPage <= 1}
                                onClick={() => goToPage(currentPage - 1)}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {renderPageButtons()}
                            <button
                                className="admin-audit-page-btn"
                                disabled={currentPage >= pagination.totalPages}
                                onClick={() => goToPage(currentPage + 1)}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
