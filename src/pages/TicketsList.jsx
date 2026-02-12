import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    RefreshCw,
    Edit,
    Eye
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Select } from '../components/ui/Input';
import { TicketModal } from './NewTicketModal';
import { Modal } from '../components/ui/Modal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCurrentUser } from '../store/slices/authSlice';
import {
    fetchTickets,
    createTicket,
    updateTicket,
    bulkUpdateTickets,
    bulkDeleteTickets,
    setStatusFilter,
    setPriorityFilter,
    setSearchQuery,
    setPage,
    setPageSize,
    setSelectedRows,
    clearSelectedRows,
    selectTickets,
    selectTicketsLoading,
    selectTicketsFilters,
    selectTicketsPagination,
    selectTicketsSelectedRows,
} from '../store/slices/ticketsSlice';
import { getFilterStatusOptions, getFilterPriorityOptions } from '../utils/ticketConstants';
import { toast } from 'react-hot-toast';
import './TicketsList.css';

const columns = [
    {
        key: '_id',
        header: 'Ticket ID',
        render: (value) => (
            <Link to={`/tickets/${value}`} className="ticket-id-link">
                #{value?.slice(-6).toUpperCase() || 'N/A'}
            </Link>
        ),
    },
    {
        key: 'subject',
        header: 'Subject',
        render: (value, row) => (
            <div className="ticket-subject">
                <Link to={`/tickets/${row._id}`}>{value}</Link>
                <span className="ticket-channel">{row.channel || 'Web'}</span>
            </div>
        ),
    },
    {
        key: 'status',
        header: 'Status',
        render: (value) => <StatusBadge status={value} />,
    },
    {
        key: 'priority',
        header: 'Priority',
        render: (value) => <PriorityBadge priority={value} />,
    },
    {
        key: 'requester_id',
        header: 'Requester',
        render: (value) => (
            <div className="ticket-customer">
                <Avatar name={value?.first_name ? `${value.first_name} ${value.last_name}` : 'Unknown'} size="xs" />
                <span>{value?.first_name ? `${value.first_name} ${value.last_name}` : 'Unknown'}</span>
            </div>
        ),
    },
    {
        key: 'assignee_id',
        header: 'Assigned To',
        render: (value) => value ? (
            <div className="ticket-agent">
                <Avatar name={`${value.first_name} ${value.last_name}`} size="xs" />
                <span>{value.first_name} {value.last_name}</span>
            </div>
        ) : (
            <span className="unassigned">Unassigned</span>
        ),
    },
    {
        key: 'createdAt',
        header: 'Created',
        render: (value) => value ? new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'N/A',
    },
    // Actions column will be added dynamically in the component to access handlers
];

