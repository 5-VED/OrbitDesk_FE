import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import MuiSelect from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Plus, Search, Filter, RefreshCw, Edit, Eye } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { DataTable } from "../components/ui/DataTable";
import { StatusBadge, PriorityBadge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { TicketModal } from "./NewTicketModal";
import { Modal } from "../components/ui/Modal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/slices/authSlice";
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
  selectTickets,
  selectTicketsLoading,
  selectTicketsFilters,
  selectTicketsPagination,
  selectTicketsSelectedRows,
} from "../store/slices/ticketsSlice";
import {
  getFilterStatusOptions,
  getFilterPriorityOptions,
} from "../utils/ticketConstants";
import { toast } from "react-hot-toast";

const columns = [
  {
    key: "_id",
    header: "Ticket ID",
    render: (value) => (
      <Typography
        component={Link}
        to={`/tickets/${value}`}
        variant="body2"
        sx={{
          color: "primary.main",
          fontWeight: 600,
          fontFamily: "monospace",
          fontSize: "0.8125rem",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        #{value?.slice(-6).toUpperCase() || "N/A"}
      </Typography>
    ),
  },
  {
    key: "subject",
    header: "Subject",
    render: (value, row) => (
      <Box>
        <Typography
          component={Link}
          to={`/tickets/${row._id}`}
          variant="body2"
          sx={{
            color: "text.primary",
            fontWeight: 500,
            display: "block",
            "&:hover": { color: "primary.main", textDecoration: "underline" },
          }}
        >
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.tertiary" }}>
          {row.channel || "Web"}
        </Typography>
      </Box>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (value) => <StatusBadge status={value} />,
  },
  {
    key: "priority",
    header: "Priority",
    render: (value) => <PriorityBadge priority={value} />,
  },
  {
    key: "requester_id",
    header: "Requester",
    render: (value) => {
      const name = value?.first_name
        ? `${value.first_name} ${value.last_name}`
        : "Unknown";
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar name={name} size="xs" />
          <Typography
            variant="body2"
            sx={{ color: "text.primary", fontSize: "0.875rem" }}
          >
            {name}
          </Typography>
        </Box>
      );
    },
  },
  {
    key: "assignee_id",
    header: "Assigned To",
    render: (value) => {
      if (!value) {
        return (
          <Typography
            variant="body2"
            sx={{
              color: "text.tertiary",
              fontStyle: "italic",
              fontSize: "0.875rem",
            }}
          >
            Unassigned
          </Typography>
        );
      }
      const name = `${value.first_name} ${value.last_name}`;
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar name={name} size="xs" />
          <Typography
            variant="body2"
            sx={{ color: "text.primary", fontSize: "0.875rem" }}
          >
            {name}
          </Typography>
        </Box>
      );
    },
  },
  {
    key: "createdAt",
    header: "Created",
    render: (value) => (
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontSize: "0.8125rem" }}
      >
        {value
          ? new Date(value).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A"}
      </Typography>
    ),
  },
];

