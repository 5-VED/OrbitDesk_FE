/**
 * OrbitDesk design tokens.
 *
 * Single source of truth for brand colors, typography, radii and layout
 * dimensions. Values mirror the original `index.css` design system so the
 * MUI migration preserves the existing brand identity.
 */

export const brand = {
    primary: '#F44336',
    primaryHoverLight: '#D32F2F',
    primaryHoverDark: '#E53935',
    success: '#22C55E',
    successDark: '#16A34A',
    warning: '#F59E0B',
    error: '#EF4444',
    errorDark: '#DC2626',
    info: '#3B82F6',
};

export const surfaces = {
    dark: {
        default: '#23262F',
        paper: '#2B2F39',
        subtle: '#353945',
        hover: '#3A3F4B',
        textPrimary: '#F7F8FA',
        textSecondary: '#A2A8B5',
        textTertiary: '#6B7280',
        textInverse: '#23262F',
        divider: 'rgba(247, 248, 250, 0.08)',
        dividerLight: 'rgba(247, 248, 250, 0.04)',
        dividerStrong: 'rgba(247, 248, 250, 0.14)',
        tintAlpha: 0.12,
        shadowSm: '0 1px 3px rgba(0, 0, 0, 0.3)',
        shadowMd: '0 4px 12px rgba(0, 0, 0, 0.35)',
        shadowLg: '0 8px 24px rgba(0, 0, 0, 0.4)',
    },
    light: {
        default: '#F8F9FA',
        paper: '#FFFFFF',
        subtle: '#EEF0F2',
        hover: '#E8EAED',
        textPrimary: '#1A1D23',
        textSecondary: '#5F6570',
        textTertiary: '#9CA0AA',
        textInverse: '#FFFFFF',
        divider: 'rgba(26, 29, 35, 0.08)',
        dividerLight: 'rgba(26, 29, 35, 0.04)',
        dividerStrong: 'rgba(26, 29, 35, 0.14)',
        tintAlpha: 0.08,
        shadowSm: '0 1px 3px rgba(0, 0, 0, 0.06)',
        shadowMd: '0 4px 12px rgba(0, 0, 0, 0.08)',
        shadowLg: '0 8px 24px rgba(0, 0, 0, 0.1)',
    },
};

export const fonts = {
    heading: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export const radii = {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 14,
    full: 9999,
};

export const layout = {
    sidebarWidth: 240,
    sidebarCollapsedWidth: 64,
    navbarHeight: 56,
    /**
     * The frozen TopNavbar (notification system) switches to its mobile
     * layout at 768px and forces the collapsed offset at 1024px. The app
     * shell uses these same thresholds so the two always line up.
     */
    mobileQuery: '(max-width:768px)',
    tabletQuery: '(max-width:1024px)',
};

/** Palette for deterministic avatar fallbacks (unchanged from the original Avatar). */
export const avatarColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
];