export function TicketsList() {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const tickets = useAppSelector(selectTickets);
    const loading = useAppSelector(selectTicketsLoading);
    const filters = useAppSelector(selectTicketsFilters);
    const pagination = useAppSelector(selectTicketsPagination);
    const selectedRows = useAppSelector(selectTicketsSelectedRows);

    // Local UI state (ephemeral modal states)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);

    // Fetch tickets when filters or pagination change
    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch, filters.status, filters.priority, pagination.page, pagination.limit]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (pagination.page === 1) {
                dispatch(fetchTickets());
            } else {
                dispatch(setPage(1));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    const handleSelectRow = (id, checked) => {
        const newSelection = checked
            ? [...selectedRows, id]
            : selectedRows.filter(i => i !== id);
        dispatch(setSelectedRows(newSelection));
    };

    const handleSelectAll = (checked) => {
        dispatch(setSelectedRows(checked ? tickets.map(t => t._id) : []));
    };

    const handleCreateOrUpdateTicket = async (ticketData) => {
        try {
            if (editingTicket) {
                await dispatch(updateTicket({ ticketId: editingTicket._id, updateData: ticketData })).unwrap();
                toast.success('Ticket updated successfully');
                dispatch(fetchTickets());
            } else {
                const newTicketData = {
                    ...ticketData,
                    requester_id: ticketData.requester_id || currentUser?._id,
                };
                await dispatch(createTicket(newTicketData)).unwrap();
                toast.success('Ticket created successfully');
                dispatch(fetchTickets());
            }
        } catch (error) {
            toast.error(error || 'Failed to save ticket');
            throw error;
        }
    };

    const handleEditTicket = (ticket) => {
        setEditingTicket(ticket);
        setIsModalOpen(true);
    };

    const handleNewTicket = () => {
        setEditingTicket(null);
        setIsModalOpen(true);
    };

    const handleBulkStatusUpdate = async (status) => {
        try {
            await dispatch(bulkUpdateTickets({ ticketIds: selectedRows, updates: { status } })).unwrap();
            toast.success(`${selectedRows.length} tickets updated`);
            dispatch(fetchTickets());
        } catch (error) {
            toast.error('Failed to update tickets');
        }
    };

    const handleBulkDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            await dispatch(bulkDeleteTickets(selectedRows)).unwrap();
            toast.success(`${selectedRows.length} tickets deleted`);
            setIsDeleteModalOpen(false);
            dispatch(fetchTickets());
        } catch (error) {
            toast.error('Failed to delete tickets');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleRefresh = () => dispatch(fetchTickets());

    const handlePrevPage = () => {
        if (pagination.page > 1) dispatch(setPage(pagination.page - 1));
    };

    const handleNextPage = () => {
        if (pagination.page < pagination.totalPages) dispatch(setPage(pagination.page + 1));
    };

    const handlePageSizeChange = (e) => {
        dispatch(setPageSize(parseInt(e.target.value)));
    };

    const handleGoToPage = (pageNum) => {
        if (pageNum >= 1 && pageNum <= pagination.totalPages) dispatch(setPage(pageNum));
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const { page, totalPages } = pagination;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (page >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <PageContainer
            title="Tickets"
            actions={
                <>
                    <Button variant="ghost" icon={RefreshCw} onClick={handleRefresh} disabled={loading}>
                        Refresh
                    </Button>
                    <Button icon={Plus} onClick={handleNewTicket}>New Ticket</Button>
                </>
            }
        >
            <TicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateOrUpdateTicket}
                ticket={editingTicket}
            />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
                size="small"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={deleteLoading}>
                            Cancel
                        </Button>
                        <Button className="danger" onClick={confirmDelete} disabled={deleteLoading}>
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </>
                }
            >
                <p>
                    Are you sure you want to delete {selectedRows.length} {selectedRows.length === 1 ? 'ticket' : 'tickets'}?
                    This action cannot be undone.
                </p>
            </Modal>
            <div className="tickets-page">
                {/* Filters Bar */}
                <div className="tickets-filters">
                    <div className="tickets-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={filters.search}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        />
                    </div>

                    <div className="tickets-filter-group">
                        <Select
                            options={getFilterStatusOptions()}
                            value={filters.status}
                            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                        />
                        <Select
                            options={getFilterPriorityOptions()}
                            value={filters.priority}
                            onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
                        />
                        <Button variant="ghost" icon={Filter}>
                            More Filters
                        </Button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedRows.length > 0 && (
                    <div className="tickets-bulk-actions">
                        <span>{selectedRows.length} selected</span>
                        <Button variant="ghost" size="sm" onClick={() => handleBulkStatusUpdate('open')}>Mark Open</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleBulkStatusUpdate('pending')}>Mark Pending</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleBulkStatusUpdate('solved')}>Mark Solved</Button>
                        <Button variant="ghost" size="sm" className="danger" onClick={handleBulkDelete}>Delete</Button>
                    </div>
                )}

                {/* Tickets Table */}
                <DataTable
                    columns={[
                        ...columns,
                        {
                            key: 'actions',
                            header: '',
                            render: (_, row) => (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        title="View Ticket"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            window.location.href = `/tickets/${row._id}`;
                                        }}
                                    >
                                        <Eye size={16} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        title="Edit Ticket"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleEditTicket(row);
                                        }}
                                    >
                                        <Edit size={16} />
                                    </Button>
                                </div>
                            ),
                        }
                    ]}
                    data={tickets}
                    selectable
                    selectedRows={selectedRows}
                    onSelectRow={handleSelectRow}
                    onSelectAll={handleSelectAll}
                    emptyMessage={loading ? "Loading tickets..." : "No tickets found"}
                    rowKey="_id"
                />

                {/* Pagination */}
                <div className="tickets-pagination">
                    <div className="pagination-left">
                        <span className="pagination-info">
                            Showing {pagination.total === 0 ? 0 : ((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                        </span>
                        <div className="page-size-selector">
                            <label>Show</label>
                            <select value={pagination.limit} onChange={handlePageSizeChange}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <label>entries</label>
                        </div>
                    </div>
                    <div className="pagination-controls">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={pagination.page <= 1}
                            onClick={handlePrevPage}
                        >
                            Previous
                        </Button>
                        <div className="page-numbers">
                            {getPageNumbers().map((pageNum, idx) => (
                                pageNum === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="page-ellipsis">...</span>
                                ) : (
                                    <button
                                        key={pageNum}
                                        className={`page-number ${pagination.page === pageNum ? 'active' : ''}`}
                                        onClick={() => handleGoToPage(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            ))}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={handleNextPage}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
