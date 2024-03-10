import React from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const theme = createTheme();

export default function CustomThemeProvider({ children }) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}
