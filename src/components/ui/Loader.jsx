import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const Loader = ({ size = 'medium', fullScreen = false }) => {
    const pixelSize = size === 'small' ? 24 : size === 'large' ? 64 : 44;

    if (fullScreen) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    inset: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    zIndex: 9999,
                }}
            >
                <CircularProgress size={pixelSize} thickness={4} color="primary" />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minHeight: 200,
                p: 3,
            }}
        >
            <CircularProgress size={pixelSize} thickness={4} color="primary" />
        </Box>
    );
};

export default Loader;
