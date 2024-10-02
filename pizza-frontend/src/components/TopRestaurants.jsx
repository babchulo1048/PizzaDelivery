import React,{useState,useEffect} from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import profilePicture from "../assets/profilePicture.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Icon for number of orders
import { axiosInstance } from '../config/api';

const topRestaurantsData = [
    {
        profilePic: profilePicture,
        description: 'Pizza Place 1',
        orders: 120
    },
    {
        profilePic: profilePicture,
        description: 'Pizza Place 2',
        orders: 100
    },
    {
        profilePic: profilePicture,
        description: 'Pizza Place 3',
        orders: 150
    },
    {
        profilePic: profilePicture,
        description: 'Pizza Place 4',
        orders: 80
    },
    {
        profilePic: profilePicture,
        description: 'Pizza Place 5',
        orders: 200
    },
    // Add more restaurants as needed
];

const TopRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axiosInstance.get('restaurants');
                console.log("restaurants", response.data);
                setRestaurants(response.data); // Set the fetched data to the restaurants state
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            }
        };
        fetchRestaurants();
    },[])
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom sx={{color:'#16120DBF'}}>
                Top Restaurants
            </Typography>
            <Slider {...settings}>
                {restaurants.map((restaurant, index) => (
                    <Box key={index} sx={{ px: 2}}> {/* Decreased horizontal padding */}
                        <Card 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                p: 1, // Decreased vertical padding
                                borderRadius: '12px', // Added rounded corners
                                boxShadow: 2, // Added shadow for depth
                                transition: 'transform 0.3s', // Smooth scaling effect
                                '&:hover': { transform: 'scale(1.05)' }, // Scale on hover
                                backgroundColor: 'white', // Card background color
                                mx:2 
                            }}
                        >
                            {/* Left Side: Profile Picture and Description */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 1 }}>
                                <img 
                                    src={profilePicture} 
                                    alt="Restaurant" 
                                    style={{ 
                                        width: '60px',
                                        height: '60px', 
                                        borderRadius: '50%', 
                                        objectFit: 'cover' 
                                    }} 
                                />
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>{restaurant.name}</Typography>
                            </Box>
                            
                            {/* Right Side: Number of Orders and Icon Button */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton 
                                    sx={{ 
                                        backgroundColor: 'orange', 
                                        color: 'white', 
                                        '&:hover': { backgroundColor: 'darkorange' }, 
                                        borderRadius: '50%', 
                                        p: 1, // Increased padding for a better click area
                                    }}
                                >
                                    <ShoppingCartIcon />
                                </IconButton>
                                <Typography variant="h6" sx={{ mr: 1 }}>100</Typography>
                            </Box>
                        </Card>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default TopRestaurants;
