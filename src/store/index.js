import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ticketsReducer from './slices/ticketsSlice';
import ticketDetailReducer from './slices/ticketDetailSlice';
import contactsReducer from './slices/contactsSlice';
import groupsReducer from './slices/groupsSlice';
import organizationsReducer from './slices/organizationsSlice';
import themeReducer from './slices/themeSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tickets: ticketsReducer,
        ticketDetail: ticketDetailReducer,
        contacts: contactsReducer,
        groups: groupsReducer,
        organizations: organizationsReducer,
        theme: themeReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore non-serializable values in certain paths if needed
                ignoredActions: ['auth/setCredentials'],
            },
        }),
    devTools: import.meta.env.DEV,
});

export default store;
