import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box,
    Card,
    Typography,
    Button as MuiButton,
    IconButton,
    TextField,
    MenuItem,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    Pagination,
    CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Search,
    Download,
    Calendar,
    X
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { auditLogService } from '@/services/auditLog.service';
import { toast } from 'react-hot-toast';

const categoryColors = {
    policy: 'primary',
    automation: 'info',
    user: 'success',
    security: 'danger',
    data: 'warning',
    notification: 'default',
    settings: 'primary',
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

    const formatTimestamp = (ts) => {
        if (!ts) return '—';
        const d = new Date(ts);
        return d.toLocaleString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        });
    };

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={800}>Audit Log</Typography>
                    <Typography variant="body2" color="text.secondary">Track all system events and administrative actions</Typography>
                </Box>
                <MuiButton
                    variant="outlined"
                    color="inherit"
                    startIcon={<Download size={16} />}
                    onClick={handleExport}
                    sx={{ textTransform: 'none' }}
                >
                    Export Log
                </MuiButton>
            </Box>

            {/* Filters Toolbar */}
            <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Search by user, action, or target..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search size={18} color="var(--color-text-secondary, #94a3b8)" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery ? (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => handleSearchChange('')}>
                                                <X size={14} />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            select
                            size="small"
                            fullWidth
                            value={categoryFilter}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                        >
                            {categoryOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Card>

            {/* Audit Table */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress size={32} color="primary" />
                    </Box>
                ) : logs.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                        No audit log entries found
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Resource</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Target</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>IP Address</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log._id} hover>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.85rem', color: 'text.secondary' }}>
                                                <Calendar size={13} />
                                                <span>{formatTimestamp(log.createdAt)}</span>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar name={log.user_name} size="xs" />
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {log.user_name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {log.user_role}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>
                                                {log.action}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {log.resource}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="primary.main" fontWeight={500}>
                                                {log.target}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={categoryColors[log.category] || 'default'}>
                                                {log.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                                {log.ip_address}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Pagination */}
                {pagination.totalPages > 0 && (
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            Showing {Math.min((currentPage - 1) * pagination.limit + 1, pagination.total)}–{Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} events
                        </Typography>
                        <Pagination
                            count={pagination.totalPages}
                            page={currentPage}
                            onChange={(e, p) => setCurrentPage(p)}
                            color="primary"
                            size="small"
                        />
                    </Box>
                )}
            </Card>
        </Stack>
    );
}
