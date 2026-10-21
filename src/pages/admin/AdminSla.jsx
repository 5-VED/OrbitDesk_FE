import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button as MuiButton,
    IconButton,
    CircularProgress,
    Stack,
    Paper,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Clock,
    Plus,
    Edit,
    Trash2,
    AlertTriangle,
    CheckCircle2,
    Timer,
    Target,
    Copy
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { slaService } from '@/features/settings/api/sla';
import { toast } from 'react-hot-toast';

const priorityColors = {
    urgent: 'danger',
    high: 'warning',
    normal: 'primary',
    medium: 'primary',
    low: 'default',
};

const PRIORITIES = ['urgent', 'high', 'normal', 'low'];

const minutesToLabel = (mins) => {
    if (!mins && mins !== 0) return '-';
    if (mins < 60) return `${mins} min`;
    if (mins < 1440) return `${(mins / 60).toFixed(mins % 60 ? 1 : 0)} hours`;
    return `${(mins / 1440).toFixed(mins % 1440 ? 1 : 0)} days`;
};

const buildEmptyTargets = () =>
    PRIORITIES.reduce((acc, p) => {
        acc[p] = { first_reply_time: '', resolution_time: '' };
        return acc;
    }, {});

const policyMetricsToTargets = (metrics = []) => {
    const targets = buildEmptyTargets();
    metrics.forEach((m) => {
        if (targets[m.priority] && m.target) {
            targets[m.priority][m.target] = String(m.target_minutes || '');
        }
    });
    return targets;
};

const targetsToMetrics = (targets) => {
    const metrics = [];
    PRIORITIES.forEach((priority) => {
        const t = targets[priority];
        if (t.first_reply_time) {
            metrics.push({ priority, target: 'first_reply_time', target_minutes: Number(t.first_reply_time) });
        }
        if (t.resolution_time) {
            metrics.push({ priority, target: 'resolution_time', target_minutes: Number(t.resolution_time) });
        }
    });
    return metrics;
};

