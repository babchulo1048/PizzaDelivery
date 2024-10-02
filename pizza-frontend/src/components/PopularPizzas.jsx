import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Avatar, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid';
import { axiosInstance } from '../config/api';
import pizza from "../assets/pizza.jpeg"; // Sample image
import profilePicture from "../assets/profilePicture.jpg"; 
import swal from 'sweetalert';

const PopularPizzas = () => {
    const [pizzaData, setPizzaData] = useState([]);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderError, setOrderError] = useState(false);
    const targetId = localStorage.getItem('targetId');

    useEffect(() => {
        const fetchPizzaData = async () => {
            try {
                const response = await axiosInstance.get('/pizzas');
                console.log("pizzas", response.data);
                setPizzaData(response.data);
            } catch (error) {
                console.error('Error fetching pizza data:', error);
            }
        };
        fetchPizzaData();
    }, []);

    const handleOrder = async (pizza) => {
        console.log("pizza",pizza)
        try {
            // Assuming the order API endpoint is '/orders'
            const orderData = {
                customer_id: Number(targetId),
                pizza_id: pizza.id,
                restaurant_id: pizza.restaurant_id,
            };
            const response = await axiosInstance.post('/orders/create', orderData);
            if (response.status === 201) {
            setOrderSuccess(true);
            swal({
                title: 'Your OrderCreated Successfully!',
                icon: 'success',
              });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setOrderError(true);
        }
    };

    return (
        <Box sx={{ my: 16, px: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#16120DBF', textAlign: 'center', mb: 4 }}>
                Popular Pizzas
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {pizzaData.map((pizza, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            borderRadius: '16px',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                position: 'relative',
                                paddingTop: '75%', // 4:3 Aspect Ratio
                                backgroundColor: 'rgba(255, 129, 0, 0.1)',
                            }}>
                                <img
                                    src={pizza.image.url}
                                    alt={pizza.name}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>

                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {pizza.name}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                    <Typography variant="h5" sx={{ color: 'green', fontWeight: 'bold' }}>
                                        {pizza.price}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleOrder(pizza)} // Order button click event
                                        sx={{
                                            backgroundColor: 'orange',
                                            '&:hover': { backgroundColor: 'darkorange' },
                                            color: 'white',
                                            fontWeight: 'bold',
                                            borderRadius: '20px',
                                            px: 3,
                                            transition: 'background-color 0.3s ease',
                                        }}
                                    >
                                        Order
                                    </Button>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    <Avatar
                                        src={profilePicture}
                                        alt={pizza.restaurantName}
                                        sx={{ width: 32, height: 32, mr: 1 }}
                                    />
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {pizza.restaurantName}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Snackbar for order success/error */}
            <Snackbar
                open={orderSuccess}
                onClose={() => setOrderSuccess(false)}
                message="Order placed successfully!"
                autoHideDuration={3000}
                sx={{ bottom: 70 }}
            />
            <Snackbar
                open={orderError}
                onClose={() => setOrderError(false)}
                message="Error placing order. Please try again."
                autoHideDuration={3000}
                sx={{ bottom: 70 }}
            />
        </Box>
    );
};

export default PopularPizzas;
