import { useState, useEffect, useCallback } from 'react';
import {
    Building2,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Users,
    Ticket,
    Globe,
    X,
    Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { organizationService } from '@/features/organizations/api/organizations';
import './AdminOrganizations.css';

export function AdminOrganizations() {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editOrg, setEditOrg] = useState(null);
    const [formData, setFormData] = useState({ name: '', domains: '', details: {} });
    const [submitting, setSubmitting] = useState(false);

    const fetchOrgs = useCallback(async () => {
        try {
            setLoading(true);
            const res = await organizationService.list();
            setOrgs(res.data || []);
        } catch (err) {
            console.error('Failed to fetch organizations:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrgs(); }, [fetchOrgs]);

    const filteredOrgs = orgs.filter(org =>
        !searchQuery || org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (org.domains || []).some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = {
                name: formData.name,
                domains: formData.domains ? formData.domains.split(',').map(d => d.trim()).filter(Boolean) : [],
            };
            await organizationService.create(payload);
            setIsCreateModalOpen(false);
            setFormData({ name: '', domains: '' });
            fetchOrgs();
        } catch (err) {
            console.error('Failed to create organization:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (org) => {
        setEditOrg(org);
        setFormData({ name: org.name, domains: (org.domains || []).join(', ') });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = {
                name: formData.name,
                domains: formData.domains ? formData.domains.split(',').map(d => d.trim()).filter(Boolean) : [],
            };
            await organizationService.update(editOrg._id, payload);
            setIsEditModalOpen(false);
            setEditOrg(null);
            fetchOrgs();
        } catch (err) {
            console.error('Failed to update organization:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this organization?')) return;
        try {
            await organizationService.delete(id);
            fetchOrgs();
        } catch (err) {
            console.error('Failed to delete organization:', err);
        }
    };

    return (
        <div className="admin-orgs">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Organizations</h1>
                    <p className="admin-page-subtitle">Manage customer organizations and their settings</p>
                </div>
                <div className="admin-page-actions">
                    <Button icon={Plus} onClick={() => { setFormData({ name: '', domains: '' }); setIsCreateModalOpen(true); }}>Add Organization</Button>
                </div>
            </div>

            <Card className="admin-orgs-toolbar">
                <div className="admin-users-toolbar">
                    <div className="admin-users-search">
                        <Search size={18} className="admin-users-search-icon" />
                        <input
                            type="text"
                            placeholder="Search organizations..."
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
                </div>
            </Card>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader2 size={24} className="animate-spin" />
                </div>
            ) : (
                <div className="admin-orgs-grid">
                    {filteredOrgs.map((org) => (
                        <Card key={org._id} className="admin-org-card" hover>
                            <div className="admin-org-card-top">
                                <div className="admin-org-avatar">
                                    <Building2 size={24} />
                                </div>
                                <div className="admin-org-card-actions">
                                    <button className="admin-users-action-btn" title="Edit" onClick={() => handleEdit(org)}><Edit size={15} /></button>
                                    <button className="admin-users-action-btn danger" title="Delete" onClick={() => handleDelete(org._id)}><Trash2 size={15} /></button>
                                </div>
                            </div>
                            <h3 className="admin-org-name">{org.name}</h3>
                            <div className="admin-org-domain">
                                <Globe size={13} />
                                <span>{org.domains?.length ? org.domains[0] : '—'}</span>
                            </div>
                            <div className="admin-org-badges">
                                <Badge variant={org.is_active ? 'success' : 'default'}>{org.is_active ? 'active' : 'inactive'}</Badge>
                            </div>
                            <div className="admin-org-stats">
                                <div className="admin-org-stat">
                                    <Users size={14} />
                                    <span>{org.userCount || 0} users</span>
                                </div>
                                <div className="admin-org-stat">
                                    <Ticket size={14} />
                                    <span>{org.ticketCount || 0} tickets</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {filteredOrgs.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--color-text-tertiary)' }}>
                            No organizations found
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add Organization">
                <form className="admin-users-form" onSubmit={handleCreate}>
                    <Input label="Organization Name" placeholder="e.g. Acme Corp" required value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} />
                    <Input label="Domains (comma separated)" placeholder="e.g. acme.com, acme.io" value={formData.domains} onChange={(e) => setFormData(p => ({ ...p, domains: e.target.value }))} />
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Plus} disabled={submitting}>{submitting ? 'Creating...' : 'Create Organization'}</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Organization">
                <form className="admin-users-form" onSubmit={handleUpdate}>
                    <Input label="Organization Name" placeholder="e.g. Acme Corp" required value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} />
                    <Input label="Domains (comma separated)" placeholder="e.g. acme.com, acme.io" value={formData.domains} onChange={(e) => setFormData(p => ({ ...p, domains: e.target.value }))} />
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Edit} disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
