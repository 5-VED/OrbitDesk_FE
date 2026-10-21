import React from 'react';
import { NavLink } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, alpha } from '@mui/material/styles';
import {
    LayoutDashboard,
    Ticket,
    Users,
    UserCircle,
    UsersRound,
    Building2,
    BarChart3,
    BookOpen,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Shield
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { layout } from '@/theme/tokens';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Workspace' },
    { path: '/tickets', icon: Ticket, label: 'Work Items' },
    { path: '/contacts', icon: Users, label: 'People' },
    { path: '/agents', icon: UserCircle, label: 'Agents' },
    { path: '/groups', icon: UsersRound, label: 'Groups' },
    { path: '/organizations', icon: Building2, label: 'Organizations', adminOnly: true },
    { path: '/reports', icon: BarChart3, label: 'Insights' },
    { path: '/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
];

const bottomItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(layout.mobileQuery);
    const user = useAppSelector(selectCurrentUser);
    const isAdmin = user?.role_type === 'admin';

    const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

    const handleNavClick = () => {
        if (mobileOpen && onMobileClose) {
            onMobileClose();
        }
    };

    const drawerWidth = collapsed && !isMobile ? layout.sidebarCollapsedWidth : layout.sidebarWidth;

    const renderNavList = (items, isAdminSection = false) => (
        <List sx={{ px: 1, py: 0.5 }}>
            {isAdminSection && isAdmin && (
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={collapsed && !isMobile ? 'Admin Panel' : ''} placement="right">
                        <ListItemButton
                            component={NavLink}
                            to="/admin"
                            onClick={handleNavClick}
                            sx={{
                                minHeight: 40,
                                px: collapsed && !isMobile ? 1.5 : 2,
                                justifyContent: collapsed && !isMobile ? 'center' : 'initial',
                                borderRadius: 1.5,
                                color: 'warning.main',
                                border: 1,
                                borderColor: alpha(theme.palette.warning.main, 0.25),
                                mb: 0.5,
                                '&.active': {
                                    backgroundColor: alpha(theme.palette.warning.main, 0.15),
                                    borderColor: 'warning.main',
                                    fontWeight: 600,
                                },
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: collapsed && !isMobile ? 'auto' : 2,
                                    justifyContent: 'center',
                                    color: 'inherit',
                                }}
                            >
                                <Shield size={20} />
                            </ListItemIcon>
                            {(!collapsed || isMobile) && (
                                <ListItemText
                                    primary="Admin Panel"
                                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                                />
                            )}
                        </ListItemButton>
                    </Tooltip>
                </ListItem>
            )}
            {items.map((item) => (
                <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={collapsed && !isMobile ? item.label : ''} placement="right">
                        <ListItemButton
                            component={NavLink}
                            to={item.path}
                            onClick={handleNavClick}
                            sx={{
                                minHeight: 40,
                                px: collapsed && !isMobile ? 1.5 : 2,
                                justifyContent: collapsed && !isMobile ? 'center' : 'initial',
                                borderRadius: 1.5,
                                color: 'text.secondary',
                                '&.active': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.main',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'background.hover',
                                    color: 'text.primary',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: collapsed && !isMobile ? 'auto' : 2,
                                    justifyContent: 'center',
                                    color: 'inherit',
                                }}
                            >
                                <item.icon size={20} />
                            </ListItemIcon>
                            {(!collapsed || isMobile) && (
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                                />
                            )}
                        </ListItemButton>
                    </Tooltip>
                </ListItem>
            ))}
        </List>
    );

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
                    px: collapsed && !isMobile ? 1 : 2,
                    height: layout.navbarHeight,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                {(!collapsed || isMobile) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1.5,
                                backgroundColor: 'primary.main',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '1.125rem',
                            }}
                        >
                            O
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                fontSize: '1.125rem',
                                color: 'text.primary',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            OrbitDesk
                        </Typography>
                    </Box>
                )}
                {!isMobile && (
                    <IconButton
                        onClick={onToggle}
                        size="small"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        sx={{
                            width: 28,
                            height: 28,
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1,
                        }}
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </IconButton>
                )}
            </Box>

            {/* Navigation items */}
            <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
                {renderNavList(visibleNavItems)}
            </Box>

            {/* Footer items */}
            <Box sx={{ borderTop: 1, borderColor: 'divider', py: 1 }}>
                {renderNavList(bottomItems, true)}
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: layout.sidebarWidth,
                        boxSizing: 'border-box',
                        backgroundColor: 'background.paper',
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        );
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: 'background.paper',
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    overflowX: 'hidden',
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
}

export default Sidebar;
