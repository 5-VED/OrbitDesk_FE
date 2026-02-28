import { useState, useEffect } from 'react';
import {
    Shield,
    Plus,
    Edit,
    Trash2,
    Users,
    CheckSquare,
    Square,
    Lock,
    X,
    Copy,
    Loader
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { roleService } from '@/services/role.service';
import { toast } from 'react-hot-toast';
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

const allPermissionKeys = permissionGroups.flatMap(g => g.permissions.map(p => p.key));

const roleColorMap = {
    'Admin': 'danger',
    'Agent': 'primary',
    'User': 'success',
};

function getRoleColor(roleName) {
    return roleColorMap[roleName] || 'info';
}

export function AdminRoles() {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        role: '',
        description: '',
        permissions: [],
    });

    const fetchRoles = async () => {
        try {
            const response = await roleService.list();
            if (response.success && response.data) {
                setRoles(response.data);
                if (!selectedRole && response.data.length > 0) {
                    setSelectedRole(response.data[0]);
                } else if (selectedRole) {
                    const updated = response.data.find(r => r._id === selectedRole._id);
                    setSelectedRole(updated || response.data[0] || null);
                }
            }
        } catch (error) {
            toast.error('Failed to load roles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const resetForm = () => {
        setFormData({ role: '', description: '', permissions: [] });
        setIsEditMode(false);
    };

    const openCreateModal = () => {
        resetForm();
        setIsCreateModalOpen(true);
    };

    const openEditModal = () => {
        if (!selectedRole) return;
        setFormData({
            role: selectedRole.role,
            description: selectedRole.description || '',
            permissions: selectedRole.permissions || [],
        });
        setIsEditMode(true);
        setIsCreateModalOpen(true);
    };

    const handlePermissionToggle = (key) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(key)
                ? prev.permissions.filter(p => p !== key)
                : [...prev.permissions, key],
        }));
    };

    const handleToggleGroupAll = (group) => {
        const groupKeys = group.permissions.map(p => p.key);
        const allSelected = groupKeys.every(k => formData.permissions.includes(k));

        setFormData(prev => ({
            ...prev,
            permissions: allSelected
                ? prev.permissions.filter(p => !groupKeys.includes(p))
                : [...new Set([...prev.permissions, ...groupKeys])],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.role.trim()) {
            toast.error('Role name is required');
            return;
        }

        setFormSubmitting(true);
        try {
            if (isEditMode && selectedRole) {
                await roleService.update(selectedRole._id, formData);
                toast.success('Role updated successfully');
            } else {
                await roleService.create(formData);
                toast.success('Role created successfully');
            }
            setIsCreateModalOpen(false);
            resetForm();
            await fetchRoles();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} role`);
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedRole) return;

        setFormSubmitting(true);
        try {
            await roleService.delete(selectedRole._id);
            toast.success('Role deleted successfully');
            setIsDeleteModalOpen(false);
            setSelectedRole(null);
            await fetchRoles();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete role');
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleDuplicate = () => {
        if (!selectedRole) return;
        setFormData({
            role: `${selectedRole.role} (Copy)`,
            description: selectedRole.description || '',
            permissions: [...(selectedRole.permissions || [])],
        });
        setIsEditMode(false);
        setIsCreateModalOpen(true);
    };

    const handlePermissionToggleInline = async (permKey) => {
        if (!selectedRole || selectedRole.isSystem) return;

        const updatedPermissions = selectedRole.permissions?.includes(permKey)
            ? selectedRole.permissions.filter(p => p !== permKey)
            : [...(selectedRole.permissions || []), permKey];

        try {
            await roleService.update(selectedRole._id, { permissions: updatedPermissions });
            await fetchRoles();
        } catch (error) {
            toast.error('Failed to update permission');
        }
    };

    if (loading) {
        return (
            <div className="admin-roles">
                <div className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Roles & Permissions</h1>
                        <p className="admin-page-subtitle">Configure access control for different user types</p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                    <Loader size={24} className="spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="admin-roles">
            {/* Page Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Roles & Permissions</h1>
                    <p className="admin-page-subtitle">Configure access control for different user types</p>
                </div>
                <div className="admin-page-actions">
                    <Button icon={Plus} onClick={openCreateModal}>Create Role</Button>
                </div>
            </div>

            <div className="admin-roles-layout">
                {/* Roles List */}
                <div className="admin-roles-list">
                    {roles.length === 0 ? (
                        <Card>
                            <CardContent>
                                <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', padding: '20px 0' }}>
                                    No roles found. Create your first role.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        roles.map((role) => (
                            <Card
                                key={role._id}
                                className={`admin-role-card ${selectedRole?._id === role._id ? 'active' : ''}`}
                                hover
                                onClick={() => setSelectedRole(role)}
                            >
                                <div className="admin-role-card-header">
                                    <div className="admin-role-card-info">
                                        <div className="admin-role-icon" data-color={getRoleColor(role.role)}>
                                            <Shield size={18} />
                                        </div>
                                        <div>
                                            <span className="admin-role-name">{role.role}</span>
                                            {role.isSystem && (
                                                <span className="admin-role-system-badge">System</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="admin-role-user-count">
                                        <Users size={14} />
                                        <span>{role.userCount || 0}</span>
                                    </div>
                                </div>
                                <p className="admin-role-description">{role.description || 'No description'}</p>
                                <div className="admin-role-perm-summary">
                                    <span>{(role.permissions || []).length}/{allPermissionKeys.length} permissions</span>
                                    <div className="admin-role-perm-bar">
                                        <div
                                            className="admin-role-perm-fill"
                                            data-color={getRoleColor(role.role)}
                                            style={{ width: `${((role.permissions || []).length / allPermissionKeys.length) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Permission Detail */}
                {selectedRole && (
                    <Card className="admin-permissions-detail">
                        <CardHeader>
                            <div className="admin-permissions-header">
                                <div>
                                    <CardTitle>
                                        <span className="admin-role-icon-inline" data-color={getRoleColor(selectedRole.role)}>
                                            <Shield size={16} />
                                        </span>
                                        {selectedRole.role} Permissions
                                    </CardTitle>
                                    <p className="admin-permissions-subtitle">{selectedRole.description || 'No description'}</p>
                                </div>
                                {!selectedRole.isSystem && (
                                    <div className="admin-permissions-actions">
                                        <Button variant="secondary" size="sm" icon={Copy} onClick={handleDuplicate}>Duplicate</Button>
                                        <Button variant="secondary" size="sm" icon={Edit} onClick={openEditModal}>Edit</Button>
                                        <Button variant="danger" size="sm" icon={Trash2} onClick={() => setIsDeleteModalOpen(true)}>Delete</Button>
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
                                                {group.permissions.filter(p => (selectedRole.permissions || []).includes(p.key)).length}/{group.permissions.length}
                                            </span>
                                        </div>
                                        <div className="admin-permission-items">
                                            {group.permissions.map((perm) => {
                                                const isGranted = (selectedRole.permissions || []).includes(perm.key);
                                                return (
                                                    <div
                                                        key={perm.key}
                                                        className={`admin-permission-item ${isGranted ? 'granted' : 'denied'}`}
                                                        onClick={() => handlePermissionToggleInline(perm.key)}
                                                        style={{ cursor: selectedRole.isSystem ? 'default' : 'pointer' }}
                                                    >
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

            {/* Create / Edit Role Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => { setIsCreateModalOpen(false); resetForm(); }}
                title={isEditMode ? 'Edit Role' : 'Create New Role'}
            >
                <form className="admin-users-form" onSubmit={handleSubmit}>
                    <Input
                        label="Role Name"
                        placeholder="e.g. Support Lead"
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        required
                    />
                    <Input
                        label="Description"
                        placeholder="Brief description of this role"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <div className="admin-create-role-perms">
                        <span className="admin-create-role-perms-label">Permissions</span>
                        {permissionGroups.map((group) => {
                            const groupKeys = group.permissions.map(p => p.key);
                            const allSelected = groupKeys.every(k => formData.permissions.includes(k));

                            return (
                                <div key={group.name} className="admin-create-perm-group">
                                    <label
                                        className="admin-create-perm-group-name"
                                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        onClick={() => handleToggleGroupAll(group)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={() => handleToggleGroupAll(group)}
                                        />
                                        {group.name}
                                    </label>
                                    <div className="admin-create-perm-items">
                                        {group.permissions.map((perm) => (
                                            <label key={perm.key} className="admin-create-perm-item">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.permissions.includes(perm.key)}
                                                    onChange={() => handlePermissionToggle(perm.key)}
                                                />
                                                <span>{perm.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="admin-users-form-actions">
                        <Button variant="secondary" type="button" onClick={() => { setIsCreateModalOpen(false); resetForm(); }} disabled={formSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" icon={isEditMode ? Edit : Plus} disabled={formSubmitting}>
                            {formSubmitting ? 'Saving...' : (isEditMode ? 'Update Role' : 'Create Role')}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Role"
                size="small"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={formSubmitting}>Cancel</Button>
                        <Button className="danger" onClick={handleDelete} disabled={formSubmitting}>
                            {formSubmitting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </>
                }
            >
                <p>
                    Are you sure you want to delete the <strong>{selectedRole?.role}</strong> role?
                    {selectedRole?.userCount > 0 && (
                        <span> This role is currently assigned to <strong>{selectedRole.userCount}</strong> user(s).</span>
                    )}
                </p>
            </Modal>
        </div>
    );
}
