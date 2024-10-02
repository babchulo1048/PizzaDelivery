import React, { useMemo, useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { axiosInstance } from '../../../config/api';
import AddTopping from './addTopping'; // Assuming you have an AddTopping component for adding new toppings

const Toppings = () => {
  const [toppings, setToppings] = useState([]); // State for toppings
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const response = await axiosInstance.get('/toppings'); // Adjust the endpoint as necessary
        console.log("response", response.data);
        setToppings(response.data); // Set the fetched data to the toppings state
      } catch (error) {
        console.error("Error fetching toppings:", error);
      }
    };

    fetchToppings();
  }, []);

  // Open the AddTopping dialog
  const handleOpenAddDialog = () => {
    setOpenAdd(true);
  };

  const handleAddTopping = (topping) => {
    setToppings((prev) => [...prev, topping]); 
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name', // Column for topping name
        header: 'Topping Name',
        size: 150,
      },
      {
        accessorKey: 'price', // Column for topping price
        header: 'Price',
        size: 100,
      },
    ],
    []
  );

  // Set up the table with columns and fetched data
  const table = useMaterialReactTable({
    columns,
    data: toppings, // Use fetched toppings data here
  });

  // Render the table
  return (
    <> 
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenAddDialog}
        style={{ marginBottom: '16px' }} // Adding some margin for better spacing
      >
        Add Topping
      </Button>
      <MaterialReactTable table={table} />
      <AddTopping open={openAdd} onClose={() => setOpenAdd(false)} onAdd={handleAddTopping} />
    </>
  );
};

export default Toppings;
