import { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppSelector } from '@/store/hooks';
import { selectTheme } from '@/store/slices/themeSlice';
import { buildTheme } from './theme';

/**
 * Wraps the app in the MUI theme. The color mode still comes from the
 * existing Redux `themeSlice` (and its localStorage persistence), so theme
 * toggling behaves exactly as before.
 */
export function AppThemeProvider({ children }) {
    const mode = useAppSelector(selectTheme);
    const theme = useMemo(() => buildTheme(mode === 'dark' ? 'dark' : 'light'), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {children}
        </ThemeProvider>
    );
}
