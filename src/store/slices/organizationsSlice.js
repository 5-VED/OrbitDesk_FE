import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { organizationService } from '../../services/organization.service';

// ─── Async Thunks ───────────────────────────────────────────────

export const fetchOrganizations = createAsyncThunk(
    'organizations/fetchOrganizations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await organizationService.list();
            if (response.data) {
                return response.data;
            }
            return rejectWithValue('Failed to fetch organizations');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to load organizations'
            );
        }
    }
);

export const createOrganization = createAsyncThunk(
    'organizations/createOrganization',
    async (orgData, { rejectWithValue }) => {
        try {
            const response = await organizationService.create(orgData);
            if (response.data) {
                return response.data;
            }
            return rejectWithValue('Failed to create organization');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create organization'
            );
        }
    }
);

export const updateOrganization = createAsyncThunk(
    'organizations/updateOrganization',
    async ({ orgId, orgData }, { rejectWithValue }) => {
        try {
            const response = await organizationService.update(orgId, orgData);
            if (response.data) {
                return response.data;
            }
            return rejectWithValue('Failed to update organization');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update organization'
            );
        }
    }
);

export const deleteOrganization = createAsyncThunk(
    'organizations/deleteOrganization',
    async (orgId, { rejectWithValue }) => {
        try {
            await organizationService.delete(orgId);
            return orgId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete organization'
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
    detailOrg: null,
};

// ─── Slice ──────────────────────────────────────────────────────

const organizationsSlice = createSlice({
    name: 'organizations',
    initialState,
    reducers: {
        setOrgSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
        setOrgSelectedRows(state, action) {
            state.selectedRows = action.payload;
        },
        toggleOrgRowSelection(state, action) {
            const id = action.payload;
            const index = state.selectedRows.indexOf(id);
            if (index === -1) {
                state.selectedRows.push(id);
            } else {
                state.selectedRows.splice(index, 1);
            }
        },
        selectAllOrgRows(state) {
            state.selectedRows = state.items.map((o) => o._id);
        },
        clearOrgSelectedRows(state) {
            state.selectedRows = [];
        },
        setDetailOrg(state, action) {
            state.detailOrg = action.payload;
        },
        clearDetailOrg(state) {
            state.detailOrg = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Organizations
        builder
            .addCase(fetchOrganizations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganizations.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchOrganizations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create Organization
        builder
            .addCase(createOrganization.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });

        // Update Organization
        builder
            .addCase(updateOrganization.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.items.findIndex((o) => o._id === updated._id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...updated };
                }
                if (state.detailOrg?._id === updated._id) {
                    state.detailOrg = { ...state.detailOrg, ...updated };
                }
            });

        // Delete Organization
        builder
            .addCase(deleteOrganization.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.items = state.items.filter((o) => o._id !== deletedId);
                if (state.detailOrg?._id === deletedId) {
                    state.detailOrg = null;
                }
            });
    },
});

// ─── Actions ────────────────────────────────────────────────────

export const {
    setOrgSearchQuery,
    setOrgSelectedRows,
    toggleOrgRowSelection,
    selectAllOrgRows,
    clearOrgSelectedRows,
    setDetailOrg,
    clearDetailOrg,
} = organizationsSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────

export const selectOrganizations = (state) => state.organizations.items;
export const selectOrganizationsLoading = (state) => state.organizations.loading;
export const selectOrganizationsError = (state) => state.organizations.error;
export const selectOrgSearchQuery = (state) => state.organizations.searchQuery;
export const selectOrgSelectedRows = (state) => state.organizations.selectedRows;
export const selectOrgDetail = (state) => state.organizations.detailOrg;

// Derived selector — filtered organizations
export const selectFilteredOrganizations = (state) => {
    const { items, searchQuery } = state.organizations;
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
        (o) =>
            o.name?.toLowerCase().includes(q) ||
            o.domains?.some((d) => d.toLowerCase().includes(q))
    );
};

export default organizationsSlice.reducer;
