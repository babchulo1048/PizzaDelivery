import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';

const AddTopping = ({ open, onClose, onAdd }) => {
  const [modalData, setModalData] = useState({
    name: '',
    price: '', // Keep it as string initially to allow controlled input
  });

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    // Convert price to number only if it's the price field
    setModalData((prev) => ({
      ...prev,
      [name]: name === 'price' ? value : value,
    }));
  };

  const handleModalSubmit = async () => {
    try {
      // Convert price to a number for the API
      const response = await axiosInstance.post('/toppings', {
        ...modalData,
        price: parseFloat(modalData.price), // Convert price to a float
      });

      if (response.status === 201) {
        onAdd(response.data); // Call the onAdd prop to update the parent component
        onClose(); // Close the modal
        swal({
          title: 'Topping Created Successfully!',
          icon: 'success',
        });
        // Reset modal data
        setModalData({
          name: '',
          price: '', // Resetting price
        });
      }
    } catch (error) {
      console.error('Errors:', error.response?.data?.errors);
      swal({
        title: 'Error creating topping!',
        text: error.response?.data?.errors?.map((err) => err.message).join(', '),
        icon: 'error',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle textAlign="center"><AddIcon /> Add Topping</DialogTitle>
      <DialogContent>
        <TextField
          label="Topping Name"
          name="name"
          fullWidth
          required
          value={modalData.name}
          onChange={handleModalChange}
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          type="number" // Set input type to number for price
          fullWidth
          required
          value={modalData.price}
          onChange={handleModalChange}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleModalSubmit}>
          Submit
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTopping;
