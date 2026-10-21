import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { layout } from '@/theme/tokens';

export function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();

    const toggleSidebar = useCallback(() => {
        setCollapsed(prev => !prev);
    }, []);

    const toggleMobile = useCallback(() => {
        setMobileOpen(prev => !prev);
    }, []);

    const closeMobile = useCallback(() => {
        setMobileOpen(false);
    }, []);

    const sidebarWidth = collapsed ? layout.sidebarCollapsedWidth : layout.sidebarWidth;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <AdminSidebar
                collapsed={collapsed}
                onToggle={toggleSidebar}
                mobileOpen={mobileOpen}
                onMobileClose={closeMobile}
            />

            <AdminTopbar
                collapsed={collapsed}
                onToggleMobile={toggleMobile}
            />

            <Box
                component="main"
                className={`admin-main ${collapsed ? 'expanded' : ''}`}
                sx={{
                    flexGrow: 1,
                    minHeight: `calc(100vh - ${layout.navbarHeight}px)`,
                    mt: `${layout.navbarHeight}px`,
                    ml: {
                        xs: 0,
                        md: `${sidebarWidth}px`,
                    },
                    transition: theme.transitions.create(['margin-left', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    width: {
                        xs: '100%',
                        md: `calc(100% - ${sidebarWidth}px)`,
                    },
                    p: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

export default AdminLayout;
