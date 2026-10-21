import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { X } from 'lucide-react';

const sizeMap = {
    small: 'xs',
    medium: 'sm',
    large: 'md',
    xlarge: 'lg',
};

export function Modal({
    isOpen,
    onClose,
    title,
    eyebrow,
    iconChip,
    children,
    footer,
    size = 'medium',
    closeOnOverlay = true,
    closeOnEsc = true,
}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const maxWidth = sizeMap[size] || 'sm';

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick' && !closeOnOverlay) {
            return;
        }
        if (reason === 'escapeKeyDown' && !closeOnEsc) {
            return;
        }
        onClose?.();
    };

    return (
        <Dialog
            open={Boolean(isOpen)}
            onClose={handleClose}
            fullScreen={fullScreen}
            maxWidth={maxWidth}
            fullWidth
            aria-labelledby={typeof title === 'string' ? 'modal-dialog-title' : undefined}
            PaperProps={{
                sx: {
                    borderRadius: fullScreen ? 0 : 2,
                    p: 0,
                    overflow: 'hidden',
                },
            }}
        >
            <IconButton
                aria-label="Close modal"
                onClick={onClose}
                size="small"
                sx={{
                    position: 'absolute',
                    right: 12,
                    top: 12,
                    color: 'text.secondary',
                    zIndex: 2,
                    '&:hover': {
                        backgroundColor: 'background.hover',
                        color: 'text.primary',
                    },
                }}
            >
                <X size={18} />
            </IconButton>

            {(eyebrow || iconChip) && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 3,
                        pt: 2.5,
                    }}
                >
                    {iconChip && (
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 28,
                                height: 28,
                                borderRadius: 1,
                                backgroundColor:
                                    iconChip.variant === 'danger'
                                        ? 'error.main'
                                        : iconChip.variant === 'warning'
                                        ? 'warning.main'
                                        : iconChip.variant === 'success'
                                        ? 'success.main'
                                        : 'info.main',
                                color: '#FFFFFF',
                                opacity: 0.9,
                            }}
                        >
                            <iconChip.icon size={16} />
                        </Box>
                    )}
                    {eyebrow && (
                        <Typography
                            variant="overline"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                            }}
                        >
                            {eyebrow}
                        </Typography>
                    )}
                </Box>
            )}

            {title && (
                <DialogTitle
                    id="modal-dialog-title"
                    sx={{
                        fontFamily: 'font.heading',
                        fontWeight: 600,
                        fontSize: '1.25rem',
                        px: 3,
                        pt: eyebrow || iconChip ? 1 : 2.5,
                        pb: 1.5,
                        pr: 6,
                    }}
                >
                    {title}
                </DialogTitle>
            )}

            <DialogContent
                dividers
                sx={{
                    px: 3,
                    py: 2.5,
                    borderTop: title ? undefined : 'none',
                }}
            >
                {children}
            </DialogContent>

            {footer && (
                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        backgroundColor: 'background.subtle',
                        gap: 1,
                    }}
                >
                    {footer}
                </DialogActions>
            )}
        </Dialog>
    );
}

export default Modal;
