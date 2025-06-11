import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

const AlertPopup = ({ open, message, type = 'error', onClose, duration = 2500 }) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose && onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [open, onClose, duration]);

    return (
        <Fade in={open} timeout={400} unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    top: 32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1400,
                    minWidth: 320,
                    maxWidth: '80vw',
                }}
            >
                <Alert severity={type} sx={{ fontSize: 16, px: 3, py: 2, boxShadow: 2 }}>
                    {message}
                </Alert>
            </Box>
        </Fade>
    );
};

export default AlertPopup; 