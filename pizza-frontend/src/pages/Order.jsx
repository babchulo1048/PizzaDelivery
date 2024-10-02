import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { axiosInstance } from '../config/api';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const Order = () => {
    const [pizzaData, setPizzaData] = useState([]);

    const token = localStorage.getItem('authToken'); // Get the auth token from localStorage
    const navigate = useNavigate();


    // Fetch pizza data
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

    // Handle order confirmation
    // const handleOrderNowClick = async (pizza) => {
    //     const orderData = {
    //         customer_id: customerId,
    //         pizza_id: pizza.id,
    //         restaurant_id: pizza.restaurant_id,
    //         quantity: 1,
    //         toppings: [],

    //     };

    //     const willOrder = await swal({
    //         title: "Confirm Your Order",
    //         text: `Are you sure you want to order ${pizza.name}?`,
    //         icon: "warning",
    //         buttons: ["Cancel", "Confirm"],
    //     });

    //     if (willOrder) {
    //         try {
    //             const response = await axiosInstance.post('/orders/create', orderData);
    //             if (response.status === 201) {
    //                 swal({
    //                     title: 'Order Placed Successfully!',
    //                     icon: 'success',
    //                 });
    //             }
    //         } catch (error) {
    //             console.error('Error placing order:', error);
    //             swal({
    //                 title: 'Error placing order!',
    //                 text: error.response?.data?.errors?.map((err) => err.message).join(', '),
    //                 icon: 'error',
    //             });
    //         }
    //     }
    // };

    const handleOrderNowClick = async (pizza) => {
        navigate('/orders', { state: { pizza} });
    }

    return (
        <Container style={{ padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h4" align="center" style={{ marginBottom: '20px' }}>
                Order Your Pizza
            </Typography>
            <Grid container spacing={2}>
                {pizzaData.map((pizza) => (
                    <Grid item xs={12} sm={6} md={4} key={pizza.id}>
                        <Card>
                            <img src={pizza.image.url} alt={pizza.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            <CardContent>
                                <Typography variant="h6">{pizza.name}</Typography>
                                <Typography variant="body1">Price: {pizza.price} ETB</Typography>
                                {
                                    token &&(
                                        <Button
                                        variant="contained"
                                        style={{ background: '#FF890F', color: '#fff', marginTop: '10px' }} // Button color
                                        onClick={() => handleOrderNowClick(pizza)}
                                    >
                                        Order Now
                                    </Button>

                                    )
                                }
                               
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Order;
