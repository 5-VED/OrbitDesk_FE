import { useState } from 'react';
import {
    Users,
    Search,
    Plus,
    Filter,
    MoreVertical,
    Mail,
    Shield,
    UserCheck,
    UserX,
    Trash2,
    Edit,
    Download,
    ChevronDown,
    X,
    Eye,
    RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import './AdminUsers.css';

// Mock data
const mockUsers = [
    { id: 1, first_name: 'Sarah', last_name: 'Chen', email: 'sarah.chen@acme.com', role: 'agent', status: 'active', organization: 'Acme Corp', group: 'Tier 1 Support', lastLogin: '2 hours ago', ticketsAssigned: 34 },
    { id: 2, first_name: 'Mike', last_name: 'Johnson', email: 'mike.j@acme.com', role: 'agent', status: 'active', organization: 'Acme Corp', group: 'Tier 2 Support', lastLogin: '30 min ago', ticketsAssigned: 29 },
    { id: 3, first_name: 'Emily', last_name: 'Davis', email: 'emily.d@acme.com', role: 'admin', status: 'active', organization: 'Acme Corp', group: null, lastLogin: '1 hour ago', ticketsAssigned: 0 },
    { id: 4, first_name: 'Alex', last_name: 'Kim', email: 'alex.kim@techstart.io', role: 'agent', status: 'active', organization: 'TechStart', group: 'Billing', lastLogin: '5 hours ago', ticketsAssigned: 18 },
    { id: 5, first_name: 'John', last_name: 'Smith', email: 'john.s@customer.com', role: 'customer', status: 'active', organization: 'Customer Inc', group: null, lastLogin: '1 day ago', ticketsAssigned: 0 },
    { id: 6, first_name: 'Priya', last_name: 'Patel', email: 'priya.p@acme.com', role: 'agent', status: 'inactive', organization: 'Acme Corp', group: 'Tier 1 Support', lastLogin: '2 weeks ago', ticketsAssigned: 0 },
    { id: 7, first_name: 'David', last_name: 'Lee', email: 'david.l@techstart.io', role: 'customer', status: 'active', organization: 'TechStart', group: null, lastLogin: '3 days ago', ticketsAssigned: 0 },
    { id: 8, first_name: 'Jane', last_name: 'Cooper', email: 'jane.c@acme.com', role: 'admin', status: 'active', organization: 'Acme Corp', group: null, lastLogin: 'Just now', ticketsAssigned: 0 },
];

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
    return status === 'active' ? 'success' : 'default';
};

export function AdminUsers() {
    const [users] = useState(mockUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const filteredUsers = users.filter((user) => {
        const matchesSearch = !searchQuery ||
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const userCounts = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        agents: users.filter(u => u.role === 'agent').length,
        customers: users.filter(u => u.role === 'customer').length,
    };

    return (
        <div className="admin-users">
            {/* Page Header */}
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

            {/* Quick Stats */}
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

            {/* Filters & Search */}
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
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="admin-users-filter-select"
                        >
                            {roleOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="admin-users-filter-select"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedUsers.length > 0 && (
                    <div className="admin-users-bulk-bar">
                        <span className="admin-users-bulk-count">{selectedUsers.length} selected</span>
                        <div className="admin-users-bulk-actions">
                            <Button variant="secondary" size="sm" icon={UserCheck}>Activate</Button>
                            <Button variant="secondary" size="sm" icon={UserX}>Deactivate</Button>
                            <Button variant="danger" size="sm" icon={Trash2}>Delete</Button>
                        </div>
                        <button className="admin-users-bulk-clear" onClick={() => setSelectedUsers([])}>
                            <X size={14} /> Clear
                        </button>
                    </div>
                )}
            </Card>

            {/* Users Table */}
            <Card className="admin-users-table-card">
                <div className="admin-users-table">
                    <div className="admin-users-table-header">
                        <div className="admin-users-col-check">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            />
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
                            <div
                                key={user.id}
                                className={`admin-users-table-row ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                            >
                                <div className="admin-users-col-check">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleSelectUser(user.id)}
                                    />
                                </div>
                                <div className="admin-users-col-user">
                                    <Avatar name={`${user.first_name} ${user.last_name}`} size="sm" />
                                    <div className="admin-users-user-info">
                                        <span className="admin-users-user-name">{user.first_name} {user.last_name}</span>
                                        <span className="admin-users-user-email">{user.email}</span>
                                    </div>
                                </div>
                                <div className="admin-users-col-role">
                                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                                </div>
                                <div className="admin-users-col-status">
                                    <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                                </div>
                                <div className="admin-users-col-org">
                                    <span className="admin-users-org-text">{user.organization}</span>
                                </div>
                                <div className="admin-users-col-group">
                                    <span className="admin-users-group-text">{user.group || '—'}</span>
                                </div>
                                <div className="admin-users-col-login">
                                    <span className="admin-users-login-text">{user.lastLogin}</span>
                                </div>
                                <div className="admin-users-col-actions">
                                    <div className="admin-users-action-btns">
                                        <button className="admin-users-action-btn" title="View">
                                            <Eye size={15} />
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
                        ))}
                    </div>
                </div>

                {/* Footer with count */}
                <div className="admin-users-table-footer">
                    <span>Showing {filteredUsers.length} of {users.length} users</span>
                </div>
            </Card>

            {/* Create User Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Add New User"
            >
                <form className="admin-users-form" onSubmit={(e) => { e.preventDefault(); setIsCreateModalOpen(false); }}>
                    <div className="admin-users-form-row">
                        <Input label="First Name" placeholder="Enter first name" required />
                        <Input label="Last Name" placeholder="Enter last name" required />
                    </div>
                    <Input label="Email" type="email" placeholder="user@example.com" required />
                    <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
                    <Select
                        label="Role"
                        options={[
                            { value: 'customer', label: 'Customer' },
                            { value: 'agent', label: 'Agent' },
                            { value: 'admin', label: 'Admin' },
                        ]}
                    />
                    <Select
                        label="Status"
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                        ]}
                    />
                    <Input label="Password" type="password" placeholder="Set initial password" required />
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Plus}>Create User</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
