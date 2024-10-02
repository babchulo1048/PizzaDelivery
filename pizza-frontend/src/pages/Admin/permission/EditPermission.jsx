import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';

const EditPermission = ({ open, onClose, permission, onEdit }) => {
  const [modalData, setModalData] = useState({ name: '', description: '' });

  // Initialize modalData when permission changes
  useEffect(() => {
    if (permission) {
      setModalData({
        id: permission.id,
        name: permission.name,
        description: permission.description,
      });
    }
  }, [permission]);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData({
      ...modalData,
      [name]: value,
    });
  };

  const handleModalSubmit = async () => {
    try {
      const response = await axiosInstance.put(`/permission/${modalData.id}`, modalData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('yourAuthToken')}`, // Adjust according to your auth mechanism
        },
      });

      if (response.status === 200) {
        onEdit(response.data);
        onClose();
        swal({
          title: "Permissions Updated Successfully!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error updating permission:", error.response ? error.response.data : error.message);
      swal({
        title: "Error Updating Permission",
        text: error.response ? error.response.data.message : "An unknown error occurred.",
        icon: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle textAlign="center"><EditIcon /> Edit Permission</DialogTitle>
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

export default EditPermission;
