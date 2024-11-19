// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#606c38', // Main color
        },
        secondary: {
            main: '#dda15e', // Accent color
        },
        background: {
            default: '#fefae0', // Page background
            paper: '#fefae0', // Card, modal backgrounds
        },
        text: {
            primary: '#283618', // Main text color
            secondary: '#bc6c25', // Secondary text color
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            fontSize: '2rem',
            color: '#283618',
        },
        body1: {
            color: '#606c38',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Disable uppercase
                    borderRadius: '8px',  // Rounded corners
                    padding: '8px 16px', // Adjust padding
                    backgroundColor: '#606c38',
                    color: '#fefae0',
                    '&:hover': {
                        backgroundColor: '#283618',
                    },
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#283618',
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    backgroundColor: '#fefae0',
                    border: '1px solid #bc6c25',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '12px',
                    border: '1px solid #606c38',
                },
                head: {
                    backgroundColor: '#bc6c25',
                    color: '#fefae0',
                    fontWeight: 'bold',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '16px',
                    borderRadius: '10px',
                    backgroundColor: '#fefae0',
                },
            },
        },
    },
});

export default theme;
