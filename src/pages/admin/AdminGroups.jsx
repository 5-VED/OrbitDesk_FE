import { useState, useEffect, useCallback } from 'react';
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
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editGroup, setEditGroup] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchGroups = useCallback(async () => {
        try {
            setLoading(true);
            const res = await groupService.list();
            setGroups(res.data || []);
        } catch (err) {
            console.error('Failed to fetch groups:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchGroups(); }, [fetchGroups]);

    const filteredGroups = groups.filter(g =>
        !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await groupService.create(formData);
            setIsCreateModalOpen(false);
            setFormData({ name: '', description: '' });
            fetchGroups();
        } catch (err) {
            console.error('Failed to create group:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (group) => {
        setEditGroup(group);
        setFormData({ name: group.name, description: group.description || '' });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await groupService.update(editGroup._id, formData);
            setIsEditModalOpen(false);
            setEditGroup(null);
            fetchGroups();
        } catch (err) {
            console.error('Failed to update group:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this group?')) return;
        try {
            await groupService.delete(id);
            fetchGroups();
        } catch (err) {
            console.error('Failed to delete group:', err);
        }
    };

    return (
        <div className="admin-groups">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Agent Groups</h1>
                    <p className="admin-page-subtitle">Organize agents into teams for ticket routing and workload management</p>
                </div>
                <div className="admin-page-actions">
                    <Button icon={Plus} onClick={() => { setFormData({ name: '', description: '' }); setIsCreateModalOpen(true); }}>Create Group</Button>
                </div>
            </div>

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

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader2 size={24} className="animate-spin" />
                </div>
            ) : (
                <div className="admin-groups-grid">
                    {filteredGroups.map((group) => (
                        <Card key={group._id} className="admin-group-card" hover>
                            <div className="admin-group-card-top">
                                <div className="admin-group-icon">
                                    <UsersRound size={22} />
                                </div>
                                <div className="admin-group-card-actions">
                                    <button className="admin-users-action-btn" title="Edit" onClick={() => handleEdit(group)}><Edit size={15} /></button>
                                    <button className="admin-users-action-btn danger" title="Delete" onClick={() => handleDelete(group._id)}><Trash2 size={15} /></button>
                                </div>
                            </div>
                            <h3 className="admin-group-name">{group.name}</h3>
                            <p className="admin-group-desc">{group.description || 'No description'}</p>

                            <div className="admin-group-stats">
                                <div className="admin-group-stat-item">
                                    <span className="admin-group-stat-value">{group.memberCount || 0}</span>
                                    <span className="admin-group-stat-label">Members</span>
                                </div>
                                <div className="admin-group-stat-divider" />
                                <div className="admin-group-stat-item">
                                    <span className="admin-group-stat-value">{group.ticketCount || 0}</span>
                                    <span className="admin-group-stat-label">Active Tickets</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {filteredGroups.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--color-text-tertiary)' }}>
                            No groups found
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Agent Group">
                <form className="admin-users-form" onSubmit={handleCreate}>
                    <Input label="Group Name" placeholder="e.g. Tier 1 Support" required value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} />
                    <Input label="Description" placeholder="Brief description of this group" value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} />
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Plus} disabled={submitting}>{submitting ? 'Creating...' : 'Create Group'}</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Group">
                <form className="admin-users-form" onSubmit={handleUpdate}>
                    <Input label="Group Name" placeholder="e.g. Tier 1 Support" required value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} />
                    <Input label="Description" placeholder="Brief description of this group" value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} />
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Edit} disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
