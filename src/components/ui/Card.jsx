import React from 'react';
import MuiCard from '@mui/material/Card';
import MuiCardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const paddingMap = {
    none: 0,
    sm: 2, // 16px
    md: 3, // 24px
    lg: 4, // 32px
};

export function Card({
    children,
    className = '',
    padding = 'md',
    hover = false,
    onClick,
    sx = {},
    ...props
}) {
    return (
        <MuiCard
            className={`card card-padding-${padding} ${hover ? 'card-hover' : ''} ${className}`}
            onClick={onClick}
            sx={{
                p: paddingMap[padding] ?? 3,
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
                ...(hover && {
                    cursor: 'pointer',
                    '&:hover': {
                        boxShadow: 3,
                        borderColor: 'text.secondary',
                    },
                }),
                ...sx,
            }}
            {...props}
        >
            {children}
        </MuiCard>
    );
}

export function CardHeader({ children, className = '', sx = {} }) {
    return (
        <Box
            className={`card-header ${className}`}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                mb: 2,
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}

export function CardTitle({ children, className = '', sx = {} }) {
    return (
        <Typography
            variant="h3"
            component="h3"
            className={`card-title ${className}`}
            sx={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'text.primary',
                m: 0,
                ...sx,
            }}
        >
            {children}
        </Typography>
    );
}

export function CardDescription({ children, className = '', sx = {} }) {
    return (
        <Typography
            variant="body2"
            className={`card-description ${className}`}
            sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                m: 0,
                ...sx,
            }}
        >
            {children}
        </Typography>
    );
}

export function CardContent({ children, className = '', sx = {} }) {
    return (
        <Box
            className={`card-content ${className}`}
            sx={{
                color: 'text.primary',
                p: 0,
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}

export function CardFooter({ children, className = '', sx = {} }) {
    return (
        <Box
            className={`card-footer ${className}`}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 2.5,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider',
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}
