import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField ,Typography} from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';

const EditPIzza = ({ open, onClose, pizza, onEdit }) => {
  const [modalData, setModalData] = useState({
    name: '',
    price: '',
    restaurant_id: '',
    image: null,
  });

  // Initialize modalData when pizza changes
  useEffect(() => {
    if (pizza) {
      setModalData({
        id: pizza.id,
        name: pizza.name,
        price: pizza.price,
        restaurant_id: pizza.restaurant_id,
        image: pizza.image, // This assumes image is an object with a URL
      });
    }
  }, [pizza]);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData({
      ...modalData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setModalData({
      ...modalData,
      image: e.target.files[0],
    });
  };


  const handleModalSubmit = async () => {
    if (!modalData.name || !modalData.price || !modalData.restaurant_id) {
        swal({
            title: "All fields are required",
            icon: "warning",
        });
        return;
    }
    
    const payload = {
        name: modalData.name,
        price: parseFloat(modalData.price), // Convert price to number
        restaurant_id: parseInt(modalData.restaurant_id), // Ensure restaurant_id is a number
        // Add image only if it's updated or new
        ...(modalData.image && { image: modalData.image instanceof File ? modalData.image : undefined })
      };
  

    try {
      const response = await axiosInstance.put(`/pizzas/${modalData.id}`, payload, {
        headers: {
        
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        onEdit(response.data); // Callback to update pizza data in parent component
        onClose();
        swal({
          title: "Pizza Updated Successfully!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error updating pizza:", error.response ? error.response.data : error.message);
      swal({
        title: "Error Updating Pizza",
        text: error.response ? error.response.data.message : "An unknown error occurred.",
        icon: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
    <DialogTitle textAlign="center"><EditIcon /> Edit Pizza</DialogTitle>
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

export default EditPIzza;
