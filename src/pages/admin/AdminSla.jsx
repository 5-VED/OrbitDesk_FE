import { useState, useEffect, useCallback } from 'react';
import {
    Clock,
    Plus,
    Edit,
    Trash2,
    AlertTriangle,
    CheckCircle2,
    Timer,
    Target,
    Copy,
    Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { slaService } from '@/features/settings/api/sla';
import { toast } from 'react-hot-toast';
import './AdminSla.css';

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
            <div className="admin-sla" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <Loader2 size={32} className="spin" />
            </div>
        );
    }

    return (
        <div className="admin-sla">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">SLA Policies</h1>
                    <p className="admin-page-subtitle">Define response and resolution targets for ticket priorities</p>
                </div>
                <div className="admin-page-actions">
                    <Button icon={Plus} onClick={openCreateModal}>Create Policy</Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="admin-sla-summary">
                <Card className="admin-sla-summary-card">
                    <div className="admin-sla-summary-icon" data-color="success">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <span className="admin-sla-summary-value">{metrics?.overallCompliance ?? 0}%</span>
                        <span className="admin-sla-summary-label">Avg. Compliance</span>
                    </div>
                </Card>
                <Card className="admin-sla-summary-card">
                    <div className="admin-sla-summary-icon" data-color="warning">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <span className="admin-sla-summary-value">{metrics?.breachesToday ?? 0}</span>
                        <span className="admin-sla-summary-label">Breaches Today</span>
                    </div>
                </Card>
                <Card className="admin-sla-summary-card">
                    <div className="admin-sla-summary-icon" data-color="primary">
                        <Timer size={20} />
                    </div>
                    <div>
                        <span className="admin-sla-summary-value">{metrics?.avgResponseTime ?? '0h'}</span>
                        <span className="admin-sla-summary-label">Avg. Response</span>
                    </div>
                </Card>
                <Card className="admin-sla-summary-card">
                    <div className="admin-sla-summary-icon" data-color="info">
                        <Target size={20} />
                    </div>
                    <div>
                        <span className="admin-sla-summary-value">{metrics?.activePolicies ?? 0}</span>
                        <span className="admin-sla-summary-label">Active Policies</span>
                    </div>
                </Card>
            </div>

            {/* Policies List */}
            <div className="admin-sla-policies">
                {policies.length === 0 && (
                    <Card>
                        <CardContent>
                            <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: '2rem 0' }}>
                                No SLA policies yet. Create your first policy to get started.
                            </p>
                        </CardContent>
                    </Card>
                )}
                {policies.map((policy) => {
                    const compliance = getComplianceForPolicy(policy._id);
                    const ticketCount = getTicketCountForPolicy(policy._id);
                    const targetsMap = buildTargetsView(policy);
                    const isActive = policy.is_active !== false;

                    return (
                        <Card key={policy._id} className={`admin-sla-policy ${!isActive ? 'inactive' : ''}`}>
                            <div className="admin-sla-policy-header">
                                <div className="admin-sla-policy-info">
                                    <div className="admin-sla-policy-title-row">
                                        <h3 className="admin-sla-policy-name">{policy.title}</h3>
                                        {policy.is_default && <Badge variant="primary">Default</Badge>}
                                        <Badge variant={isActive ? 'success' : 'default'}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    {policy.description && <p className="admin-sla-policy-desc">{policy.description}</p>}
                                    <span className="admin-sla-policy-applied">
                                        {ticketCount} ticket{ticketCount !== 1 ? 's' : ''} using this policy
                                    </span>
                                </div>
                                <div className="admin-sla-policy-actions">
                                    {compliance !== null && (
                                        <div className={`admin-sla-compliance-badge ${compliance >= 90 ? 'good' : 'warning'}`}>
                                            <span>{compliance}%</span>
                                            <span className="admin-sla-compliance-label">compliance</span>
                                        </div>
                                    )}
                                    <div className="admin-sla-policy-btns">
                                        <button className="admin-users-action-btn" title="Toggle Active" onClick={() => handleToggleActive(policy)}>
                                            {isActive
                                                ? <CheckCircle2 size={15} />
                                                : <Clock size={15} />
                                            }
                                        </button>
                                        <button className="admin-users-action-btn" title="Duplicate" onClick={() => handleDuplicate(policy)}>
                                            <Copy size={15} />
                                        </button>
                                        <button className="admin-users-action-btn" title="Edit" onClick={() => openEditModal(policy)}>
                                            <Edit size={15} />
                                        </button>
                                        <button className="admin-users-action-btn danger" title="Delete" onClick={() => handleDelete(policy._id)}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Target Matrix */}
                            <div className="admin-sla-targets">
                                <div className="admin-sla-targets-header">
                                    <span>Priority</span>
                                    <span>First Response</span>
                                    <span>Resolution</span>
                                </div>
                                {PRIORITIES.map((priority) => (
                                    <div key={priority} className="admin-sla-target-row">
                                        <Badge variant={priorityColors[priority]}>{priority}</Badge>
                                        <span className="admin-sla-target-time">
                                            <Clock size={13} />
                                            {minutesToLabel(targetsMap[priority]?.first_reply_time)}
                                        </span>
                                        <span className="admin-sla-target-time">
                                            <Timer size={13} />
                                            {minutesToLabel(targetsMap[priority]?.resolution_time)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Create/Edit Policy Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPolicy ? 'Edit SLA Policy' : 'Create SLA Policy'}
            >
                <form className="admin-users-form" onSubmit={handleSubmit}>
                    <Input
                        label="Policy Name"
                        placeholder="e.g. Premium Support"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                    />
                    <Input
                        label="Description"
                        placeholder="Brief description"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                    />
                    <div className="admin-sla-form-section">
                        <h4 className="admin-sla-form-section-title">Response & Resolution Targets (in minutes)</h4>
                        {PRIORITIES.map((priority) => (
                            <div key={priority} className="admin-sla-form-priority-row">
                                <span className="admin-sla-form-priority-label" style={{ textTransform: 'capitalize' }}>{priority}</span>
                                <Input
                                    label="First Response (min)"
                                    type="number"
                                    min="0"
                                    placeholder="e.g. 60"
                                    value={formTargets[priority]?.first_reply_time || ''}
                                    onChange={(e) => updateTarget(priority, 'first_reply_time', e.target.value)}
                                />
                                <Input
                                    label="Resolution (min)"
                                    type="number"
                                    min="0"
                                    placeholder="e.g. 240"
                                    value={formTargets[priority]?.resolution_time || ''}
                                    onChange={(e) => updateTarget(priority, 'resolution_time', e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={editingPolicy ? Edit : Plus} disabled={saving}>
                            {saving ? 'Saving...' : (editingPolicy ? 'Update Policy' : 'Create Policy')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
