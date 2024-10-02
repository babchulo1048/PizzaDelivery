import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../../config/api';
import { Grid, Card, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddRestaurant from './addRestaurant'; // Modal component for adding a new restaurant
import EditRestaurant from './editRestaurant'; // Modal component for editing an existing restaurant
import swal from 'sweetalert';

const Restaurant = () => {
    const [restaurantData, setRestaurantData] = useState([]);
    const [openAddRestaurant, setOpenAddRestaurant] = useState(false); 
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axiosInstance.get('/restaurants'); // Fetch restaurants from the backend
                setRestaurantData(response.data);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            }
        };

        fetchRestaurants();
    }, []);

    // Function to handle adding a new restaurant
    const handleAddRestaurant = (newRestaurant) => {
        setRestaurantData((prevData) => [...prevData, newRestaurant]);
    };

    const handleOpenEdit = (restaurant) => {
        setSelectedRestaurant(restaurant); 
        setOpenEdit(true); // Open the edit dialog
    };

    const handleCloseDialog = () => {
        setOpenAddRestaurant(false);
        setOpenEdit(false); // Close edit dialog as well
        setSelectedRestaurant(null); // Clear selected restaurant
    };

    const handleEditRestaurant = (updatedRestaurant) => {
        setRestaurantData(restaurantData.map((rest) =>
            rest.id === updatedRestaurant.id ? updatedRestaurant : rest
        ));
        setOpenEdit(false); // Close edit dialog after editing
    };

    // Function to handle deleting a restaurant
    const handleDeleteRestaurant = async (id) => {
        const confirm = await swal({
            title: "Are you sure?",
            text: "You will not be able to recover this restaurant!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });
        if (confirm) {
            try {
                await axiosInstance.delete(`/restaurants/${id}`);
                setRestaurantData((prevData) => prevData.filter((restaurant) => restaurant.id !== id)); 
                swal({
                    title: "Restaurant Deleted Successfully!",
                    icon: "success"
                });
            } catch (error) {
                console.error("Error deleting restaurant:", error);
                swal({
                    title: `${error.response.data.message}`,
                    icon: "warning"
                });
            }
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            {/* Add Restaurant Button at the top-right corner */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddRestaurant(true)} // Open the AddRestaurant modal
                >
                    Add Restaurant
                </Button>
            </Box>

            {/* Restaurant Section */}
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
                Restaurant List
            </Typography>
            <Grid container spacing={3}>
                {restaurantData.map((restaurant) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.id}>
                        <Card sx={{ maxWidth: 345, position: 'relative' }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {restaurant.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Address: {restaurant.address}
                                </Typography>
                            </CardContent>

                            {/* Edit and Delete Buttons */}
                            <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 1 }}>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleOpenEdit(restaurant)} // Handle Edit
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteRestaurant(restaurant.id)} // Handle Delete
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* AddRestaurant Modal */}
            <AddRestaurant
                open={openAddRestaurant}
                onClose={handleCloseDialog}
                onAdd={handleAddRestaurant} // Update the restaurant data when a new restaurant is added
            />
            {/* EditRestaurant Modal */}
            {openEdit && selectedRestaurant && (
                <EditRestaurant
                    open={openEdit}
                    onClose={handleCloseDialog}
                    restaurant={selectedRestaurant}
                    onEdit={handleEditRestaurant}
                />
            )}
        </Box>
    );
};

export default Restaurant;
