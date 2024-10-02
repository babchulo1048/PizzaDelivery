import React from 'react';
import { Box, Typography, InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import pizza2 from "../assets/pizza2.jpeg";
import pizza from "../assets/pizza.png";

const HeroSection = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between', // Align content to left and image to right
                alignItems: 'center',
                my: 4,
                flexDirection: { xs: 'column', md: 'row' }, // Stack on small screens, row on larger
            }}
        >
            {/* Left Side - Text and Search */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, px: 3 }}>
                <Typography
                    variant="h2"
                    gutterBottom
                    sx={{
                        fontSize: '4.3rem',
                        background: 'linear-gradient(700deg, #FF8100, #FFBE71)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: 'bold',
                        textAlign: { xs: 'center', md: 'left' }, // Center for small screens
                    }}
                >
                    Order Us
                </Typography>

                <Typography variant="h6" sx={{ mb: 2, color: "#050505" }}>
                    In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without.
                </Typography>

                {/* Search Box */}
                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, my: 2 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search"
                        sx={{
                            width: '100%',
                            maxWidth: '748px',
                            backgroundColor: 'rgba(0, 0, 0, 0.15)',
                            boxShadow: '0px 5px 50px 0px #00000026',
                            borderRadius: '12px',
                            '& .MuiOutlinedInput-root': {
                                fontSize: '1.5rem',
                                color: '#6C727F',
                                '& fieldset': {
                                    border: 'none',
                                },
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        sx={{
                                            backgroundColor: '#FF890F',
                                            color: 'white',
                                            '&:hover': { backgroundColor: 'darkorange' },
                                            borderRadius: '50%',
                                            padding: '15px',
                                            marginRight: '12px',
                                        }}
                                    >
                                        <SearchIcon sx={{ fontSize: '2rem' }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Box>

            {/* Right Side - Pizza Image */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: { xs: 4, md: 0 }, // Add margin on top for small screens
                }}
            >
                <img
                    src={pizza}
                    alt="Pizza"
                    style={{
                        width: '100%',
                        maxWidth: '500px', // Adjust as needed
                        borderRadius: '12px',
                        boxShadow: '0px 5px 30px rgba(0, 0, 0, 0.2)',
                    }}
                />
            </Box>
        </Box>
    );
};

export default HeroSection;
