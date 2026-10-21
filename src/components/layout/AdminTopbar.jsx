import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Bell,
    ChevronDown,
    LogOut,
    User,
    ArrowLeft,
    Menu as MenuIcon
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser, selectCurrentUser } from '../../store/slices/authSlice';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { layout } from '@/theme/tokens';

export function AdminTopbar({ collapsed, onToggleMobile }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const isDropdownOpen = Boolean(anchorEl);

    const handleMenuOpen = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        dispatch(logoutUser());
        navigate('/login');
    };

    const sidebarWidth = collapsed ? layout.sidebarCollapsedWidth : layout.sidebarWidth;

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { xs: '100%', md: `calc(100% - ${sidebarWidth}px)` },
                ml: { xs: 0, md: `${sidebarWidth}px` },
                height: layout.navbarHeight,
                backgroundColor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
                boxShadow: 'none',
                transition: theme.transitions.create(['margin-left', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                zIndex: theme.zIndex.appBar,
            }}
        >
            <Toolbar
                sx={{
                    height: layout.navbarHeight,
                    minHeight: `${layout.navbarHeight}px !important`,
                    px: { xs: 2, sm: 3 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Left */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <IconButton
                        color="inherit"
                        aria-label="Toggle menu"
                        onClick={onToggleMobile}
                        sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'text.secondary' }}
                    >
                        <MenuIcon size={20} />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9375rem' }}
                        >
                            Administration
                        </Typography>
                        <Chip
                            label="Admin"
                            size="small"
                            sx={{
                                height: 22,
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                backgroundColor: 'warning.main',
                                color: '#1A1D23',
                            }}
                        />
                    </Box>
                </Box>

                {/* Right Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ThemeToggle />

                    <IconButton
                        onClick={() => navigate('/admin/notifications')}
                        aria-label="Notifications"
                        size="medium"
                        sx={{
                            width: 38,
                            height: 38,
                            color: 'text.secondary',
                            borderRadius: 1.5,
                            border: 1,
                            borderColor: 'divider',
                            backgroundColor: 'background.paper',
                            '&:hover': {
                                backgroundColor: 'background.hover',
                                color: 'text.primary',
                            },
                        }}
                    >
                        <Bell size={18} />
                    </IconButton>

                    {/* User profile dropdown */}
                    <Box
                        onClick={handleMenuOpen}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.25,
                            p: 0.5,
                            pr: 1,
                            borderRadius: 2,
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'background.hover',
                            },
                        }}
                    >
                        <Avatar
                            name={user ? `${user.first_name} ${user.last_name}` : 'Admin'}
                            size="sm"
                            status="online"
                        />
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                                {user ? `${user.first_name} ${user.last_name}` : 'Admin'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.tertiary', lineHeight: 1 }}>
                                Administrator
                            </Typography>
                        </Box>
                        <ChevronDown size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={isDropdownOpen}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                            sx: {
                                width: 220,
                                mt: 1,
                                borderRadius: 2,
                                boxShadow: 4,
                            },
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {user ? `${user.first_name} ${user.last_name}` : 'Admin'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.tertiary', display: 'block' }}>
                                {user?.email || ''}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 0.5 }} />

                        <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }} sx={{ gap: 1.5 }}>
                            <ArrowLeft size={16} />
                            <span>Back to App</span>
                        </MenuItem>

                        <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }} sx={{ gap: 1.5 }}>
                            <User size={16} />
                            <span>Profile</span>
                        </MenuItem>

                        <Divider sx={{ my: 0.5 }} />

                        <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: 'error.main' }}>
                            <LogOut size={16} />
                            <span>Logout</span>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default AdminTopbar;
