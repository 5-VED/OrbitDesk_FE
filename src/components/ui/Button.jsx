import React from 'react';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    className = '',
    sx = {},
    ...props
}) {
    // Map existing custom sizes to MUI sizes
    const muiSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium';

    // Map existing variants to MUI variant + color + styling
    let muiVariant = 'contained';
    let muiColor = 'primary';
    let customSx = {};

    if (variant === 'secondary') {
        muiVariant = 'outlined';
        muiColor = 'inherit';
        customSx = {
            backgroundColor: 'background.subtle',
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': {
                backgroundColor: 'background.hover',
                borderColor: 'divider',
            },
        };
    } else if (variant === 'ghost') {
        muiVariant = 'text';
        muiColor = 'inherit';
        customSx = {
            color: 'text.secondary',
            '&:hover': {
                backgroundColor: 'background.hover',
                color: 'text.primary',
            },
        };
    } else if (variant === 'danger') {
        muiVariant = 'contained';
        muiColor = 'error';
    } else if (variant === 'success') {
        muiVariant = 'contained';
        muiColor = 'success';
    } else {
        muiVariant = 'contained';
        muiColor = 'primary';
    }

    const iconSize = size === 'sm' ? 14 : 16;
    const renderedIcon = Icon ? <Icon size={iconSize} /> : null;

    return (
        <MuiButton
            type={type}
            variant={muiVariant}
            color={muiColor}
            size={muiSize}
            fullWidth={fullWidth}
            disabled={disabled || loading}
            onClick={onClick}
            className={`btn btn-${variant} btn-${size} ${className}`}
            startIcon={
                loading ? (
                    <CircularProgress size={iconSize} color="inherit" />
                ) : iconPosition === 'left' ? (
                    renderedIcon
                ) : null
            }
            endIcon={!loading && iconPosition === 'right' ? renderedIcon : null}
            sx={{
                textTransform: 'none',
                fontWeight: 500,
                ...customSx,
                ...sx,
            }}
            {...props}
        >
            {children}
        </MuiButton>
    );
}

export default Button;
