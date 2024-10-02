import React from 'react';
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import { Facebook, LinkedIn, Twitter, YouTube, Telegram } from '@mui/icons-material';

const Footer = () => {
    const role = localStorage.getItem('role'); 
    return (
        <Box>
            {/* Top Layer - Only for customers */}
            {role === 'customer' && (
                <>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 165, 0, 0.4)', // Orange background with opacity
                        padding: '2.2rem',
                    }}
                >
                    {/* Navbar Links */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Home</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Order</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>About Us</Typography>
                    </Box>

                    {/* Feedback Input */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            variant="outlined"
                            placeholder="Send Feedback..."
                            size="small"
                            sx={{ mr: 1 }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton type="submit" sx={{ p: 0 }}>
                                        <Telegram />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                </Box>
         

          
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#222', // Dark background
                    color: 'white',
                    padding: '8px',
                }}
            >
                <Typography variant="body2">©2024 All Rights Reserved</Typography>

                {/* Social Media Icons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton sx={{ backgroundColor: '#555', borderRadius: '50%' }}>
                        <Facebook sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton sx={{ backgroundColor: '#555', borderRadius: '50%' }}>
                        <LinkedIn sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton sx={{ backgroundColor: '#555', borderRadius: '50%' }}>
                        <Twitter sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton sx={{ backgroundColor: '#555', borderRadius: '50%' }}>
                        <YouTube sx={{ color: 'white' }} />
                    </IconButton>
                </Box>
            </Box>
            </>
               )}
        </Box>
    );
};

export default Footer;
