import { useState, useEffect } from 'react';
import {
    UsersRound,
    Plus,
    Edit,
    Trash2,
    Search,
    X,
    Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { groupService } from '@/features/groups/api/groups';
import './AdminGroups.css';

export function AdminGroups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await groupService.list();
                setGroups(res?.data || []);
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    const filteredGroups = groups.filter(g =>
        !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="admin-dashboard-loading">
                <Loader2 size={32} className="spin" />
                <p>Loading groups...</p>
            </div>
        );
    }

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
                    <Card key={group._id} className="admin-group-card" hover>
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
                        <p className="admin-group-desc">{group.description || 'No description'}</p>

                        {/* Stats */}
                        <div className="admin-group-stats">
                            <div className="admin-group-stat-item">
                                <span className="admin-group-stat-value">{group.memberCount || 0}</span>
                                <span className="admin-group-stat-label">Members</span>
                            </div>
                            <div className="admin-group-stat-divider" />
                            <div className="admin-group-stat-item">
                                <span className="admin-group-stat-value">{group.ticketCount || 0}</span>
                                <span className="admin-group-stat-label">Tickets</span>
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
