import React from 'react';
import { Box, useTheme, Divider, CircularProgress } from '@mui/material';
import Lottie from 'react-lottie';
import animationData from 'lotties/blood-line';

const FullScreenLoadingSpinner = () => {
    const theme = useTheme();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

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
                { /* <CircularProgress size={36} /> */}
                <Lottie
                    options={defaultOptions}
                    height={200}
                    width={200}
                />
            </Divider>
        </Box>
    );
};

export default FullScreenLoadingSpinner;