export function AdminSla() {
    const [policies, setPolicies] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formTargets, setFormTargets] = useState(buildEmptyTargets());
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [policyRes, metricsRes] = await Promise.all([
                slaService.list(),
                slaService.getMetrics(),
            ]);
            setPolicies(policyRes.data || []);
            setMetrics(metricsRes.data || null);
        } catch {
            toast.error('Failed to load SLA data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const openCreateModal = () => {
        setEditingPolicy(null);
        setFormTitle('');
        setFormDescription('');
        setFormTargets(buildEmptyTargets());
        setIsModalOpen(true);
    };

    const openEditModal = (policy) => {
        setEditingPolicy(policy);
        setFormTitle(policy.title);
        setFormDescription(policy.description || '');
        setFormTargets(policyMetricsToTargets(policy.policy_metrics));
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formTitle.trim()) { toast.error('Policy name is required'); return; }

        setSaving(true);
        try {
            const payload = {
                title: formTitle.trim(),
                description: formDescription.trim(),
                policy_metrics: targetsToMetrics(formTargets),
            };

            if (editingPolicy) {
                await slaService.update(editingPolicy._id, payload);
                toast.success('Policy updated');
            } else {
                await slaService.create(payload);
                toast.success('Policy created');
            }
            setIsModalOpen(false);
            fetchData();
        } catch {
            toast.error('Failed to save policy');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this SLA policy?')) return;
        try {
            await slaService.delete(id);
            toast.success('Policy deleted');
            fetchData();
        } catch {
            toast.error('Failed to delete policy');
        }
    };

    const handleDuplicate = async (policy) => {
        try {
            await slaService.create({
                title: `${policy.title} (Copy)`,
                description: policy.description || '',
                policy_metrics: policy.policy_metrics || [],
            });
            toast.success('Policy duplicated');
            fetchData();
        } catch {
            toast.error('Failed to duplicate policy');
        }
    };

    const handleToggleActive = async (policy) => {
        try {
            await slaService.update(policy._id, { is_active: !policy.is_active });
            toast.success(policy.is_active ? 'Policy deactivated' : 'Policy activated');
            fetchData();
        } catch {
            toast.error('Failed to update policy');
        }
    };

    const updateTarget = (priority, field, value) => {
        setFormTargets((prev) => ({
            ...prev,
            [priority]: { ...prev[priority], [field]: value },
        }));
    };

    const buildTargetsView = (policy) => {
        const map = {};
        (policy.policy_metrics || []).forEach((m) => {
            if (!map[m.priority]) map[m.priority] = {};
            map[m.priority][m.target] = m.target_minutes;
        });
        return map;
    };

    const getComplianceForPolicy = (policyId) => {
        if (!metrics?.policiesCompliance) return null;
        const found = metrics.policiesCompliance.find((p) => p._id === policyId);
        return found?.compliance ?? null;
    };

    const getTicketCountForPolicy = (policyId) => {
        if (!metrics?.policiesCompliance) return 0;
        const found = metrics.policiesCompliance.find((p) => p._id === policyId);
        return found?.ticketCount ?? 0;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 2 }}>
                <CircularProgress size={36} color="primary" />
                <Typography color="text.secondary">Loading SLA data...</Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            {/* Page Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={800}>SLA Policies</Typography>
                    <Typography variant="body2" color="text.secondary">Define response and resolution targets for ticket priorities</Typography>
                </Box>
                <MuiButton
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={16} />}
                    onClick={openCreateModal}
                    sx={{ textTransform: 'none' }}
                >
                    Create Policy
                </MuiButton>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={2}>
                {[
                    { label: 'Avg. Compliance', value: `${metrics?.overallCompliance ?? 0}%`, icon: CheckCircle2, color: 'success.main', bg: 'rgba(34, 197, 94, 0.1)' },
                    { label: 'Breaches Today', value: metrics?.breachesToday ?? 0, icon: AlertTriangle, color: 'warning.main', bg: 'rgba(245, 158, 11, 0.1)' },
                    { label: 'Avg. Response', value: metrics?.avgResponseTime ?? '0h', icon: Timer, color: 'primary.main', bg: 'rgba(244, 67, 54, 0.1)' },
                    { label: 'Active Policies', value: metrics?.activePolicies ?? 0, icon: Target, color: 'info.main', bg: 'rgba(59, 130, 246, 0.1)' }
                ].map((stat) => (
                    <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
                        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <stat.icon size={20} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={800}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Policies List */}
            <Stack spacing={3}>
                {policies.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                        <Typography color="text.secondary">No SLA policies yet. Create your first policy to get started.</Typography>
                    </Paper>
                ) : (
                    policies.map((policy) => {
                        const compliance = getComplianceForPolicy(policy._id);
                        const ticketCount = getTicketCountForPolicy(policy._id);
                        const targetsMap = buildTargetsView(policy);
                        const isActive = policy.is_active !== false;

                        return (
                            <Card key={policy._id} variant="outlined" sx={{ borderRadius: 2, opacity: isActive ? 1 : 0.75 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                                <Typography variant="h6" fontWeight={700}>
                                                    {policy.title}
                                                </Typography>
                                                {policy.is_default && <Badge variant="primary">Default</Badge>}
                                                <Badge variant={isActive ? 'success' : 'default'}>
                                                    {isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </Box>
                                            {policy.description && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                    {policy.description}
                                                </Typography>
                                            )}
                                            <Typography variant="caption" color="text.secondary">
                                                {ticketCount} ticket{ticketCount !== 1 ? 's' : ''} using this policy
                                            </Typography>
                                        </Box>

                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {compliance !== null && (
                                                <Chip
                                                    label={`${compliance}% compliance`}
                                                    size="small"
                                                    color={compliance >= 90 ? 'success' : 'warning'}
                                                    variant="outlined"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            )}
                                            <Tooltip title="Toggle Active">
                                                <IconButton size="small" onClick={() => handleToggleActive(policy)}>
                                                    {isActive ? <CheckCircle2 size={16} color="#10b981" /> : <Clock size={16} />}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Duplicate">
                                                <IconButton size="small" onClick={() => handleDuplicate(policy)}>
                                                    <Copy size={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => openEditModal(policy)}>
                                                    <Edit size={16} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(policy._id)}>
                                                    <Trash2 size={16} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Box>

                                    {/* Target Matrix Table */}
                                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>First Response Target</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Resolution Target</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {PRIORITIES.map((priority) => (
                                                    <TableRow key={priority}>
                                                        <TableCell>
                                                            <Badge variant={priorityColors[priority]}>{priority}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.85rem' }}>
                                                                <Clock size={14} />
                                                                <span>{minutesToLabel(targetsMap[priority]?.first_reply_time)}</span>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.85rem' }}>
                                                                <Timer size={14} />
                                                                <span>{minutesToLabel(targetsMap[priority]?.resolution_time)}</span>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </Stack>

            {/* Create/Edit Policy Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPolicy ? 'Edit SLA Policy' : 'Create SLA Policy'}
                size="large"
            >
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        label="Policy Name"
                        placeholder="e.g. Premium Support"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                        fullWidth
                        size="small"
                    />
                    <TextField
                        label="Description"
                        placeholder="Brief description"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                    />

                    <Box>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                            Response & Resolution Targets (in minutes)
                        </Typography>
                        <Stack spacing={1.5}>
                            {PRIORITIES.map((priority) => (
                                <Paper key={priority} variant="outlined" sx={{ p: 2, borderRadius: 1.5 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 12, sm: 3 }}>
                                            <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                                                {priority}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4.5 }}>
                                            <TextField
                                                label="First Response (min)"
                                                type="number"
                                                slotProps={{ htmlInput: { min: 0 } }}
                                                placeholder="e.g. 60"
                                                value={formTargets[priority]?.first_reply_time || ''}
                                                onChange={(e) => updateTarget(priority, 'first_reply_time', e.target.value)}
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4.5 }}>
                                            <TextField
                                                label="Resolution (min)"
                                                type="number"
                                                slotProps={{ htmlInput: { min: 0 } }}
                                                placeholder="e.g. 240"
                                                value={formTargets[priority]?.resolution_time || ''}
                                                onChange={(e) => updateTarget(priority, 'resolution_time', e.target.value)}
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                        <MuiButton variant="outlined" color="inherit" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </MuiButton>
                        <MuiButton type="submit" variant="contained" color="primary" disabled={saving} startIcon={editingPolicy ? <Edit size={16} /> : <Plus size={16} />}>
                            {saving ? 'Saving...' : (editingPolicy ? 'Update Policy' : 'Create Policy')}
                        </MuiButton>
                    </Box>
                </Box>
            </Modal>
        </Stack>
    );
}
