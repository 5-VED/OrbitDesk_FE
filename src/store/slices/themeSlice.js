import { createSlice } from '@reduxjs/toolkit';

// ─── Initial State ──────────────────────────────────────────────

const getInitialTheme = () => {
    const saved = localStorage.getItem('supportdesk-theme');
    return saved || 'light';
};

const initialState = {
    mode: getInitialTheme(),
};

// ─── Slice ──────────────────────────────────────────────────────

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme(state) {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            // Side effects: persist + apply
            localStorage.setItem('supportdesk-theme', state.mode);
            document.documentElement.setAttribute('data-theme', state.mode);
        },
        setTheme(state, action) {
            state.mode = action.payload;
            localStorage.setItem('supportdesk-theme', state.mode);
            document.documentElement.setAttribute('data-theme', state.mode);
        },
    },
});

// ─── Actions ────────────────────────────────────────────────────

export const { toggleTheme, setTheme } = themeSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────

export const selectTheme = (state) => state.theme.mode;

export default themeSlice.reducer;
