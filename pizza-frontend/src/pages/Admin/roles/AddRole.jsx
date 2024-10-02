import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, FormControlLabel, Checkbox } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';

const AddRole = ({ onAdd, open, onClose }) => {
    const [modalData, setModalData] = useState({
        name: '',
        description: '',
        permission: [] // Store permission IDs
    });
    const [fetchedPermissions, setFetchedPermissions] = useState([]);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axiosInstance.get("/permission");
                setFetchedPermissions(response.data);
            } catch (err) {
                console.error("Failed to fetch permissions:", err);
            }
        };

        fetchPermissions();
    }, []);

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setModalData({
            ...modalData,
            [name]: value,
        });
    };

    const handlePermissionChange = (permissionId) => {
        setModalData((prevData) => {
            const permissionExists = prevData.permission.includes(permissionId);
            const updatedPermissions = permissionExists
                ? prevData.permission.filter((id) => id !== permissionId)
                : [...prevData.permission, permissionId]; // Use IDs

            return { ...prevData, permission: updatedPermissions };
        });
    };

    const handleModalSubmit = async () => {
        try {
            const roleData = {
                name: modalData.name,
                description: modalData.description,
                permissions: modalData.permission // Send permission IDs
            };
            const response = await axiosInstance.post(`/roles`, roleData);

            if (response.status === 201) {
                onAdd(response.data);
                onClose();
                swal({
                    title: "Role Created Successfully!",
                    icon: "success"
                });
                setModalData({
                    name: "",
                    description: "",
                    permission: [] // Reset permissions
                });
            }
        } catch (error) {
            console.log("errors:", error.response?.data?.errors);
            swal({
                title: "Error creating role!",
                text: error.response?.data?.errors?.map((err) => err.message).join(', '),
                icon: "error"
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle textAlign="center"><AddIcon /> Add Role</DialogTitle>
            <DialogContent>
                <TextField
                    label="Role Name"
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
                <Grid container spacing={2} marginTop={2}>
                    {fetchedPermissions.map((permission) => (
                        <Grid item xs={12} sm={6} md={4} key={permission.id}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={modalData.permission.includes(permission.id)} // Use ID for checked state
                                        onChange={() => handlePermissionChange(permission.id)} // Use ID in the change handler
                                    />
                                }
                                label={permission.name}
                            />
                        </Grid>
                    ))}
                </Grid>
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

export default AddRole;
