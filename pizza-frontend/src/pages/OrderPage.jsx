import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel, IconButton, Card, CardContent, CardMedia } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add, Remove, ArrowForward, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { axiosInstance } from '../config/api';
import { useLocation } from 'react-router-dom';
import swal from 'sweetalert';

const OrderPage = () => {
  const location = useLocation();
  const pizzas = location.state?.pizza || [];
  
  if (pizzas.length === 0) {
    return <Typography variant="h6">No pizzas available.</Typography>;
  }

  const customerId = Number(localStorage.getItem('targetId'));
  const [quantities, setQuantities] = useState(Array(pizzas.length).fill(0));
  const [toppings, setToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [orderMessage, setOrderMessage] = useState("");
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const response = await axiosInstance.get('/toppings'); // Adjust API endpoint as necessary
        setToppings(response.data); // Assume response is an array of toppings
      } catch (error) {
        console.error("Error fetching toppings:", error);
      }
    };
    fetchToppings();
  }, []);

  const increaseQuantity = (index) => {
    const newQuantities = [...quantities];
    newQuantities[index] += 1;
    setQuantities(newQuantities);
  };

  const decreaseQuantity = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 0) {
      newQuantities[index] -= 1;
      setQuantities(newQuantities);
    }
  };

  const handleToppingChange = (toppingId) => {
    setSelectedToppings((prevSelected) => {
      if (prevSelected.includes(toppingId)) {
        return prevSelected.filter((id) => id !== toppingId);
      } else {
        return [...prevSelected, toppingId];
      }
    });
  };

  const handleOrder = async () => {
    const orderData = {
      customer_id: customerId,
      pizza_id: pizzas.id, // Adjust based on selection
      restaurant_id: pizzas.restaurant_id, // Adjust as necessary
      quantity: quantities[0], // Adjust based on selection
      toppings: selectedToppings,
    };

    const willOrder = await swal({
      title: "Confirm Your Order",
      text: `Are you sure you want to order ${pizzas.name}?`,
      icon: "warning",
      buttons: ["Cancel", "Confirm"],
    });

    if (willOrder) {
      try {
        const response = await axiosInstance.post('/orders/create', orderData);
        if (response.status === 201) {
          swal({
            title: 'Order Placed Successfully!',
            icon: 'success',
          });
          setOrderMessage("Order Created!");
          setTimeout(() => setOrderMessage(""), 3000);
        }
      } catch (error) {
        console.error('Error placing order:', error);
        swal({
          title: 'Error placing order!',
          text: error.response?.data?.errors?.map((err) => err.message).join(', '),
          icon: 'error',
        });
      }
    }
  };

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300; // Adjust this value as needed
      sliderRef.current.scrollLeft += direction * scrollAmount;
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#F0F0F0' }}>
      <Grid container spacing={4}>
        {/* Left Side - Pizza Image */}
        <Grid item xs={12} md={6}>
          <img src={pizzas.image.url} alt={pizzas.name} style={{ width: '100%', borderRadius: '16px' }} />
        </Grid>

        {/* Right Side - Order Form */}
        <Grid item xs={12} md={6}>
          <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: '16px', boxShadow: 3 }}>
            <Typography variant="h5">{pizzas.name}</Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>{pizzas.description}</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">Toppings:</Typography>
              {toppings.map((topping) => (
                <FormControlLabel
                  key={topping.id}
                  control={
                    <Checkbox
                      checked={selectedToppings.includes(topping.id)}
                      onChange={() => handleToppingChange(topping.id)}
                    />
                  }
                  label={`${topping.name} (${topping.price})`}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
              <IconButton onClick={() => decreaseQuantity(0)}>
                <Remove />
              </IconButton>
              <Typography sx={{ margin: '0 10px' }}>{quantities[0]}</Typography>
              <IconButton onClick={() => increaseQuantity(0)}>
                <Add />
              </IconButton>
            </Box>

            <Button variant="contained" color="primary" fullWidth onClick={handleOrder} disabled={quantities[0] === 0}>
              Order
            </Button>
            {orderMessage && (
              <Typography variant="h6" sx={{ color: 'green', textAlign: 'center', marginTop: 2 }}>
                {orderMessage}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      
    </Box>
  );
};

export default OrderPage;
