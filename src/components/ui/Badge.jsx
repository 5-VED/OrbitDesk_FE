import React from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

const variantColorMap = {
    default: { color: 'default', text: 'text.secondary', bg: 'background.subtle' },
    primary: { color: 'primary', text: 'primary.main', bg: 'primary.main', alpha: 0.12 },
    success: { color: 'success', text: 'success.main', bg: 'success.main', alpha: 0.12 },
    warning: { color: 'warning', text: 'warning.main', bg: 'warning.main', alpha: 0.12 },
    danger: { color: 'error', text: 'error.main', bg: 'error.main', alpha: 0.12 },
    info: { color: 'info', text: 'info.main', bg: 'info.main', alpha: 0.12 },
};

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    className = '',
    sx = {},
    ...props
}) {
    const config = variantColorMap[variant] || variantColorMap.default;

    const sizeStyles = {
        sm: { height: 20, fontSize: '0.6875rem', px: 0.75 },
        md: { height: 24, fontSize: '0.75rem', px: 1 },
        lg: { height: 28, fontSize: '0.875rem', px: 1.25 },
    };

    const currentSize = sizeStyles[size] || sizeStyles.md;

    return (
        <Chip
            size="small"
            className={`badge badge-${size} badge-${variant} ${className}`}
            label={children}
            icon={
                dot ? (
                    <Box
                        component="span"
                        className="badge-dot"
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: 'currentColor',
                            ml: 0.75,
                            mr: -0.25,
                        }}
                    />
                ) : undefined
            }
            sx={{
                height: currentSize.height,
                fontSize: currentSize.fontSize,
                fontWeight: 500,
                borderRadius: '9999px',
                color: config.text,
                backgroundColor: (theme) =>
                    config.alpha
                        ? alpha(theme.palette[config.color]?.main || '#777', config.alpha)
                        : theme.palette.background.subtle,
                border: 'none',
                '& .MuiChip-label': {
                    px: currentSize.px,
                },
                ...sx,
            }}
            {...props}
        />
    );
}

// Status-specific badges for convenience
export function StatusBadge({ status }) {
    const statusConfig = {
        new: { label: 'New', variant: 'info' },
        open: { label: 'Open', variant: 'primary' },
        pending: { label: 'Pending', variant: 'warning' },
        hold: { label: 'On Hold', variant: 'default' },
        solved: { label: 'Solved', variant: 'success' },
        closed: { label: 'Closed', variant: 'default' },
        resolved: { label: 'Resolved', variant: 'success' },
        overdue: { label: 'Overdue', variant: 'danger' },
    };

    const config = statusConfig[status] || { label: status || 'Unknown', variant: 'default' };

    return <Badge variant={config.variant} dot>{config.label}</Badge>;
}

export function PriorityBadge({ priority }) {
    const priorityConfig = {
        low: { label: 'Low', variant: 'default' },
        normal: { label: 'Normal', variant: 'info' },
        high: { label: 'High', variant: 'warning' },
        urgent: { label: 'Urgent', variant: 'danger' },
        medium: { label: 'Medium', variant: 'info' },
    };

    const config = priorityConfig[priority] || { label: priority || 'Unknown', variant: 'default' };

    return <Badge variant={config.variant}>{config.label}</Badge>;
}
