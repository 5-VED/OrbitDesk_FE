import { createSlice } from '@reduxjs/toolkit';

// ─── Initial State ──────────────────────────────────────────────

const initialState = {
    sidebarCollapsed: false,
    globalLoading: false,
};

// ─── Slice ──────────────────────────────────────────────────────

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSidebarCollapsed(state, action) {
            state.sidebarCollapsed = action.payload;
        },
        setGlobalLoading(state, action) {
            state.globalLoading = action.payload;
        },
    },
});

// ─── Actions ────────────────────────────────────────────────────

export const {
    toggleSidebar,
    setSidebarCollapsed,
    setGlobalLoading,
} = uiSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────

export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectGlobalLoading = (state) => state.ui.globalLoading;

export default uiSlice.reducer;
