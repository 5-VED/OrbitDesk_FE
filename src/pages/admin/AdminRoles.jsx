import { useState } from 'react';
import {
    Shield,
    Plus,
    Edit,
    Trash2,
    Users,
    CheckSquare,
    Square,
    Eye,
    Lock,
    X,
    Copy
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import './AdminRoles.css';

const permissionGroups = [
    {
        name: 'Tickets',
        permissions: [
            { key: 'tickets.view', label: 'View tickets' },
            { key: 'tickets.create', label: 'Create tickets' },
            { key: 'tickets.edit', label: 'Edit tickets' },
            { key: 'tickets.delete', label: 'Delete tickets' },
            { key: 'tickets.assign', label: 'Assign tickets' },
            { key: 'tickets.bulk', label: 'Bulk operations' },
        ]
    },
    {
        name: 'Users',
        permissions: [
            { key: 'users.view', label: 'View users' },
            { key: 'users.create', label: 'Create users' },
            { key: 'users.edit', label: 'Edit users' },
            { key: 'users.delete', label: 'Delete users' },
            { key: 'users.manage_roles', label: 'Manage roles' },
        ]
    },
    {
        name: 'Organizations',
        permissions: [
            { key: 'orgs.view', label: 'View organizations' },
            { key: 'orgs.create', label: 'Create organizations' },
            { key: 'orgs.edit', label: 'Edit organizations' },
            { key: 'orgs.delete', label: 'Delete organizations' },
        ]
    },
    {
        name: 'Reports',
        permissions: [
            { key: 'reports.view', label: 'View reports' },
            { key: 'reports.export', label: 'Export reports' },
        ]
    },
    {
        name: 'Settings',
        permissions: [
            { key: 'settings.view', label: 'View settings' },
            { key: 'settings.edit', label: 'Edit settings' },
            { key: 'settings.admin', label: 'Admin panel access' },
        ]
    },
];

const mockRoles = [
    {
        id: 1,
        name: 'Admin',
        description: 'Full access to all system features',
        userCount: 3,
        isSystem: true,
        color: 'danger',
        permissions: permissionGroups.flatMap(g => g.permissions.map(p => p.key)),
    },
    {
        id: 2,
        name: 'Agent',
        description: 'Can manage tickets, view contacts and reports',
        userCount: 12,
        isSystem: true,
        color: 'primary',
        permissions: ['tickets.view', 'tickets.create', 'tickets.edit', 'tickets.assign', 'users.view', 'orgs.view', 'reports.view'],
    },
    {
        id: 3,
        name: 'Support Lead',
        description: 'Agent access plus team management',
        userCount: 4,
        isSystem: false,
        color: 'warning',
        permissions: ['tickets.view', 'tickets.create', 'tickets.edit', 'tickets.delete', 'tickets.assign', 'tickets.bulk', 'users.view', 'users.edit', 'orgs.view', 'reports.view', 'reports.export'],
    },
    {
        id: 4,
        name: 'Customer',
        description: 'Can create and view own tickets',
        userCount: 156,
        isSystem: true,
        color: 'success',
        permissions: ['tickets.view', 'tickets.create'],
    },
    {
        id: 5,
        name: 'Viewer',
        description: 'Read-only access to tickets and reports',
        userCount: 8,
        isSystem: false,
        color: 'info',
        permissions: ['tickets.view', 'users.view', 'orgs.view', 'reports.view'],
    },
];

export function AdminRoles() {
    const [roles] = useState(mockRoles);
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const allPermissions = permissionGroups.flatMap(g => g.permissions.map(p => p.key));

    return (
        <div className="admin-roles">
            {/* Page Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Roles & Permissions</h1>
                    <p className="admin-page-subtitle">Configure access control for different user types</p>
                </div>
                <div className="admin-page-actions">
                    <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>Create Role</Button>
                </div>
            </div>

            <div className="admin-roles-layout">
                {/* Roles List */}
                <div className="admin-roles-list">
                    {roles.map((role) => (
                        <Card
                            key={role.id}
                            className={`admin-role-card ${selectedRole?.id === role.id ? 'active' : ''}`}
                            hover
                            onClick={() => setSelectedRole(role)}
                        >
                            <div className="admin-role-card-header">
                                <div className="admin-role-card-info">
                                    <div className="admin-role-icon" data-color={role.color}>
                                        <Shield size={18} />
                                    </div>
                                    <div>
                                        <span className="admin-role-name">{role.name}</span>
                                        {role.isSystem && (
                                            <span className="admin-role-system-badge">System</span>
                                        )}
                                    </div>
                                </div>
                                <div className="admin-role-user-count">
                                    <Users size={14} />
                                    <span>{role.userCount}</span>
                                </div>
                            </div>
                            <p className="admin-role-description">{role.description}</p>
                            <div className="admin-role-perm-summary">
                                <span>{role.permissions.length}/{allPermissions.length} permissions</span>
                                <div className="admin-role-perm-bar">
                                    <div
                                        className="admin-role-perm-fill"
                                        data-color={role.color}
                                        style={{ width: `${(role.permissions.length / allPermissions.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Permission Detail */}
                {selectedRole && (
                    <Card className="admin-permissions-detail">
                        <CardHeader>
                            <div className="admin-permissions-header">
                                <div>
                                    <CardTitle>
                                        <span className="admin-role-icon-inline" data-color={selectedRole.color}>
                                            <Shield size={16} />
                                        </span>
                                        {selectedRole.name} Permissions
                                    </CardTitle>
                                    <p className="admin-permissions-subtitle">{selectedRole.description}</p>
                                </div>
                                {!selectedRole.isSystem && (
                                    <div className="admin-permissions-actions">
                                        <Button variant="secondary" size="sm" icon={Copy}>Duplicate</Button>
                                        <Button variant="secondary" size="sm" icon={Edit}>Edit</Button>
                                        <Button variant="danger" size="sm" icon={Trash2}>Delete</Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="admin-permission-groups">
                                {permissionGroups.map((group) => (
                                    <div key={group.name} className="admin-permission-group">
                                        <div className="admin-permission-group-header">
                                            <span className="admin-permission-group-name">{group.name}</span>
                                            <span className="admin-permission-group-count">
                                                {group.permissions.filter(p => selectedRole.permissions.includes(p.key)).length}/{group.permissions.length}
                                            </span>
                                        </div>
                                        <div className="admin-permission-items">
                                            {group.permissions.map((perm) => {
                                                const isGranted = selectedRole.permissions.includes(perm.key);
                                                return (
                                                    <div key={perm.key} className={`admin-permission-item ${isGranted ? 'granted' : 'denied'}`}>
                                                        {isGranted ? (
                                                            <CheckSquare size={16} className="admin-perm-check" />
                                                        ) : (
                                                            <Square size={16} className="admin-perm-uncheck" />
                                                        )}
                                                        <span className="admin-perm-label">{perm.label}</span>
                                                        {selectedRole.isSystem && (
                                                            <Lock size={12} className="admin-perm-lock" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Create Role Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Role"
            >
                <form className="admin-users-form" onSubmit={(e) => { e.preventDefault(); setIsCreateModalOpen(false); }}>
                    <Input label="Role Name" placeholder="e.g. Support Lead" required />
                    <Input label="Description" placeholder="Brief description of this role" />
                    <div className="admin-create-role-perms">
                        <span className="admin-create-role-perms-label">Permissions</span>
                        {permissionGroups.map((group) => (
                            <div key={group.name} className="admin-create-perm-group">
                                <span className="admin-create-perm-group-name">{group.name}</span>
                                <div className="admin-create-perm-items">
                                    {group.permissions.map((perm) => (
                                        <label key={perm.key} className="admin-create-perm-item">
                                            <input type="checkbox" />
                                            <span>{perm.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" icon={Plus}>Create Role</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
