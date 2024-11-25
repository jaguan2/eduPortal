// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#344966', // Main color
        },
        secondary: {
            main: '#bfcc94', // Accent color
        },
        background: {
            default: '#f0f4ef', // Page background
            paper: '#f0f4ef', // Card, modal backgrounds
        },
        text: {
            primary: '#0d1821', // Main text color
            secondary: '#b4cded', // Secondary text color
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            fontSize: '2rem',
            color: '#0d1821',
        },
        body1: {
            color: '#344966',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Disable uppercase
                    borderRadius: '8px', // Rounded corners
                    padding: '8px 16px', // Adjust padding
                    backgroundColor: '#344966',
                    color: '#f0f4ef',
                    '&:hover': {
                        backgroundColor: '#0d1821',
                    },
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#0d1821',
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f0f4ef',
                    border: '1px solid #b4cded',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '12px',
                    border: '1px solid #344966',
                },
                head: {
                    backgroundColor: '#b4cded',
                    color: '#f0f4ef',
                    fontWeight: 'bold',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '16px',
                    borderRadius: '10px',
                    backgroundColor: '#f0f4ef',
                },
            },
        },
    },
});

export default theme;
