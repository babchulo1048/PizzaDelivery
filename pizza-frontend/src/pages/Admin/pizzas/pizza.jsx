import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../../config/api';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPizza from './addPizza'; // Import the AddPizza modal component
import EditPIzza from './editPIzza';
import swal from 'sweetalert';

const Pizza = () => {
    const [pizzaData, setPizzaData] = useState([]);
    const [openAddPizza, setOpenAddPizza] = useState(false); 
    const [selectedPizza, setSelectedPizza] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    useEffect(() => {
        const fetchPizza = async () => {
            try {
                const response = await axiosInstance.get('/pizzas');
                console.log("first", response.data);
                setPizzaData(response.data);
            } catch (error) {
                console.error("Error fetching pizza:", error);
            }
        };

        fetchPizza();
    }, []);

    // Function to handle adding a new pizza
    const handleAddPizza = (newPizza) => {
        console.log("pizza4:", newPizza);
        setPizzaData((prevData) => [...prevData, newPizza]);
        setOpenAddPizza(false);
    };

    const handleOpenEdit = (pizza) => {
        setSelectedPizza(pizza); 
        setOpenEdit(true); // Open the edit dialog
    };

    const handleCloseDialog = () => {
        setOpenAddPizza(false); // Fix: use setOpenAddPizza instead of setOpenAdd
        setOpenEdit(false); // Close edit dialog as well
        setSelectedPizza(null); // Clear selected pizza
    };

    const handleEditPizza = (updatedPizza) => {
        setPizzaData(pizzaData.map((pizz) =>
            pizz.id === updatedPizza.id ? updatedPizza : pizz // Fix: change pizzaData to pizz
        ));
        setOpenEdit(false); // Close edit dialog after editing
    };

    // Function to handle deleting a pizza
    const handleDeletePizza = async (id) => {
        const confirm = await swal({
            title: "Are you sure?",
            text: "You will not be able to recover this pizza!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (confirm) {
            try {
                const response = await axiosInstance.delete(`/pizzas/${id}`);
                if (response.status === 200) {
                    setPizzaData((prevData) => prevData.filter((pizza) => pizza.id !== id)); 
                    swal({
                        title: "Pizza Deleted Successfully!",
                        icon: "success"
                    });
                }
            } catch (error) {
                console.error("Error deleting pizza:", error);
                swal({
                    title: `${error.response.data.message}`,
                    icon: "warning"
                });
            }
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            {/* Add Pizza Button at the top-right corner */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddPizza(true)} // Open the AddPizza modal
                >
                    Add Pizza
                </Button>
            </Box>

            {/* Pizza Menu Section */}
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
                Pizza Menu
            </Typography>
            <Grid container spacing={3}>
                {pizzaData.map((pizza) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={pizza.id}>
                        <Card sx={{ maxWidth: 345, position: 'relative' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={pizza.image.url}
                                alt={pizza.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {pizza.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Price: ${pizza.price}
                                </Typography>
                                {/* Display Toppings if they exist */}
                                {pizza.toppings && pizza.toppings.length > 0 && (
                                    <Typography variant="body2" color="text.secondary">
                                        Toppings: {pizza.toppings.join(', ')}
                                    </Typography>
                                )}
                            </CardContent>

                            {/* Edit and Delete Buttons */}
                            <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 1 }}>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleOpenEdit(pizza)} // Handle Edit
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeletePizza(pizza.id)} // Handle Delete
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* AddPizza Modal */}
            <AddPizza
                open={openAddPizza}
                onClose={handleCloseDialog}
                onAdd={handleAddPizza} // Update the pizza data when a new pizza is added
            />
            {openEdit && selectedPizza && (
                <EditPIzza
                    open={openEdit}
                    onClose={handleCloseDialog}
                    pizza={selectedPizza}
                    onEdit={handleEditPizza}
                />
            )}
        </Box>
    );
};

export default Pizza;
