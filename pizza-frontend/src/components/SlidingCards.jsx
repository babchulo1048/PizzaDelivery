import React from 'react';
import { Box, Card,Typography } from '@mui/material';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import featured from '../assets/featured.png';
import featured2 from '../assets/featured2.png';
import featured3 from '../assets/featured3.png';

const slidingImagesData = [
    featured,
    featured2,
    featured3,
];

const SlidingCards = () => {
    const settings = {
        dots: true,  // Enable dots for easier navigation
        infinite: true, // Infinite loop sliding
        speed: 500, // Transition speed
        slidesToShow: 1, // Only one slide at a time
        slidesToScroll: 1, // Move one slide at a time
        autoplay: true, // Automatically slide the cards
        autoplaySpeed: 3000, // Slide every 3 seconds
        pauseOnHover: false, // Prevent pause when hovering
        arrows: false, // Disable arrows for navigation
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', my: 10 }}> {/* Increase maxWidth */}
            <Typography variant="h4" gutterBottom align="center">
                Featured Pizza
            </Typography>
            <Slider {...settings}>
                {slidingImagesData.map((image, index) => (
                    <Box key={index} sx={{ p: 2 }}> {/* Image Container */}
                        <Card sx={{ p: 0 }}> {/* No padding for the card */}
                            <img 
                                src={image} 
                                alt={`Featured ${index + 1}`} 
                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }} // Set height to auto and increase width
                            />
                        </Card>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default SlidingCards;
