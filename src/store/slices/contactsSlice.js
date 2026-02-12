import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/user.service';

// ─── Async Thunks ───────────────────────────────────────────────

export const fetchContacts = createAsyncThunk(
    'contacts/fetchContacts',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { contacts, auth } = getState();
            const params = {
                page: contacts.pagination.page,
                limit: contacts.pagination.limit,
                search: contacts.filters.search,
                role: 'User',
            };

            const response = await userService.list(params);

            if (response.data && response.data.users) {
                // Filter out the logged-in user
                const currentUserId = auth.user?._id;
                const filteredContacts = response.data.users.filter(
                    (contact) => contact._id !== currentUserId
                );

                return {
                    contacts: filteredContacts,
                    pagination: response.data.pagination
                        ? {
                            total: response.data.pagination.total - (currentUserId ? 1 : 0),
                            totalPages: response.data.pagination.totalPages,
                        }
                        : null,
                };
            }
            return rejectWithValue('Failed to fetch contacts');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to load contacts'
            );
        }
    }
);

export const createContact = createAsyncThunk(
    'contacts/createContact',
    async (contactData, { rejectWithValue }) => {
        try {
            const response = await userService.create(contactData);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message || 'Failed to create contact');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create contact'
            );
        }
    }
);

export const updateContact = createAsyncThunk(
    'contacts/updateContact',
    async ({ contactId, contactData }, { rejectWithValue }) => {
        try {
            const response = await userService.update(contactId, contactData);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message || 'Failed to update contact');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update contact'
            );
        }
    }
);

export const deleteContact = createAsyncThunk(
    'contacts/deleteContact',
    async (contactId, { rejectWithValue }) => {
        try {
            const response = await userService.delete(contactId);
            if (response.success) {
                return contactId;
            }
            return rejectWithValue('Failed to delete contact');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete contact'
            );
        }
    }
);

export const bulkDeleteContacts = createAsyncThunk(
    'contacts/bulkDeleteContacts',
    async (contactIds, { rejectWithValue }) => {
        try {
            const response = await userService.bulkDelete(contactIds);
            if (response.success) {
                return contactIds;
            }
            return rejectWithValue('Failed to delete contacts');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete contacts'
            );
        }
    }
);

export const importContacts = createAsyncThunk(
    'contacts/importContacts',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await userService.importUser(formData);
            if (response.success || response.data?.successCount > 0) {
                return response;
            }
            return rejectWithValue(response.message || 'Import failed');
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Import failed'
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
        search: '',
    },
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    },
    selectedRows: [],
    detailContact: null,
};

// ─── Slice ──────────────────────────────────────────────────────

const contactsSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        setContactSearchQuery(state, action) {
            state.filters.search = action.payload;
        },
        setContactPage(state, action) {
            state.pagination.page = action.payload;
        },
        setContactPageSize(state, action) {
            state.pagination.limit = action.payload;
            state.pagination.page = 1;
        },
        setContactSelectedRows(state, action) {
            state.selectedRows = action.payload;
        },
        toggleContactRowSelection(state, action) {
            const id = action.payload;
            const index = state.selectedRows.indexOf(id);
            if (index === -1) {
                state.selectedRows.push(id);
            } else {
                state.selectedRows.splice(index, 1);
            }
        },
        selectAllContactRows(state) {
            state.selectedRows = state.items.map((c) => c._id);
        },
        clearContactSelectedRows(state) {
            state.selectedRows = [];
        },
        setDetailContact(state, action) {
            state.detailContact = action.payload;
        },
        clearDetailContact(state) {
            state.detailContact = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Contacts
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.contacts;
                if (action.payload.pagination) {
                    state.pagination.total = action.payload.pagination.total;
                    state.pagination.totalPages = action.payload.pagination.totalPages;
                }
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create Contact
        builder
            .addCase(createContact.fulfilled, (state) => {
                // Will refetch
            });

        // Update Contact
        builder
            .addCase(updateContact.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.items.findIndex((c) => c._id === updated._id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...updated };
                }
                // Update detail contact if it's the same one
                if (state.detailContact?._id === updated._id) {
                    state.detailContact = { ...state.detailContact, ...updated };
                }
            });

        // Delete Contact
        builder
            .addCase(deleteContact.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.items = state.items.filter((c) => c._id !== deletedId);
                state.pagination.total = Math.max(0, state.pagination.total - 1);
                if (state.detailContact?._id === deletedId) {
                    state.detailContact = null;
                }
            });

        // Bulk Delete
        builder
            .addCase(bulkDeleteContacts.fulfilled, (state, action) => {
                const deletedIds = action.payload;
                state.items = state.items.filter((c) => !deletedIds.includes(c._id));
                state.selectedRows = [];
                state.pagination.total = Math.max(0, state.pagination.total - deletedIds.length);
                if (state.detailContact && deletedIds.includes(state.detailContact._id)) {
                    state.detailContact = null;
                }
            });

        // Import Contacts
        builder
            .addCase(importContacts.fulfilled, (state) => {
                // Will refetch
            });
    },
});

// ─── Actions ────────────────────────────────────────────────────

export const {
    setContactSearchQuery,
    setContactPage,
    setContactPageSize,
    setContactSelectedRows,
    toggleContactRowSelection,
    selectAllContactRows,
    clearContactSelectedRows,
    setDetailContact,
    clearDetailContact,
} = contactsSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────

export const selectContacts = (state) => state.contacts.items;
export const selectContactsLoading = (state) => state.contacts.loading;
export const selectContactsError = (state) => state.contacts.error;
export const selectContactsFilters = (state) => state.contacts.filters;
export const selectContactsPagination = (state) => state.contacts.pagination;
export const selectContactsSelectedRows = (state) => state.contacts.selectedRows;
export const selectContactDetail = (state) => state.contacts.detailContact;

export default contactsSlice.reducer;
