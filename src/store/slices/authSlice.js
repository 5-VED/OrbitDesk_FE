import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/features/auth/api/auth';

// ─── Async Thunks ───────────────────────────────────────────────

// ─── Async Thunks ───────────────────────────────────────────────

export const checkSession = createAsyncThunk(
    'auth/checkSession',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authService.checkSession();
            if (!user) {
                return rejectWithValue('No active session');
            }
            return user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Session check failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const data = await authService.login(email, password);
            return data; // { user, token } - we ignore token
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed. Please check your credentials.'
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
            return null;
        } catch (error) {
            console.error('Logout error', error);
            // Even if backend fails, clear frontend state
            return null;
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await authService.signup(userData);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Signup failed. Please try again.'
            );
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async ({ userId, data }, { rejectWithValue }) => {
        try {
            const updatedUser = await authService.updateProfile(userId, data);
            return updatedUser;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update profile.'
            );
        }
    }
);

// ─── Initial State ──────────────────────────────────────────────

const storedUser = authService.getCurrentUser();

const initialState = {
    user: storedUser || null,
    isAuthenticated: !!storedUser,
    loading: false,
    error: null,
};

// ─── Slice ──────────────────────────────────────────────────────

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuthError(state) {
            state.error = null;
        },
        // Optimistic update if needed
        setUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
    },
    extraReducers: (builder) => {
        // Check Session
        builder
            .addCase(checkSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkSession.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(checkSession.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            });

        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        });

        // Signup
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update Profile
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// ─── Actions ────────────────────────────────────────────────────

export const { clearAuthError, setUser } = authSlice.actions;

// ─── Selectors ──────────────────────────────────────────────────

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
// Token selector removed as it's not stored in state anymore

export default authSlice.reducer;
