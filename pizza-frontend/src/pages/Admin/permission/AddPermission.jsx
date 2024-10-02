import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';

const AddPermission = ({ open, onClose, onAdd }) => {
  const [modalData, setModalData] = useState({
    name: '',
    description: '',
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
      const response = await axiosInstance.post('/permission', modalData);

      if (response.status === 201) {
        onAdd(response.data); // Call the onAdd prop to update the parent component
        onClose(); // Close the modal
        swal({
          title: 'Permission Created Successfully!',
          icon: 'success',
        });
        // Reset modal data
        setModalData({
          name: '',
          description: '',
        });
      }
    } catch (error) {
      console.error('Errors:', error.response?.data?.errors);
      swal({
        title: 'Error creating permission!',
        text: error.response?.data?.errors?.map((err) => err.message).join(', '),
        icon: 'error',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle textAlign="center"><AddIcon /> Add Permission</DialogTitle>
      <DialogContent>
        <TextField
          label="Permission Name"
          name="name"
          fullWidth
          required
          value={modalData.name}
          onChange={handleModalChange}
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          required
          value={modalData.description}
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

export default AddPermission;
