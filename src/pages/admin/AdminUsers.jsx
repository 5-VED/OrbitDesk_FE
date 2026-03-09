import { useState, useEffect, useCallback } from 'react';
import {
    Users,
    Search,
    Plus,
    Trash2,
    Edit,
    Download,
    X,
    Eye,
    UserCheck,
    UserX,
    Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { userService } from '@/features/contacts/api/users';
import './AdminUsers.css';

const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'agent', label: 'Agent' },
    { value: 'customer', label: 'Customer' },
];

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

const getRoleBadgeVariant = (role) => {
    switch (role) {
        case 'admin': return 'danger';
        case 'agent': return 'primary';
        case 'customer': return 'default';
        default: return 'default';
    }
};

const getStatusBadgeVariant = (status) => {
    return status === 'active' || status === 'online' ? 'success' : 'default';
};

export function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '', role_type: 'customer', password: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await userService.list();
            setUsers(res.data || []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const filteredUsers = users.filter((user) => {
        const matchesSearch = !searchQuery ||
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = !roleFilter || user.role_type === roleFilter;
        const matchesStatus = !statusFilter ||
            (statusFilter === 'active' ? user.is_active !== false : user.is_active === false);
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(u => u._id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await userService.create(formData);
            setIsCreateModalOpen(false);
            setFormData({ first_name: '', last_name: '', email: '', phone: '', role_type: 'customer', password: '' });
            fetchUsers();
        } catch (err) {
            console.error('Failed to create user:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await userService.delete(id);
            fetchUsers();
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedUsers.length} users?`)) return;
        try {
            await userService.bulkDelete(selectedUsers);
            setSelectedUsers([]);
            fetchUsers();
        } catch (err) {
            console.error('Failed to bulk delete:', err);
        }
    };

    const handleDisable = async (userId) => {
        try {
            await userService.disableUser(userId);
            fetchUsers();
        } catch (err) {
            console.error('Failed to disable user:', err);
        }
    };

    const userCounts = {
        total: users.length,
        admins: users.filter(u => u.role_type === 'admin').length,
        agents: users.filter(u => u.role_type === 'agent').length,
        customers: users.filter(u => u.role_type === 'customer').length,
    };

    return (
        <div className="admin-users">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Users & Agents</h1>
                    <p className="admin-page-subtitle">Manage all system users, agents, and their permissions</p>
                </div>
                <div className="admin-page-actions">
                    <Button variant="secondary" icon={Download}>Export</Button>
                    <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>Add User</Button>
                </div>
            </div>

            <div className="admin-users-quick-stats">
                <div className="admin-users-stat">
                    <span className="admin-users-stat-value">{userCounts.total}</span>
                    <span className="admin-users-stat-label">Total Users</span>
                </div>
                <div className="admin-users-stat-divider" />
                <div className="admin-users-stat">
                    <span className="admin-users-stat-value admin-users-stat-admin">{userCounts.admins}</span>
                    <span className="admin-users-stat-label">Admins</span>
                </div>
                <div className="admin-users-stat-divider" />
                <div className="admin-users-stat">
                    <span className="admin-users-stat-value admin-users-stat-agent">{userCounts.agents}</span>
                    <span className="admin-users-stat-label">Agents</span>
                </div>
                <div className="admin-users-stat-divider" />
                <div className="admin-users-stat">
                    <span className="admin-users-stat-value admin-users-stat-customer">{userCounts.customers}</span>
                    <span className="admin-users-stat-label">Customers</span>
                </div>
            </div>

            <Card className="admin-users-toolbar-card">
                <div className="admin-users-toolbar">
                    <div className="admin-users-search">
                        <Search size={18} className="admin-users-search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
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
                    <div className="admin-users-filters">
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="admin-users-filter-select">
                            {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-users-filter-select">
                            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>

                {selectedUsers.length > 0 && (
                    <div className="admin-users-bulk-bar">
                        <span className="admin-users-bulk-count">{selectedUsers.length} selected</span>
                        <div className="admin-users-bulk-actions">
                            <Button variant="danger" size="sm" icon={Trash2} onClick={handleBulkDelete}>Delete</Button>
                        </div>
                        <button className="admin-users-bulk-clear" onClick={() => setSelectedUsers([])}>
                            <X size={14} /> Clear
                        </button>
                    </div>
                )}
            </Card>

            <Card className="admin-users-table-card">
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <Loader2 size={24} className="animate-spin" />
                    </div>
                ) : (
                    <div className="admin-users-table">
                        <div className="admin-users-table-header">
                            <div className="admin-users-col-check">
                                <input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} />
                            </div>
                            <span className="admin-users-col-user">User</span>
                            <span className="admin-users-col-role">Role</span>
                            <span className="admin-users-col-status">Status</span>
                            <span className="admin-users-col-org">Organization</span>
                            <span className="admin-users-col-group">Group</span>
                            <span className="admin-users-col-login">Last Login</span>
                            <span className="admin-users-col-actions">Actions</span>
                        </div>
                        <div className="admin-users-table-body">
                            {filteredUsers.map((user) => (
                                <div key={user._id} className={`admin-users-table-row ${selectedUsers.includes(user._id) ? 'selected' : ''}`}>
                                    <div className="admin-users-col-check">
                                        <input type="checkbox" checked={selectedUsers.includes(user._id)} onChange={() => handleSelectUser(user._id)} />
                                    </div>
                                    <div className="admin-users-col-user">
                                        <Avatar name={`${user.first_name} ${user.last_name}`} size="sm" src={user.profile_pic} />
                                        <div className="admin-users-user-info">
                                            <span className="admin-users-user-name">{user.first_name} {user.last_name}</span>
                                            <span className="admin-users-user-email">{user.email}</span>
                                        </div>
                                    </div>
                                    <div className="admin-users-col-role">
                                        <Badge variant={getRoleBadgeVariant(user.role_type)}>{user.role_type}</Badge>
                                    </div>
                                    <div className="admin-users-col-status">
                                        <Badge variant={getStatusBadgeVariant(user.is_active !== false ? 'active' : 'inactive')}>
                                            {user.is_active !== false ? 'active' : 'inactive'}
                                        </Badge>
                                    </div>
                                    <div className="admin-users-col-org">
                                        <span className="admin-users-org-text">{user.organization_id?.name || '—'}</span>
                                    </div>
                                    <div className="admin-users-col-group">
                                        <span className="admin-users-group-text">{user.groups?.[0]?.name || '—'}</span>
                                    </div>
                                    <div className="admin-users-col-login">
                                        <span className="admin-users-login-text">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '—'}</span>
                                    </div>
                                    <div className="admin-users-col-actions">
                                        <div className="admin-users-action-btns">
                                            <button className="admin-users-action-btn" title="Disable" onClick={() => handleDisable(user._id)}>
                                                <UserX size={15} />
                                            </button>
                                            <button className="admin-users-action-btn danger" title="Delete" onClick={() => handleDelete(user._id)}>
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredUsers.length === 0 && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                                    No users found
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div className="admin-users-table-footer">
                    <span>Showing {filteredUsers.length} of {users.length} users</span>
                </div>
            </Card>

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New User">
                <form className="admin-users-form" onSubmit={handleCreate}>
                    <div className="admin-users-form-row">
                        <Input label="First Name" placeholder="Enter first name" required value={formData.first_name} onChange={(e) => setFormData(p => ({ ...p, first_name: e.target.value }))} />
                        <Input label="Last Name" placeholder="Enter last name" required value={formData.last_name} onChange={(e) => setFormData(p => ({ ...p, last_name: e.target.value }))} />
                    </div>
                    <Input label="Email" type="email" placeholder="user@example.com" required value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} />
                    <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} />
                    <Select
                        label="Role"
                        value={formData.role_type}
                        onChange={(e) => setFormData(p => ({ ...p, role_type: e.target.value }))}
                        options={[
                            { value: 'customer', label: 'Customer' },
                            { value: 'agent', label: 'Agent' },
                            { value: 'admin', label: 'Admin' },
                        ]}
                    />
                    <Input label="Password" type="password" placeholder="Set initial password" required value={formData.password} onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} />
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Plus} disabled={submitting}>{submitting ? 'Creating...' : 'Create User'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
