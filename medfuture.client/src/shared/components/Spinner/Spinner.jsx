import React from 'react';
import { Box, useTheme, Divider, CircularProgress } from '@mui/material';

const FullScreenLoadingSpinner = () => {
    const theme = useTheme();

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor={theme.palette.background.default}
            zIndex={9999}
        >
            <Divider
                flexItem
                orientation="horizontal"
                sx={{ width: '100%', my: 2 }}
            >
                <CircularProgress size={36} />

            </Divider>
        </Box>
    );
};

export default FullScreenLoadingSpinner;