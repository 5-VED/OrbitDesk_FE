import { createSlice } from "@reduxjs/toolkit";

// ─── Initial State ──────────────────────────────────────────────

const SIDEBAR_STORAGE_KEY = "orbitdesk-sidebar-collapsed";

const readSidebarCollapsed = () => {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const persistSidebarCollapsed = (value) => {
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
};

const initialState = {
  sidebarCollapsed: readSidebarCollapsed(),
  globalLoading: false,
};

// ─── Slice ──────────────────────────────────────────────────────

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      persistSidebarCollapsed(state.sidebarCollapsed);
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload;
      persistSidebarCollapsed(state.sidebarCollapsed);
    },
    setGlobalLoading(state, action) {
      state.globalLoading = action.payload;
    },
  },
});

// ─── Actions ────────────────────────────────────────────────────

export const { toggleSidebar, setSidebarCollapsed, setGlobalLoading } =
  uiSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────

export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectGlobalLoading = (state) => state.ui.globalLoading;

export default uiSlice.reducer;
