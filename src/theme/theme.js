import { createTheme, alpha } from '@mui/material/styles';
import { brand, surfaces, fonts, radii, layout } from './tokens';

/**
 * Legacy CSS-variable bridge.
 *
 * A few stylesheets intentionally stay in place (the frozen notification
 * TopNavbar, the TipTap editor, the chatbot widget, the marketing landing
 * page). They read `var(--color-*)` and friends, so the MUI theme writes
 * those variables from the same palette. The MUI theme is the only place
 * where color values are defined.
 */
function legacyCssVariables(theme) {
    const s = surfaces[theme.palette.mode];
    const p = theme.palette;
    return {
        '--color-bg-primary': p.background.default,
        '--color-bg-secondary': p.background.paper,
        '--color-bg-tertiary': p.background.subtle,
        '--color-bg-hover': p.background.hover,
        '--color-text-primary': p.text.primary,
        '--color-text-secondary': p.text.secondary,
        '--color-text-tertiary': p.text.tertiary,
        '--color-text-inverse': s.textInverse,
        '--color-border': p.divider,
        '--color-border-light': s.dividerLight,
        '--color-border-dark': s.dividerStrong,
        '--color-primary': p.primary.main,
        '--color-primary-hover': p.primary.dark,
        '--color-primary-light': alpha(p.primary.main, s.tintAlpha),
        '--color-primary-subtle': alpha(p.primary.main, s.tintAlpha / 2),
        '--color-success': p.success.main,
        '--color-success-light': alpha(p.success.main, s.tintAlpha),
        '--color-warning': p.warning.main,
        '--color-warning-light': alpha(p.warning.main, s.tintAlpha),
        '--color-error': p.error.main,
        '--color-error-light': alpha(p.error.main, s.tintAlpha),
        '--color-danger': p.error.main,
        '--color-danger-light': alpha(p.error.main, s.tintAlpha),
        '--color-info': p.info.main,
        '--color-info-light': alpha(p.info.main, s.tintAlpha),
        '--shadow-sm': s.shadowSm,
        '--shadow-md': s.shadowMd,
        '--shadow-lg': s.shadowLg,
        '--spacing-xs': theme.spacing(0.5),
        '--spacing-sm': theme.spacing(1),
        '--spacing-md': theme.spacing(2),
        '--spacing-lg': theme.spacing(3),
        '--spacing-xl': theme.spacing(4),
        '--spacing-2xl': theme.spacing(6),
        '--radius-sm': `${radii.sm}px`,
        '--radius-md': `${radii.md}px`,
        '--radius-lg': `${radii.lg}px`,
        '--radius-xl': `${radii.xl}px`,
        '--radius-full': `${radii.full}px`,
        '--font-heading': fonts.heading,
        '--font-family': fonts.body,
        '--font-size-xs': '0.75rem',
        '--font-size-sm': '0.875rem',
        '--font-size-base': '1rem',
        '--font-size-lg': '1.125rem',
        '--font-size-xl': '1.25rem',
        '--font-size-2xl': '1.5rem',
        '--font-size-3xl': '1.875rem',
        '--font-weight-normal': 400,
        '--font-weight-medium': 500,
        '--font-weight-semibold': 600,
        '--font-weight-bold': 700,
        '--line-height-tight': 1.25,
        '--line-height-normal': 1.5,
        '--line-height-relaxed': 1.75,
        '--transition-fast': '150ms ease',
        '--transition-normal': '200ms ease',
        '--transition-slow': '300ms ease',
        '--sidebar-width': `${layout.sidebarWidth}px`,
        '--sidebar-collapsed-width': `${layout.sidebarCollapsedWidth}px`,
        '--navbar-height': `${layout.navbarHeight}px`,
    };
}

/**
 * Builds the OrbitDesk MUI theme for the given color mode.
 * @param {'light' | 'dark'} mode
 */
