import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Building2,
    Globe,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    ArrowLeft,
    Calendar,
    Settings,
    Share2
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchOrganizations,
    deleteOrganization,
    setOrgSearchQuery,
    setOrgSelectedRows,
    clearOrgSelectedRows,
    setDetailOrg,
    clearDetailOrg,
    selectFilteredOrganizations,
    selectOrganizationsLoading,
    selectOrgSearchQuery,
    selectOrgSelectedRows,
    selectOrgDetail,
} from '../store/slices/organizationsSlice';
import { OrganizationModal } from './OrganizationModal';
import { toast } from 'react-hot-toast';
import './Organizations.css';

export function Organizations() {
    const dispatch = useAppDispatch();
    const filteredOrgs = useAppSelector(selectFilteredOrganizations);
    const loading = useAppSelector(selectOrganizationsLoading);
    const searchQuery = useAppSelector(selectOrgSearchQuery);
    const selectedRows = useAppSelector(selectOrgSelectedRows);
    const detailOrg = useAppSelector(selectOrgDetail);

    // Local ephemeral UI state
    const [editingOrg, setEditingOrg] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [singleDeleteOrg, setSingleDeleteOrg] = useState(null);

    useEffect(() => {
        dispatch(fetchOrganizations());
    }, [dispatch]);

    const handleCreateSuccess = () => {
        dispatch(fetchOrganizations());
        setIsModalOpen(false);
    };

    // Multi-select handlers
    const handleSelectRow = (id, checked) => {
        const newSelection = checked
            ? [...selectedRows, id]
            : selectedRows.filter(i => i !== id);
        dispatch(setOrgSelectedRows(newSelection));
    };

    const handleSelectAll = (checked) => {
        dispatch(setOrgSelectedRows(checked ? filteredOrgs.map(o => o._id) : []));
    };

    // Delete handlers
    const handleBulkDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleSingleDelete = (org) => {
        setSingleDeleteOrg(org);
        setIsDeleteModalOpen(true);
    };

    const confirmBulkDelete = async () => {
        setDeleteLoading(true);
        try {
            if (singleDeleteOrg) {
                await dispatch(deleteOrganization(singleDeleteOrg._id)).unwrap();
                toast.success('Organization deleted successfully');
                if (detailOrg?._id === singleDeleteOrg._id) {
                    dispatch(clearDetailOrg());
                }
            } else {
                for (const id of selectedRows) {
                    await dispatch(deleteOrganization(id)).unwrap();
                }
                toast.success(`${selectedRows.length} organizations deleted`);
                if (detailOrg && selectedRows.includes(detailOrg._id)) {
                    dispatch(clearDetailOrg());
                }
                dispatch(clearOrgSelectedRows());
            }
            setIsDeleteModalOpen(false);
            setSingleDeleteOrg(null);
        } catch (error) {
            toast.error(error || 'Failed to delete organizations');
        } finally {
            setDeleteLoading(false);
        }
    };

    const getOrgInitials = (name) => {
        return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'O';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const columns = [
        {
            key: 'name',
            header: 'Organization',
            render: (_, row) => (
                <div className="org-name-cell">
                    <div className="org-icon">
                        {getOrgInitials(row.name)}
                    </div>
                    <div>
                        <span className="org-name">{row.name}</span>
                        <span className="org-domains">
                            {row.domains?.length > 0 ? row.domains.join(', ') : 'No domains'}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'domains',
            header: 'Domains',
            render: (value) => (
                <span>{value?.length || 0} domain{value?.length !== 1 ? 's' : ''}</span>
            ),
        },
        {
            key: 'is_active',
            header: 'Status',
            render: (value) => (
                <Badge variant={value !== false ? 'success' : 'default'}>
                    {value !== false ? <><CheckCircle size={12} /> Active</> : <><XCircle size={12} /> Inactive</>}
                </Badge>
            ),
        },
        {
            key: 'createdAt',
            header: 'Created',
            render: (value) => formatDate(value),
        },
        {
            key: 'actions',
            header: '',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '4px' }}>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setEditingOrg(row);
                        setIsModalOpen(true);
                    }}>
                        <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-danger" onClick={(e) => {
                        e.stopPropagation();
                        handleSingleDelete(row);
                    }}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <PageContainer
            title="Organizations"
            actions={
                <Button icon={Plus} onClick={() => { setEditingOrg(null); setIsModalOpen(true); }}>
                    Add Organization
                </Button>
            }
        >
            <div className={`organizations-page ${detailOrg ? 'show-detail' : ''}`}>
                {/* Organizations List */}
                <div className="organizations-list-section">
                    <div className="organizations-toolbar">
                        <div className="organizations-search">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search organizations..."
                                value={searchQuery}
                                onChange={(e) => dispatch(setOrgSearchQuery(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedRows.length > 0 && (
                        <div className="organizations-bulk-actions">
                            <span>{selectedRows.length} selected</span>
                            <Button variant="ghost" size="sm" className="danger" onClick={handleBulkDelete}>
                                <Trash2 size={16} /> Delete
                            </Button>
                        </div>
                    )}

                    <DataTable
                        columns={columns}
                        data={filteredOrgs}
                        selectable
                        selectedRows={selectedRows}
                        onSelectRow={handleSelectRow}
                        onSelectAll={handleSelectAll}
                        emptyMessage={loading ? "Loading organizations..." : "No organizations found"}
                        onRowClick={(row) => dispatch(setDetailOrg(row))}
                        rowKey="_id"
                    />

                    {/* Stats */}
                    <div className="organizations-pagination">
                        <span className="pagination-info">
                            {filteredOrgs.length} {filteredOrgs.length === 1 ? 'organization' : 'organizations'}
                        </span>
                    </div>
                </div>

                {/* Organization Detail */}
                {detailOrg && (
                    <aside className="org-detail">
                        <Card>
                            <div className="org-detail-header">
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                                    <Button variant="ghost" size="sm" className="mobile-only" onClick={() => dispatch(clearDetailOrg())}>
                                        <ArrowLeft size={16} />
                                    </Button>
                                    <div className="org-icon" style={{ width: '64px', height: '64px', fontSize: 'var(--font-size-xl)' }}>
                                        {getOrgInitials(detailOrg.name)}
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <Button variant="ghost" size="sm" onClick={() => { setEditingOrg(detailOrg); setIsModalOpen(true); }}>
                                            <Edit size={16} />
                                        </Button>
                                    </div>
                                </div>
                                <h2>{detailOrg.name}</h2>
                                <span className="org-status">
                                    {detailOrg.is_active !== false ? 'Active Organization' : 'Inactive Organization'}
                                </span>
                            </div>

                            <div className="org-info-section">
                                <h4>Domains</h4>
                                <div className="org-info-list">
                                    {detailOrg.domains?.length > 0 ? (
                                        <div className="domains-list">
                                            {detailOrg.domains.map(domain => (
                                                <span key={domain} className="domain-tag">
                                                    <Globe size={12} /> {domain}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="org-info-item">
                                            <Globe size={16} />
                                            <span>No domains configured</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="org-info-section">
                                <h4>Settings</h4>
                                <div className="settings-list">
                                    <div className={`setting-item ${detailOrg.settings?.allow_external_sharing ? '' : 'disabled'}`}>
                                        <Share2 size={14} />
                                        <span>External Sharing {detailOrg.settings?.allow_external_sharing ? 'Enabled' : 'Disabled'}</span>
                                    </div>
                                    <div className="setting-item">
                                        <Settings size={14} />
                                        <span>Locale: {detailOrg.settings?.default_locale || 'en-US'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="org-info-section">
                                <h4>Info</h4>
                                <div className="org-info-list">
                                    <div className="org-info-item">
                                        <Calendar size={16} />
                                        <span>Created {formatDate(detailOrg.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </aside>
                )}
            </div>

            <OrganizationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCreateSuccess}
                organization={editingOrg}
            />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSingleDeleteOrg(null); }}
                title="Delete Organization"
                size="small"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => { setIsDeleteModalOpen(false); setSingleDeleteOrg(null); }} disabled={deleteLoading}>
                            Cancel
                        </Button>
                        <Button className="danger" onClick={confirmBulkDelete} disabled={deleteLoading}>
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </>
                }
            >
                {singleDeleteOrg ? (
                    <p>Are you sure you want to delete "{singleDeleteOrg.name}"? This action cannot be undone.</p>
                ) : (
                    <p>Are you sure you want to delete {selectedRows.length} {selectedRows.length === 1 ? 'organization' : 'organizations'}? This action cannot be undone.</p>
                )}
            </Modal>
        </PageContainer>
    );
}
