import { useState } from 'react';
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
    X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import './AdminOrganizations.css';

const mockOrgs = [
    { id: 1, name: 'Acme Corp', domain: 'acme.com', plan: 'Enterprise', status: 'active', users: 48, tickets: 124, slaPolicy: 'Premium Support', logo: null },
    { id: 2, name: 'TechStart Inc', domain: 'techstart.io', plan: 'Business', status: 'active', users: 23, tickets: 67, slaPolicy: 'Standard Support', logo: null },
    { id: 3, name: 'Global Solutions', domain: 'globalsolutions.com', plan: 'Enterprise', status: 'active', users: 89, tickets: 203, slaPolicy: 'Premium Support', logo: null },
    { id: 4, name: 'StartupXYZ', domain: 'startupxyz.com', plan: 'Free', status: 'inactive', users: 5, tickets: 12, slaPolicy: 'Free Tier', logo: null },
    { id: 5, name: 'MegaCorp Ltd', domain: 'megacorp.co', plan: 'Business', status: 'active', users: 34, tickets: 89, slaPolicy: 'Standard Support', logo: null },
    { id: 6, name: 'NewCorp Inc', domain: 'newcorp.com', plan: 'Business', status: 'active', users: 12, tickets: 28, slaPolicy: 'Standard Support', logo: null },
];

const planColors = {
    Enterprise: 'primary',
    Business: 'warning',
    Free: 'default',
};

export function AdminOrganizations() {
    const [orgs] = useState(mockOrgs);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredOrgs = orgs.filter(org =>
        !searchQuery || org.name.toLowerCase().includes(searchQuery.toLowerCase()) || org.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <Card key={org.id} className="admin-org-card" hover>
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
                            <span>{org.domain}</span>
                        </div>
                        <div className="admin-org-badges">
                            <Badge variant={planColors[org.plan]}>{org.plan}</Badge>
                            <Badge variant={org.status === 'active' ? 'success' : 'default'}>{org.status}</Badge>
                        </div>
                        <div className="admin-org-stats">
                            <div className="admin-org-stat">
                                <Users size={14} />
                                <span>{org.users} users</span>
                            </div>
                            <div className="admin-org-stat">
                                <Ticket size={14} />
                                <span>{org.tickets} tickets</span>
                            </div>
                        </div>
                        <div className="admin-org-sla">
                            SLA: <strong>{org.slaPolicy}</strong>
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
