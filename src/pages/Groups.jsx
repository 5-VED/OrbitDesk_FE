import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Users,
    Lock,
    Globe,
    Edit,
    Trash2,
    ArrowLeft,
    Calendar,
    Info
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchGroups,
    deleteGroup,
    setGroupSearchQuery,
    setGroupSelectedRows,
    clearGroupSelectedRows,
    setDetailGroup,
    clearDetailGroup,
    selectFilteredGroups,
    selectGroupsLoading,
    selectGroupSearchQuery,
    selectGroupSelectedRows,
    selectGroupDetail,
} from '../store/slices/groupsSlice';
import { GroupModal } from './GroupModal';
import { toast } from 'react-hot-toast';
import './Groups.css';

export function Groups() {
    const dispatch = useAppDispatch();
    const filteredGroups = useAppSelector(selectFilteredGroups);
    const loading = useAppSelector(selectGroupsLoading);
    const searchQuery = useAppSelector(selectGroupSearchQuery);
    const selectedRows = useAppSelector(selectGroupSelectedRows);
    const detailGroup = useAppSelector(selectGroupDetail);

    // Local ephemeral UI state
    const [editingGroup, setEditingGroup] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [singleDeleteGroup, setSingleDeleteGroup] = useState(null);

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const handleCreateSuccess = () => {
        dispatch(fetchGroups());
        setIsModalOpen(false);
    };

    // Multi-select handlers
    const handleSelectRow = (id, checked) => {
        const newSelection = checked
            ? [...selectedRows, id]
            : selectedRows.filter(i => i !== id);
        dispatch(setGroupSelectedRows(newSelection));
    };

    const handleSelectAll = (checked) => {
        dispatch(setGroupSelectedRows(checked ? filteredGroups.map(g => g._id) : []));
    };

    // Delete handlers
    const handleBulkDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleSingleDelete = (group) => {
        setSingleDeleteGroup(group);
        setIsDeleteModalOpen(true);
    };

    const confirmBulkDelete = async () => {
        setDeleteLoading(true);
        try {
            if (singleDeleteGroup) {
                await dispatch(deleteGroup(singleDeleteGroup._id)).unwrap();
                toast.success('Group deleted successfully');
                if (detailGroup?._id === singleDeleteGroup._id) {
                    dispatch(clearDetailGroup());
                }
            } else {
                // Delete groups one by one (backend doesn't have bulk delete)
                for (const id of selectedRows) {
                    await dispatch(deleteGroup(id)).unwrap();
                }
                toast.success(`${selectedRows.length} groups deleted`);
                if (detailGroup && selectedRows.includes(detailGroup._id)) {
                    dispatch(clearDetailGroup());
                }
                dispatch(clearGroupSelectedRows());
            }
            setIsDeleteModalOpen(false);
            setSingleDeleteGroup(null);
        } catch (error) {
            toast.error(error || 'Failed to delete groups');
        } finally {
            setDeleteLoading(false);
        }
    };

    const getGroupInitials = (name) => {
        return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'G';
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
            header: 'Group',
            render: (_, row) => (
                <div className="group-name-cell">
                    <div className="group-icon">
                        {getGroupInitials(row.name)}
                    </div>
                    <div>
                        <span className="group-name">{row.name}</span>
                        <span className="group-description">{row.description || 'No description'}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'is_private',
            header: 'Visibility',
            render: (value) => (
                <Badge variant={value ? 'warning' : 'success'}>
                    {value ? <><Lock size={12} /> Private</> : <><Globe size={12} /> Public</>}
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
                        setEditingGroup(row);
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
            title="Groups"
            actions={
                <Button icon={Plus} onClick={() => { setEditingGroup(null); setIsModalOpen(true); }}>
                    Add Group
                </Button>
            }
        >
            <div className={`groups-page ${detailGroup ? 'show-detail' : ''}`}>
                {/* Groups List */}
                <div className="groups-list-section">
                    <div className="groups-toolbar">
                        <div className="groups-search">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search groups..."
                                value={searchQuery}
                                onChange={(e) => dispatch(setGroupSearchQuery(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedRows.length > 0 && (
                        <div className="groups-bulk-actions">
                            <span>{selectedRows.length} selected</span>
                            <Button variant="ghost" size="sm" className="danger" onClick={handleBulkDelete}>
                                <Trash2 size={16} /> Delete
                            </Button>
                        </div>
                    )}

                    <DataTable
                        columns={columns}
                        data={filteredGroups}
                        selectable
                        selectedRows={selectedRows}
                        onSelectRow={handleSelectRow}
                        onSelectAll={handleSelectAll}
                        emptyMessage={loading ? "Loading groups..." : "No groups found"}
                        onRowClick={(row) => dispatch(setDetailGroup(row))}
                        rowKey="_id"
                    />

                    {/* Stats */}
                    <div className="groups-pagination">
                        <span className="pagination-info">
                            {filteredGroups.length} {filteredGroups.length === 1 ? 'group' : 'groups'}
                        </span>
                    </div>
                </div>

                {/* Group Detail */}
                {detailGroup && (
                    <aside className="group-detail">
                        <Card>
                            <div className="group-detail-header">
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                                    <Button variant="ghost" size="sm" className="mobile-only" onClick={() => dispatch(clearDetailGroup())}>
                                        <ArrowLeft size={16} />
                                    </Button>
                                    <div className="group-icon" style={{ width: '64px', height: '64px', fontSize: 'var(--font-size-xl)' }}>
                                        {getGroupInitials(detailGroup.name)}
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <Button variant="ghost" size="sm" onClick={() => { setEditingGroup(detailGroup); setIsModalOpen(true); }}>
                                            <Edit size={16} />
                                        </Button>
                                    </div>
                                </div>
                                <h2>{detailGroup.name}</h2>
                                <span className="group-type">
                                    {detailGroup.is_private ? 'Private Group' : 'Public Group'}
                                </span>
                            </div>

                            <div className="group-info-section">
                                <h4>Group Information</h4>
                                <div className="group-info-list">
                                    <div className="group-info-item">
                                        <Info size={16} />
                                        <span>{detailGroup.description || 'No description'}</span>
                                    </div>
                                    <div className="group-info-item">
                                        {detailGroup.is_private ? <Lock size={16} /> : <Globe size={16} />}
                                        <span>{detailGroup.is_private ? 'Private' : 'Public'}</span>
                                    </div>
                                    <div className="group-info-item">
                                        <Calendar size={16} />
                                        <span>Created {formatDate(detailGroup.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </aside>
                )}
            </div>

            <GroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCreateSuccess}
                group={editingGroup}
            />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSingleDeleteGroup(null); }}
                title="Delete Group"
                size="small"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => { setIsDeleteModalOpen(false); setSingleDeleteGroup(null); }} disabled={deleteLoading}>
                            Cancel
                        </Button>
                        <Button className="danger" onClick={confirmBulkDelete} disabled={deleteLoading}>
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </>
                }
            >
                {singleDeleteGroup ? (
                    <p>Are you sure you want to delete "{singleDeleteGroup.name}"? This action cannot be undone.</p>
                ) : (
                    <p>Are you sure you want to delete {selectedRows.length} {selectedRows.length === 1 ? 'group' : 'groups'}? This action cannot be undone.</p>
                )}
            </Modal>
        </PageContainer>
    );
}
