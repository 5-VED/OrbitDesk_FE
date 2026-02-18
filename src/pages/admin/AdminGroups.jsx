import { useState } from 'react';
import {
    UsersRound,
    Plus,
    Edit,
    Trash2,
    Users,
    Eye,
    Search,
    X,
    UserPlus,
    UserMinus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import './AdminGroups.css';

const mockGroups = [
    { id: 1, name: 'Tier 1 Support', description: 'First-line support for general inquiries', members: ['Sarah Chen', 'Priya Patel', 'Alex Kim'], ticketLoad: 45, avgResponse: '1.2h' },
    { id: 2, name: 'Tier 2 Support', description: 'Escalated technical issues', members: ['Mike Johnson', 'David Lee'], ticketLoad: 28, avgResponse: '2.8h' },
    { id: 3, name: 'Billing', description: 'Payment and subscription inquiries', members: ['Alex Kim', 'Emily Davis'], ticketLoad: 18, avgResponse: '3.1h' },
    { id: 4, name: 'Engineering', description: 'Bug fixes and feature requests', members: ['Mike Johnson'], ticketLoad: 12, avgResponse: '5.4h' },
    { id: 5, name: 'VIP Support', description: 'Dedicated support for enterprise clients', members: ['Sarah Chen', 'Mike Johnson', 'Emily Davis'], ticketLoad: 8, avgResponse: '0.8h' },
];

export function AdminGroups() {
    const [groups] = useState(mockGroups);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredGroups = groups.filter(g =>
        !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-groups">
            {/* Page Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Agent Groups</h1>
                    <p className="admin-page-subtitle">Organize agents into teams for ticket routing and workload management</p>
                </div>
                <div className="admin-page-actions">
                    <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>Create Group</Button>
                </div>
            </div>

            {/* Search */}
            <Card className="admin-groups-toolbar">
                <div className="admin-users-toolbar">
                    <div className="admin-users-search">
                        <Search size={18} className="admin-users-search-icon" />
                        <input
                            type="text"
                            placeholder="Search groups..."
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

            {/* Groups Grid */}
            <div className="admin-groups-grid">
                {filteredGroups.map((group) => (
                    <Card key={group.id} className="admin-group-card" hover>
                        <div className="admin-group-card-top">
                            <div className="admin-group-icon">
                                <UsersRound size={22} />
                            </div>
                            <div className="admin-group-card-actions">
                                <button className="admin-users-action-btn" title="Edit"><Edit size={15} /></button>
                                <button className="admin-users-action-btn danger" title="Delete"><Trash2 size={15} /></button>
                            </div>
                        </div>
                        <h3 className="admin-group-name">{group.name}</h3>
                        <p className="admin-group-desc">{group.description}</p>

                        {/* Members */}
                        <div className="admin-group-members">
                            <span className="admin-group-members-label">Members ({group.members.length})</span>
                            <div className="admin-group-member-avatars">
                                {group.members.slice(0, 4).map((member) => (
                                    <Avatar key={member} name={member} size="xs" />
                                ))}
                                {group.members.length > 4 && (
                                    <span className="admin-group-more">+{group.members.length - 4}</span>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="admin-group-stats">
                            <div className="admin-group-stat-item">
                                <span className="admin-group-stat-value">{group.ticketLoad}</span>
                                <span className="admin-group-stat-label">Active Tickets</span>
                            </div>
                            <div className="admin-group-stat-divider" />
                            <div className="admin-group-stat-item">
                                <span className="admin-group-stat-value">{group.avgResponse}</span>
                                <span className="admin-group-stat-label">Avg Response</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Create Group Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create Agent Group"
            >
                <form className="admin-users-form" onSubmit={(e) => { e.preventDefault(); setIsCreateModalOpen(false); }}>
                    <Input label="Group Name" placeholder="e.g. Tier 1 Support" required />
                    <Input label="Description" placeholder="Brief description of this group" />
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Plus}>Create Group</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
