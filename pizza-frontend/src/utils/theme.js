import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Customize the primary color
        },
        secondary: {
            main: '#dc004e', // Customize the secondary color
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif', // Customize the font family
        h1: {
            fontSize: '2rem', // Customize the size of h1
        },
    },
    // You can add more customizations as needed
});