export function buildTheme(mode = 'light') {
    const s = surfaces[mode] || surfaces.light;
    const isDark = mode === 'dark';

    const base = createTheme({
        palette: {
            mode,
            primary: {
                main: brand.primary,
                dark: isDark ? brand.primaryHoverDark : brand.primaryHoverLight,
                contrastText: '#FFFFFF',
            },
            secondary: {
                main: s.textSecondary,
                contrastText: s.textInverse,
            },
            success: { main: brand.success, dark: brand.successDark, contrastText: '#FFFFFF' },
            warning: { main: brand.warning, contrastText: '#1A1D23' },
            error: { main: brand.error, dark: brand.errorDark, contrastText: '#FFFFFF' },
            info: { main: brand.info, contrastText: '#FFFFFF' },
            background: {
                default: s.default,
                paper: s.paper,
                subtle: s.subtle,
                hover: s.hover,
            },
            text: {
                primary: s.textPrimary,
                secondary: s.textSecondary,
                tertiary: s.textTertiary,
            },
            divider: s.divider,
            action: {
                hover: alpha(s.textPrimary, isDark ? 0.06 : 0.04),
                selected: alpha(brand.primary, s.tintAlpha),
            },
        },
        shape: { borderRadius: radii.md },
        spacing: 8,
        breakpoints: {
            values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
        },
        typography: {
            fontFamily: fonts.body,
            fontSize: 14,
            h1: { fontFamily: fonts.heading, fontWeight: 600, fontSize: '1.875rem', lineHeight: 1.25 },
            h2: { fontFamily: fonts.heading, fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.3 },
            h3: { fontFamily: fonts.heading, fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.3 },
            h4: { fontFamily: fonts.heading, fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.35 },
            h5: { fontFamily: fonts.heading, fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 },
            h6: { fontFamily: fonts.heading, fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4 },
            subtitle1: { fontWeight: 500, fontSize: '1rem' },
            subtitle2: { fontWeight: 600, fontSize: '0.875rem' },
            body1: { fontSize: '1rem', lineHeight: 1.5 },
            body2: { fontSize: '0.875rem', lineHeight: 1.5 },
            caption: { fontSize: '0.75rem', lineHeight: 1.5 },
            overline: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', lineHeight: 1.5 },
            button: { fontWeight: 500, textTransform: 'none', fontSize: '0.875rem' },
        },
        zIndex: {
            // Keep MUI layers above the frozen TopNavbar (z-index 90-100).
            appBar: 1100,
            drawer: 1200,
        },
    });

    const softBorder = `1px solid ${s.divider}`;

    return createTheme(base, {
        shadows: [
            'none',
            s.shadowSm,
            s.shadowSm,
            s.shadowMd,
            s.shadowMd,
            ...Array(3).fill(s.shadowMd),
            ...Array(17).fill(s.shadowLg),
        ],
        components: {
            MuiCssBaseline: {
                styleOverrides: (theme) => ({
                    ':root': legacyCssVariables(theme),
                    html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
                    body: {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        minHeight: '100vh',
                    },
                    'h1, h2, h3, h4, h5, h6': { fontFamily: fonts.heading },
                    a: { color: theme.palette.primary.main, textDecoration: 'none' },
                    'a:hover': { color: theme.palette.primary.dark },
                    ':focus-visible': {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: 2,
                    },
                    '::-webkit-scrollbar': { width: 6, height: 6 },
                    '::-webkit-scrollbar-track': { background: 'transparent' },
                    '::-webkit-scrollbar-thumb': { background: s.dividerStrong, borderRadius: radii.full },
                    '::-webkit-scrollbar-thumb:hover': { background: theme.palette.text.tertiary },
                    '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
                    '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
                    '@keyframes slideInUp': {
                        from: { opacity: 0, transform: 'translateY(10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                    },
                    '@media (prefers-reduced-motion: reduce)': {
                        '*, *::before, *::after': {
                            animationDuration: '0.01ms !important',
                            transitionDuration: '0.01ms !important',
                        },
                    },
                }),
            },
            MuiPaper: {
                defaultProps: { elevation: 0 },
                styleOverrides: {
                    root: { backgroundImage: 'none' },
                    outlined: { border: softBorder },
                },
            },
            MuiCard: {
                defaultProps: { variant: 'outlined' },
                styleOverrides: {
                    root: {
                        borderRadius: radii.lg,
                        boxShadow: s.shadowSm,
                        transition: 'box-shadow 150ms ease, border-color 150ms ease',
                    },
                },
            },
            MuiButtonBase: {
                defaultProps: { disableRipple: false },
            },
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        borderRadius: radii.md,
                        whiteSpace: 'nowrap',
                        gap: 8,
                        minWidth: 0,
                    },
                    sizeSmall: { height: 32, padding: '0 16px', fontSize: '0.875rem' },
                    sizeMedium: { height: 40, padding: '0 24px', fontSize: '0.875rem' },
                    sizeLarge: { height: 48, padding: '0 32px', fontSize: '1rem' },
                    startIcon: { marginLeft: 0, marginRight: 0 },
                    endIcon: { marginLeft: 0, marginRight: 0 },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: { borderRadius: radii.md, color: s.textSecondary },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: radii.md,
                        backgroundColor: theme.palette.background.default,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: s.divider },
                        '&:hover:not(.Mui-disabled, .Mui-error) .MuiOutlinedInput-notchedOutline': {
                            borderColor: s.dividerStrong,
                        },
                        '&.Mui-focused': {
                            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, s.tintAlpha)}`,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 1,
                        },
                        '&.Mui-error.Mui-focused': {
                            boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, s.tintAlpha)}`,
                        },
                        '&.Mui-disabled': { backgroundColor: theme.palette.background.subtle },
                    }),
                    input: {
                        '&::placeholder': { color: s.textTertiary, opacity: 1 },
                    },
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        '&.Mui-focused': { color: theme.palette.text.primary },
                        '&.Mui-error': { color: theme.palette.text.primary },
                    }),
                    asterisk: ({ theme }) => ({ color: theme.palette.error.main }),
                },
            },
            MuiFormHelperText: {
                styleOverrides: {
                    root: { marginLeft: 0, marginRight: 0, fontSize: '0.75rem' },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { fontWeight: 500, borderRadius: radii.full },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: radii.xl,
                        border: softBorder,
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
                    },
                },
            },
            MuiBackdrop: {
                styleOverrides: {
                    root: {
                        '&:not(.MuiBackdrop-invisible)': { backgroundColor: 'rgba(15, 17, 22, 0.65)' },
                    },
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: { fontFamily: fonts.heading, fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.3 },
                },
            },
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        borderRadius: radii.lg,
                        border: softBorder,
                        boxShadow: s.shadowLg,
                        marginTop: 4,
                    },
                    list: { padding: 4 },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: radii.sm,
                        fontSize: '0.875rem',
                        minHeight: 40,
                        gap: 8,
                        '&.Mui-selected': {
                            backgroundColor: alpha(theme.palette.primary.main, s.tintAlpha),
                        },
                    }),
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: { borderRadius: radii.md },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: { minWidth: 0, color: 'inherit' },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: { borderBottom: softBorder, fontSize: '0.875rem' },
                    head: ({ theme }) => ({
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: theme.palette.text.secondary,
                        backgroundColor: theme.palette.background.subtle,
                        whiteSpace: 'nowrap',
                    }),
                },
            },
            MuiTooltip: {
                defaultProps: { arrow: true },
                styleOverrides: {
                    tooltip: { fontSize: '0.75rem', borderRadius: radii.sm },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: { textTransform: 'none', fontWeight: 500, minHeight: 44 },
                },
            },
            MuiAlert: {
                styleOverrides: {
                    root: { borderRadius: radii.md },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: ({ theme }) => ({
                        backgroundColor: theme.palette.background.paper,
                        borderRight: softBorder,
                    }),
                },
            },
            MuiAppBar: {
                defaultProps: { elevation: 0, color: 'inherit' },
                styleOverrides: {
                    root: ({ theme }) => ({
                        backgroundColor: theme.palette.background.paper,
                        borderBottom: softBorder,
                    }),
                },
            },
            MuiSwitch: {
                styleOverrides: {
                    root: { padding: 8 },
                },
            },
            MuiLinearProgress: {
                styleOverrides: {
                    root: { borderRadius: radii.full, height: 8 },
                    bar: { borderRadius: radii.full },
                },
            },
        },
    });
}
