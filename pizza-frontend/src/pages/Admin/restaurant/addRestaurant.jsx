import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';

const AddRestaurant = ({ open, onClose, onAdd}) => { // Accept superAdminId as a prop
    const targetId = localStorage.getItem('targetId');
  const [modalData, setModalData] = useState({
    name: '',
    address: '',
    super_admin_id: Number(targetId) || '', // Use the superAdminId prop
  });

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModalSubmit = async () => {
    try {
      const response = await axiosInstance.post('/restaurants/create', modalData);

      if (response.status === 201) {
        onAdd(response.data); // Call the onAdd prop to update the parent component
        onClose(); // Close the modal
        swal({
          title: 'Restaurant Created Successfully!',
          icon: 'success',
        });
        // Reset modal data
        setModalData({
          name: '',
          address: '',
          super_admin_id: superAdminId || '',
        });
      }
    } catch (error) {
      console.error('Errors:', error.response?.data?.errors);
    //   swal({
    //     title: 'Error creating restaurant!',
    //     text: error.response?.data?.errors?.map((err) => err.message).join(', '),
    //     icon: 'error',
    //   });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle textAlign="center"><AddIcon /> Add Restaurant</DialogTitle>
      <DialogContent>
        <TextField
          label="Restaurant Name"
          name="name"
          fullWidth
          required
          value={modalData.name}
          onChange={handleModalChange}
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          fullWidth
          required
          value={modalData.address}
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

export default AddRestaurant;
