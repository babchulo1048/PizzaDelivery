import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';

const AddPizza = ({ open, onClose, onAdd }) => {
  const [modalData, setModalData] = useState({
    name: '',
    price: '',
    restaurant_id: '',
    image: null,
    toppings: [], // New state for toppings
  });

  const [toppingInput, setToppingInput] = useState(''); // State for the topping input

  // Handle input changes
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setModalData((prev) => ({
      ...prev,
      image: e.target.files[0], // Save the selected image file
    }));
  };

  // Handle topping input change
  const handleToppingChange = (e) => {
    setToppingInput(e.target.value);
  };

  // Add topping to the list
  const handleAddTopping = () => {
    if (toppingInput.trim() === '') return; // Ignore empty inputs
    setModalData((prev) => ({
      ...prev,
      toppings: [...prev.toppings, toppingInput], // Add the new topping
    }));
    setToppingInput(''); // Clear the topping input
  };

  // Handle form submission
  const handleModalSubmit = async () => {
    try {
      // Create a FormData object to handle image upload
      const formData = new FormData();
      formData.append('name', modalData.name);
      formData.append('price', modalData.price);
      formData.append('restaurant_id', modalData.restaurant_id);
      formData.append('image', modalData.image); // Add the image file
      formData.append('toppings', JSON.stringify(modalData.toppings)); // Add toppings as a JSON string

      const response = await axiosInstance.post('/pizzas/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        onAdd(response.data); // Call the onAdd prop to update the parent component
        swal({
          title: 'Pizza Created Successfully!',
          icon: 'success',
        });
        onClose(); // Close the modal
        // Reset modal data
        setModalData({
          name: '',
          price: '',
          restaurant_id: '',
          image: null,
          toppings: [],
        });
      }
    } catch (error) {
      console.error('Errors:', error.response?.data?.errors);
      // swal({
      //   title: 'Error creating pizza!',
      //   text: error.response?.data?.errors?.map((err) => err.message).join(', '),
      //   icon: 'error',
      // });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle textAlign="center"><AddIcon /> Add Pizza</DialogTitle>
      <DialogContent>
        <TextField
          label="Pizza Name"
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
          type="number"
          fullWidth
          required
          value={modalData.price}
          onChange={handleModalChange}
          margin="normal"
        />
        <TextField
          label="Restaurant ID"
          name="restaurant_id"
          type="number"
          fullWidth
          required
          value={modalData.restaurant_id}
          onChange={handleModalChange}
          margin="normal"
        />
        <Button
          variant="contained"
          component="label"
          sx={{ mt: 2 }}
        >
          Upload Pizza Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
        
        {/* Topping Input */}
        <TextField
          label="Add Topping"
          value={toppingInput}
          onChange={handleToppingChange}
          margin="normal"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTopping}
          sx={{ mt: 2 }}
        >
          Add Topping
        </Button>

        {/* Display Toppings */}
        <div style={{ marginTop: '10px' }}>
          <strong>Toppings:</strong>
          <ul>
            {modalData.toppings.map((topping, index) => (
              <li key={index}>{topping}</li>
            ))}
          </ul>
        </div>
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

export default AddPizza;
