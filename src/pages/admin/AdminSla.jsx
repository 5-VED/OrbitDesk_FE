import { useState } from 'react';
import {
    Clock,
    Plus,
    Edit,
    Trash2,
    AlertTriangle,
    CheckCircle2,
    Timer,
    Target,
    ToggleLeft,
    ToggleRight,
    Copy,
    ArrowUp
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import './AdminSla.css';

const mockSlaPolicies = [
    {
        id: 1,
        name: 'Premium Support',
        description: 'For enterprise customers with premium support plan',
        isDefault: true,
        isActive: true,
        targets: {
            urgent: { firstResponse: '15 min', resolution: '1 hour' },
            high: { firstResponse: '30 min', resolution: '4 hours' },
            medium: { firstResponse: '2 hours', resolution: '8 hours' },
            low: { firstResponse: '4 hours', resolution: '24 hours' },
        },
        appliedTo: '3 organizations',
        compliance: 94,
    },
    {
        id: 2,
        name: 'Standard Support',
        description: 'Default SLA for all customers',
        isDefault: false,
        isActive: true,
        targets: {
            urgent: { firstResponse: '1 hour', resolution: '4 hours' },
            high: { firstResponse: '4 hours', resolution: '8 hours' },
            medium: { firstResponse: '8 hours', resolution: '24 hours' },
            low: { firstResponse: '24 hours', resolution: '48 hours' },
        },
        appliedTo: '12 organizations',
        compliance: 87,
    },
    {
        id: 3,
        name: 'Internal IT',
        description: 'SLA for internal team requests',
        isDefault: false,
        isActive: true,
        targets: {
            urgent: { firstResponse: '30 min', resolution: '2 hours' },
            high: { firstResponse: '2 hours', resolution: '8 hours' },
            medium: { firstResponse: '4 hours', resolution: '24 hours' },
            low: { firstResponse: '8 hours', resolution: '48 hours' },
        },
        appliedTo: '1 organization',
        compliance: 91,
    },
    {
        id: 4,
        name: 'Free Tier',
        description: 'Basic SLA for free plan users',
        isDefault: false,
        isActive: false,
        targets: {
            urgent: { firstResponse: '4 hours', resolution: '24 hours' },
            high: { firstResponse: '8 hours', resolution: '48 hours' },
            medium: { firstResponse: '24 hours', resolution: '72 hours' },
            low: { firstResponse: '48 hours', resolution: '1 week' },
        },
        appliedTo: '0 organizations',
        compliance: null,
    },
];

const priorityColors = {
    urgent: 'danger',
    high: 'warning',
    medium: 'primary',
    low: 'default',
};

export function AdminSla() {
    const [policies] = useState(mockSlaPolicies);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="admin-sla">
            {/* Page Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">SLA Policies</h1>
                    <p className="admin-page-subtitle">Define response and resolution targets for ticket priorities</p>
                </div>
                <div className="admin-page-actions">
                    <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>Create Policy</Button>
                </div>
            </div>

            {/* SLA Compliance Summary */}
            <div className="admin-sla-summary">
                <Card className="admin-sla-summary-card">
                    <div className="admin-sla-summary-icon" data-color="success">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <span className="admin-sla-summary-value">91%</span>
                        <span className="admin-sla-summary-label">Avg. Compliance</span>
                    </div>
                </Card>
                <Card className="admin-sla-summary-card">
                    <div className="admin-sla-summary-icon" data-color="warning">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <span className="admin-sla-summary-value">12</span>
                        <span className="admin-sla-summary-label">Breaches Today</span>
                    </div>
                </Card>
                <Card className="admin-sla-summary-card">
                    <div className="admin-sla-summary-icon" data-color="primary">
                        <Timer size={20} />
                    </div>
                    <div>
                        <span className="admin-sla-summary-value">2.4h</span>
                        <span className="admin-sla-summary-label">Avg. Response</span>
                    </div>
                </Card>
                <Card className="admin-sla-summary-card">
                    <div className="admin-sla-summary-icon" data-color="info">
                        <Target size={20} />
                    </div>
                    <div>
                        <span className="admin-sla-summary-value">{policies.filter(p => p.isActive).length}</span>
                        <span className="admin-sla-summary-label">Active Policies</span>
                    </div>
                </Card>
            </div>

            {/* Policies List */}
            <div className="admin-sla-policies">
                {policies.map((policy) => (
                    <Card key={policy.id} className={`admin-sla-policy ${!policy.isActive ? 'inactive' : ''}`}>
                        <div className="admin-sla-policy-header">
                            <div className="admin-sla-policy-info">
                                <div className="admin-sla-policy-title-row">
                                    <h3 className="admin-sla-policy-name">{policy.name}</h3>
                                    {policy.isDefault && <Badge variant="primary">Default</Badge>}
                                    <Badge variant={policy.isActive ? 'success' : 'default'}>
                                        {policy.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <p className="admin-sla-policy-desc">{policy.description}</p>
                                <span className="admin-sla-policy-applied">{policy.appliedTo}</span>
                            </div>
                            <div className="admin-sla-policy-actions">
                                {policy.compliance !== null && (
                                    <div className={`admin-sla-compliance-badge ${policy.compliance >= 90 ? 'good' : 'warning'}`}>
                                        <span>{policy.compliance}%</span>
                                        <span className="admin-sla-compliance-label">compliance</span>
                                    </div>
                                )}
                                <div className="admin-sla-policy-btns">
                                    <button className="admin-users-action-btn" title="Duplicate">
                                        <Copy size={15} />
                                    </button>
                                    <button className="admin-users-action-btn" title="Edit">
                                        <Edit size={15} />
                                    </button>
                                    <button className="admin-users-action-btn danger" title="Delete">
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
                            {Object.entries(policy.targets).map(([priority, targets]) => (
                                <div key={priority} className="admin-sla-target-row">
                                    <Badge variant={priorityColors[priority]}>{priority}</Badge>
                                    <span className="admin-sla-target-time">
                                        <Clock size={13} />
                                        {targets.firstResponse}
                                    </span>
                                    <span className="admin-sla-target-time">
                                        <Timer size={13} />
                                        {targets.resolution}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Create Policy Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create SLA Policy"
            >
                <form className="admin-users-form" onSubmit={(e) => { e.preventDefault(); setIsCreateModalOpen(false); }}>
                    <Input label="Policy Name" placeholder="e.g. Premium Support" required />
                    <Input label="Description" placeholder="Brief description" />
                    <div className="admin-sla-form-section">
                        <h4 className="admin-sla-form-section-title">Response & Resolution Targets</h4>
                        {['Urgent', 'High', 'Medium', 'Low'].map(priority => (
                            <div key={priority} className="admin-sla-form-priority-row">
                                <span className="admin-sla-form-priority-label">{priority}</span>
                                <Input label="First Response" placeholder="e.g. 1 hour" />
                                <Input label="Resolution" placeholder="e.g. 4 hours" />
                            </div>
                        ))}
                    </div>
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Plus}>Create Policy</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
