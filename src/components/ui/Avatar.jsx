import React from 'react';
import MuiAvatar from '@mui/material/Avatar';
import MuiAvatarGroup from '@mui/material/AvatarGroup';
import MuiBadge from '@mui/material/Badge';
import { avatarColors } from '@/theme/tokens';

const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
};

function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

const statusColorMap = {
    online: '#22C55E',
    busy: '#EF4444',
    away: '#F59E0B',
    offline: '#6B7280',
};

export function Avatar({
    src,
    name,
    size = 'md',
    status,
    className = '',
    sx = {},
    ...props
}) {
    const dimension = sizeMap[size] || 40;
    const initials = getInitials(name);
    const bgColor = stringToColor(name || 'default');

    const avatarNode = (
        <MuiAvatar
            src={src}
            alt={name || 'Avatar'}
            className={`avatar avatar-${size} ${className}`}
            sx={{
                width: dimension,
                height: dimension,
                fontSize: dimension * 0.4,
                fontWeight: 600,
                backgroundColor: src ? 'transparent' : bgColor,
                color: '#FFFFFF',
                ...sx,
            }}
            {...props}
        >
            {!src && initials}
        </MuiAvatar>
    );

    if (status) {
        return (
            <MuiBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                    '& .MuiBadge-badge': {
                        backgroundColor: statusColorMap[status] || statusColorMap.offline,
                        color: statusColorMap[status] || statusColorMap.offline,
                        boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
                        width: Math.max(8, dimension * 0.25),
                        height: Math.max(8, dimension * 0.25),
                        borderRadius: '50%',
                    },
                }}
            >
                {avatarNode}
            </MuiBadge>
        );
    }

    return avatarNode;
}

export function AvatarGroup({ children, max = 4, size = 'md', sx = {} }) {
    const dimension = sizeMap[size] || 40;

    return (
        <MuiAvatarGroup
            max={max}
            sx={{
                '& .MuiAvatar-root': {
                    width: dimension,
                    height: dimension,
                    fontSize: dimension * 0.4,
                },
                ...sx,
            }}
        >
            {children}
        </MuiAvatarGroup>
    );
}

export default Avatar;
