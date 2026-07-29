import { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const res = await organizationService.list();
                setOrgs(res?.data || []);
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchOrgs();
    }, []);

    const filteredOrgs = orgs.filter(org =>
        !searchQuery || org.name.toLowerCase().includes(searchQuery.toLowerCase()) || (org.domains || []).some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="admin-dashboard-loading">
                <Loader2 size={32} className="spin" />
                <p>Loading organizations...</p>
            </div>
        );
    }

    return (
        <div className="admin-orgs">
            {/* Page Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Organizations</h1>
                    <p className="admin-page-subtitle">Manage customer organizations and their settings</p>
                </div>
                <div className="admin-page-actions">
                    <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>Add Organization</Button>
                </div>
            </div>

            {/* Search Bar */}
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

            {/* Org Cards Grid */}
            <div className="admin-orgs-grid">
                {filteredOrgs.map((org) => (
                    <Card key={org._id} className="admin-org-card" hover>
                        <div className="admin-org-card-top">
                            <div className="admin-org-avatar">
                                <Building2 size={24} />
                            </div>
                            <div className="admin-org-card-actions">
                                <button className="admin-users-action-btn" title="View"><Eye size={15} /></button>
                                <button className="admin-users-action-btn" title="Edit"><Edit size={15} /></button>
                                <button className="admin-users-action-btn danger" title="Delete"><Trash2 size={15} /></button>
                            </div>
                        </div>
                        <h3 className="admin-org-name">{org.name}</h3>
                        <div className="admin-org-domain">
                            <Globe size={13} />
                            <span>{(org.domains || [])[0] || 'No domain'}</span>
                        </div>
                        <div className="admin-org-badges">
                            <Badge variant={org.is_active ? 'success' : 'default'}>
                                {org.is_active ? 'active' : 'inactive'}
                            </Badge>
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
                        <div className="admin-org-sla">
                            SLA: <strong>{org.slaPolicy || 'Default'}</strong>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Create Org Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Add Organization"
            >
                <form className="admin-users-form" onSubmit={(e) => { e.preventDefault(); setIsCreateModalOpen(false); }}>
                    <Input label="Organization Name" placeholder="e.g. Acme Corp" required />
                    <Input label="Domain" placeholder="e.g. acme.com" />
                    <Input label="Contact Email" type="email" placeholder="admin@acme.com" />
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Plus}>Create Organization</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
