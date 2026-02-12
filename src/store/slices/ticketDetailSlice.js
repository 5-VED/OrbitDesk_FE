import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketService } from '../../services/ticket.service';
import { userService } from '../../services/user.service';

// ─── Async Thunks ───────────────────────────────────────────────

export const fetchTicketDetail = createAsyncThunk(
    'ticketDetail/fetchTicketDetail',
    async (ticketId, { rejectWithValue }) => {
        try {
            const [ticketResponse, commentsResponse] = await Promise.all([
                ticketService.getDetails(ticketId),
                ticketService.getComments(ticketId),
            ]);

            return {
                ticket: ticketResponse.success ? ticketResponse.data : null,
                comments: commentsResponse.success ? (commentsResponse.data || []) : [],
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to load ticket details'
            );
        }
    }
);

export const fetchAgents = createAsyncThunk(
    'ticketDetail/fetchAgents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.getAgents();
            if (response.success && response.data) {
                return response.data.map((agent) => ({
                    value: agent._id,
                    label: `${agent.first_name} ${agent.last_name}`,
                }));
            }
            return [];
        } catch (error) {
            return rejectWithValue('Failed to fetch agents');
        }
    }
);

export const addComment = createAsyncThunk(
    'ticketDetail/addComment',
    async ({ ticketId, commentData }, { rejectWithValue }) => {
        try {
            const response = await ticketService.addComment(ticketId, commentData);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue('Failed to add comment');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to send reply'
            );
        }
    }
);

export const updateComment = createAsyncThunk(
    'ticketDetail/updateComment',
    async ({ ticketId, commentId, commentData }, { rejectWithValue }) => {
        try {
            const response = await ticketService.updateComment(ticketId, commentId, commentData);
            if (response.success) {
                return { commentId, updatedData: response.data };
            }
            return rejectWithValue('Failed to update comment');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update note'
            );
        }
    }
);

export const deleteComment = createAsyncThunk(
    'ticketDetail/deleteComment',
    async ({ ticketId, commentId }, { rejectWithValue }) => {
        try {
            const response = await ticketService.deleteComment(ticketId, commentId);
            if (response.success) {
                return commentId;
            }
            return rejectWithValue('Failed to delete comment');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete note'
            );
        }
    }
);

export const updateTicketStatus = createAsyncThunk(
    'ticketDetail/updateTicketStatus',
    async ({ ticketId, status }, { rejectWithValue }) => {
        try {
            await ticketService.updateStatus(ticketId, status);
            return status;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update status'
            );
        }
    }
);

export const updateTicketPriority = createAsyncThunk(
    'ticketDetail/updateTicketPriority',
    async ({ ticketId, priority }, { rejectWithValue }) => {
        try {
            await ticketService.updatePriority(ticketId, priority);
            return priority;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update priority'
            );
        }
    }
);

export const assignTicket = createAsyncThunk(
    'ticketDetail/assignTicket',
    async ({ ticketId, assigneeId }, { rejectWithValue }) => {
        try {
            await ticketService.assignTicket(ticketId, assigneeId);
            return assigneeId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to assign ticket'
            );
        }
    }
);

// ─── Initial State ──────────────────────────────────────────────

const initialState = {
    ticket: null,
    comments: [],
    agents: [],
    loading: false,
    submitting: false,
    error: null,
};

// ─── Slice ──────────────────────────────────────────────────────

const ticketDetailSlice = createSlice({
    name: 'ticketDetail',
    initialState,
    reducers: {
        clearTicketDetail(state) {
            state.ticket = null;
            state.comments = [];
            state.loading = false;
            state.submitting = false;
            state.error = null;
        },
        clearTicketDetailError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Ticket Detail
        builder
            .addCase(fetchTicketDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload.ticket;
                state.comments = action.payload.comments;
            })
            .addCase(fetchTicketDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch Agents
        builder
            .addCase(fetchAgents.fulfilled, (state, action) => {
                state.agents = action.payload;
            });

        // Add Comment
        builder
            .addCase(addComment.pending, (state) => {
                state.submitting = true;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.submitting = false;
                // We'll refetch for accurate data; optimistic update as fallback
                if (action.payload) {
                    state.comments.push(action.payload);
                }
            })
            .addCase(addComment.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        // Update Comment
        builder
            .addCase(updateComment.fulfilled, (state, action) => {
                const { commentId, updatedData } = action.payload;
                const index = state.comments.findIndex((c) => c._id === commentId);
                if (index !== -1 && updatedData) {
                    state.comments[index] = { ...state.comments[index], ...updatedData };
                }
            });

        // Delete Comment
        builder
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter((c) => c._id !== action.payload);
            });

        // Update Status
        builder
            .addCase(updateTicketStatus.fulfilled, (state, action) => {
                if (state.ticket) {
                    state.ticket.status = action.payload;
                }
            });

        // Update Priority
        builder
            .addCase(updateTicketPriority.fulfilled, (state, action) => {
                if (state.ticket) {
                    state.ticket.priority = action.payload;
                }
            });

        // Assign Ticket — refetch for full assignee populate
        builder
            .addCase(assignTicket.fulfilled, (state) => {
                // Will be followed by a refetch in the component
            });
    },
});

// ─── Actions ────────────────────────────────────────────────────

export const { clearTicketDetail, clearTicketDetailError } = ticketDetailSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────

export const selectTicketDetail = (state) => state.ticketDetail.ticket;
export const selectTicketComments = (state) => state.ticketDetail.comments;
export const selectTicketDetailLoading = (state) => state.ticketDetail.loading;
export const selectTicketDetailSubmitting = (state) => state.ticketDetail.submitting;
export const selectTicketDetailError = (state) => state.ticketDetail.error;
export const selectTicketAgents = (state) => state.ticketDetail.agents;

export default ticketDetailSlice.reducer;
