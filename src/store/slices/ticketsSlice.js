import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketService } from '../../services/ticket.service';

// ─── Async Thunks ───────────────────────────────────────────────

export const fetchTickets = createAsyncThunk(
    'tickets/fetchTickets',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { tickets } = getState();
            const params = {
                page: tickets.pagination.page,
                limit: tickets.pagination.limit,
            };

            if (tickets.filters.status !== 'all') params.status = tickets.filters.status;
            if (tickets.filters.priority !== 'all') params.priority = tickets.filters.priority;
            if (tickets.filters.search) params.search = tickets.filters.search;

            const response = await ticketService.list(params);

            if (response.success) {
                return {
                    tickets: response.data?.tickets || response.data || [],
                    pagination: response.data?.pagination || null,
                };
            }
            return rejectWithValue('Failed to fetch tickets');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to load tickets'
            );
        }
    }
);

export const createTicket = createAsyncThunk(
    'tickets/createTicket',
    async (ticketData, { rejectWithValue }) => {
        try {
            const response = await ticketService.create(ticketData);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue('Failed to create ticket');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create ticket'
            );
        }
    }
);

export const updateTicket = createAsyncThunk(
    'tickets/updateTicket',
    async ({ ticketId, updateData }, { rejectWithValue }) => {
        try {
            const response = await ticketService.update(ticketId, updateData);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue('Failed to update ticket');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update ticket'
            );
        }
    }
);

export const bulkUpdateTickets = createAsyncThunk(
    'tickets/bulkUpdateTickets',
    async ({ ticketIds, updates }, { rejectWithValue }) => {
        try {
            const response = await ticketService.bulkUpdate(ticketIds, updates);
            if (response.success) {
                return { ticketIds, updates };
            }
            return rejectWithValue('Failed to update tickets');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update tickets'
            );
        }
    }
);

export const bulkDeleteTickets = createAsyncThunk(
    'tickets/bulkDeleteTickets',
    async (ticketIds, { rejectWithValue }) => {
        try {
            const response = await ticketService.bulkDelete(ticketIds);
            if (response.success) {
                return ticketIds;
            }
            return rejectWithValue('Failed to delete tickets');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete tickets'
            );
        }
    }
);

// ─── Initial State ──────────────────────────────────────────────

const initialState = {
    items: [],
    loading: false,
    error: null,
    filters: {
        status: 'all',
        priority: 'all',
        search: '',
    },
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    },
    selectedRows: [],
};

// ─── Slice ──────────────────────────────────────────────────────

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        setStatusFilter(state, action) {
            state.filters.status = action.payload;
            state.pagination.page = 1; // Reset to first page on filter change
        },
        setPriorityFilter(state, action) {
            state.filters.priority = action.payload;
            state.pagination.page = 1;
        },
        setSearchQuery(state, action) {
            state.filters.search = action.payload;
        },
        setPage(state, action) {
            state.pagination.page = action.payload;
        },
        setPageSize(state, action) {
            state.pagination.limit = action.payload;
            state.pagination.page = 1;
        },
        setSelectedRows(state, action) {
            state.selectedRows = action.payload;
        },
        toggleRowSelection(state, action) {
            const id = action.payload;
            const index = state.selectedRows.indexOf(id);
            if (index === -1) {
                state.selectedRows.push(id);
            } else {
                state.selectedRows.splice(index, 1);
            }
        },
        selectAllRows(state) {
            state.selectedRows = state.items.map((t) => t._id);
        },
        clearSelectedRows(state) {
            state.selectedRows = [];
        },
        resetFilters(state) {
            state.filters = initialState.filters;
            state.pagination.page = 1;
        },
    },
    extraReducers: (builder) => {
        // Fetch Tickets
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.tickets;
                if (action.payload.pagination) {
                    state.pagination.total = action.payload.pagination.total;
                    state.pagination.totalPages = action.payload.pagination.totalPages;
                }
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create Ticket — refetch handled by component dispatch
        builder
            .addCase(createTicket.fulfilled, (state) => {
                // Ticket will be added on next fetchTickets call
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.error = action.payload;
            });

        // Update Ticket
        builder
            .addCase(updateTicket.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.items.findIndex((t) => t._id === updated._id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...updated };
                }
            });

        // Bulk Update
        builder
            .addCase(bulkUpdateTickets.fulfilled, (state) => {
                state.selectedRows = [];
            });

        // Bulk Delete
        builder
            .addCase(bulkDeleteTickets.fulfilled, (state, action) => {
                const deletedIds = action.payload;
                state.items = state.items.filter((t) => !deletedIds.includes(t._id));
                state.selectedRows = [];
                state.pagination.total = Math.max(0, state.pagination.total - deletedIds.length);
            });
    },
});

// ─── Actions ────────────────────────────────────────────────────

export const {
    setStatusFilter,
    setPriorityFilter,
    setSearchQuery,
    setPage,
    setPageSize,
    setSelectedRows,
    toggleRowSelection,
    selectAllRows,
    clearSelectedRows,
    resetFilters,
} = ticketsSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────

export const selectTickets = (state) => state.tickets.items;
export const selectTicketsLoading = (state) => state.tickets.loading;
export const selectTicketsError = (state) => state.tickets.error;
export const selectTicketsFilters = (state) => state.tickets.filters;
export const selectTicketsPagination = (state) => state.tickets.pagination;
export const selectTicketsSelectedRows = (state) => state.tickets.selectedRows;

export default ticketsSlice.reducer;