export function TicketsList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const tickets = useAppSelector(selectTickets);
  const loading = useAppSelector(selectTicketsLoading);
  const filters = useAppSelector(selectTicketsFilters);
  const pagination = useAppSelector(selectTicketsPagination);
  const selectedRows = useAppSelector(selectTicketsSelectedRows);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [
    dispatch,
    filters.status,
    filters.priority,
    pagination.page,
    pagination.limit,
  ]);

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
      : selectedRows.filter((i) => i !== id);
    dispatch(setSelectedRows(newSelection));
  };

  const handleSelectAll = (checked) => {
    dispatch(setSelectedRows(checked ? tickets.map((t) => t._id) : []));
  };

  const handleCreateOrUpdateTicket = async (ticketData) => {
    try {
      if (editingTicket) {
        await dispatch(
          updateTicket({ ticketId: editingTicket._id, updateData: ticketData }),
        ).unwrap();
        toast.success("Ticket updated successfully");
        dispatch(fetchTickets());
      } else {
        const newTicketData = {
          ...ticketData,
          requester_id: ticketData.requester_id || currentUser?._id,
        };
        await dispatch(createTicket(newTicketData)).unwrap();
        toast.success("Ticket created successfully");
        dispatch(fetchTickets());
      }
    } catch (error) {
      toast.error(error || "Failed to save ticket");
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
      await dispatch(
        bulkUpdateTickets({ ticketIds: selectedRows, updates: { status } }),
      ).unwrap();
      toast.success(`${selectedRows.length} tickets updated`);
      dispatch(fetchTickets());
    } catch (error) {
      toast.error(error?.message || "Failed to update tickets");
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
      toast.error(error?.message || "Failed to delete tickets");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRefresh = () => dispatch(fetchTickets());

  const handlePageChange = (_, value) => {
    dispatch(setPage(value));
  };

  const handlePageSizeChange = (e) => {
    dispatch(setPageSize(parseInt(e.target.value, 10)));
  };

  return (
    <PageContainer
      title="Tickets"
      actions={
        <>
          <Button
            variant="ghost"
            icon={RefreshCw}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button icon={Plus} onClick={handleNewTicket}>
            New Ticket
          </Button>
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
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleteLoading}
            >
              Delete
            </Button>
          </>
        }
      >
        <Typography variant="body1">
          Are you sure you want to delete {selectedRows.length}{" "}
          {selectedRows.length === 1 ? "ticket" : "tickets"}? This action cannot
          be undone.
        </Typography>
      </Modal>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Filters Bar */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Search Input */}
          <OutlinedInput
            size="small"
            placeholder="Search tickets..."
            value={filters.search}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            startAdornment={
              <InputAdornment position="start">
                <Search size={18} style={{ opacity: 0.6 }} />
              </InputAdornment>
            }
            sx={{
              width: { xs: "100%", md: 320 },
              borderRadius: 1.5,
            }}
          />

          {/* Filter dropdowns */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <MuiSelect
                value={filters.status}
                onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                displayEmpty
                sx={{ borderRadius: 1.5 }}
              >
                {getFilterStatusOptions().map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <MuiSelect
                value={filters.priority}
                onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
                displayEmpty
                sx={{ borderRadius: 1.5 }}
              >
                {getFilterPriorityOptions().map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <Button variant="ghost" icon={Filter}>
              More Filters
            </Button>
          </Box>
        </Paper>

        {/* Bulk Actions Banner */}
        {selectedRows.length > 0 && (
          <Paper
            variant="outlined"
            sx={{
              px: 2.5,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: "background.subtle",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "text.primary", mr: 1 }}
            >
              {selectedRows.length} selected
            </Typography>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkStatusUpdate("open")}
            >
              Mark Open
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkStatusUpdate("pending")}
            >
              Mark Pending
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkStatusUpdate("solved")}
            >
              Mark Solved
            </Button>
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
              Delete
            </Button>
          </Paper>
        )}

        {/* Table */}
        <DataTable
          columns={[
            ...columns,
            {
              key: "actions",
              header: "",
              align: "right",
              render: (_, row) => (
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}
                >
                  <Tooltip title="View Ticket">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tickets/${row._id}`);
                      }}
                      sx={{ color: "text.secondary" }}
                    >
                      <Eye size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Ticket">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTicket(row);
                      }}
                      sx={{ color: "text.secondary" }}
                    >
                      <Edit size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            },
          ]}
          data={tickets}
          selectable
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          emptyMessage={
            loading
              ? { title: "Loading tickets...", subtitle: "" }
              : {
                  title: "No Tickets Yet",
                  subtitle:
                    "Create your first ticket or adjust your filters to see results.",
                }
          }
          rowKey="_id"
        />

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            pt: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Showing{" "}
              {pagination.total === 0
                ? 0
                : (pagination.page - 1) * pagination.limit + 1}{" "}
              to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} entries
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Show
              </Typography>
              <MuiSelect
                size="small"
                value={pagination.limit}
                onChange={handlePageSizeChange}
                sx={{ height: 32, fontSize: "0.8125rem" }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </MuiSelect>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                entries
              </Typography>
            </Box>
          </Box>

          <Pagination
            count={pagination.totalPages || 1}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="medium"
          />
        </Box>
      </Box>
    </PageContainer>
  );
}

export default TicketsList;
