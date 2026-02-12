import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { groupService } from '@/features/groups/api/groups';

// ─── Async Thunks ───────────────────────────────────────────────

export const fetchGroups = createAsyncThunk(
    'groups/fetchGroups',
    async (_, { rejectWithValue }) => {
        try {
            const response = await groupService.list();
            if (response.data) {
                return response.data;
            }
            return rejectWithValue('Failed to fetch groups');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to load groups'
            );
        }
    }
);

export const createGroup = createAsyncThunk(
    'groups/createGroup',
    async (groupData, { rejectWithValue }) => {
        try {
            const response = await groupService.create(groupData);
            if (response.data) {
                return response.data;
            }
            return rejectWithValue('Failed to create group');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create group'
            );
        }
    }
);

export const updateGroup = createAsyncThunk(
    'groups/updateGroup',
    async ({ groupId, groupData }, { rejectWithValue }) => {
        try {
            const response = await groupService.update(groupId, groupData);
            if (response.data) {
                return response.data;
            }
            return rejectWithValue('Failed to update group');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update group'
            );
        }
    }
);

export const deleteGroup = createAsyncThunk(
    'groups/deleteGroup',
    async (groupId, { rejectWithValue }) => {
        try {
            await groupService.delete(groupId);
            return groupId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete group'
            );
        }
    }
);

// ─── Initial State ──────────────────────────────────────────────

const initialState = {
    items: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedRows: [],
    detailGroup: null,
};

// ─── Slice ──────────────────────────────────────────────────────

const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        setGroupSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
        setGroupSelectedRows(state, action) {
            state.selectedRows = action.payload;
        },
        toggleGroupRowSelection(state, action) {
            const id = action.payload;
            const index = state.selectedRows.indexOf(id);
            if (index === -1) {
                state.selectedRows.push(id);
            } else {
                state.selectedRows.splice(index, 1);
            }
        },
        selectAllGroupRows(state) {
            state.selectedRows = state.items.map((g) => g._id);
        },
        clearGroupSelectedRows(state) {
            state.selectedRows = [];
        },
        setDetailGroup(state, action) {
            state.detailGroup = action.payload;
        },
        clearDetailGroup(state) {
            state.detailGroup = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Groups
        builder
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create Group
        builder
            .addCase(createGroup.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });

        // Update Group
        builder
            .addCase(updateGroup.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.items.findIndex((g) => g._id === updated._id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...updated };
                }
                if (state.detailGroup?._id === updated._id) {
                    state.detailGroup = { ...state.detailGroup, ...updated };
                }
            });

        // Delete Group
        builder
            .addCase(deleteGroup.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.items = state.items.filter((g) => g._id !== deletedId);
                if (state.detailGroup?._id === deletedId) {
                    state.detailGroup = null;
                }
            });
    },
});

// ─── Actions ────────────────────────────────────────────────────

export const {
    setGroupSearchQuery,
    setGroupSelectedRows,
    toggleGroupRowSelection,
    selectAllGroupRows,
    clearGroupSelectedRows,
    setDetailGroup,
    clearDetailGroup,
} = groupsSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────

export const selectGroups = (state) => state.groups.items;
export const selectGroupsLoading = (state) => state.groups.loading;
export const selectGroupsError = (state) => state.groups.error;
export const selectGroupSearchQuery = (state) => state.groups.searchQuery;
export const selectGroupSelectedRows = (state) => state.groups.selectedRows;
export const selectGroupDetail = (state) => state.groups.detailGroup;

// Derived selector — filtered groups
export const selectFilteredGroups = (state) => {
    const { items, searchQuery } = state.groups;
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
        (g) =>
            g.name?.toLowerCase().includes(q) ||
            g.description?.toLowerCase().includes(q)
    );
};

export default groupsSlice.reducer;
