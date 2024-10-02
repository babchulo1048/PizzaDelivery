import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, FormControlLabel, Checkbox } from '@mui/material';
import swal from 'sweetalert';
import { axiosInstance } from '../../../config/api';

const EditRole = ({ open, onClose, role, onEdit }) => {
    const [modalData, setModalData] = useState({ name: '', description: '', permissions: [] });
    const [fetchedPermissions, setFetchedPermissions] = useState([]);


    useEffect(() => {
        console.log("Role:", role);
        if (role) {
            setModalData({
                ...role,
                permissions: role.permissions || [] // Ensure permissions is always an array
            });
        }
    }, [role]);

    // Fetch available permissions
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
        setModalData(prevData => {
            const updatedPermissions = prevData.permissions.includes(permissionId)
                ? prevData.permissions.filter(id => id !== permissionId) // Remove if already exists
                : [...prevData.permissions, permissionId]; // Add permission ID
    
            return { ...prevData, permissions: updatedPermissions };
        });
    };
    

    const handleModalSubmit = async () => {
        try {
            const roleData = {
                name: modalData.name,
                description: modalData.description,
                permissions: modalData.permissions // Send permission IDs
            };

            const response = await axiosInstance.put(`/roles/${modalData.id}`, roleData);
           

            if (response.status === 200) {
                onEdit(response.data);
                onClose();
                swal({
                    title: "Role Updated Successfully!",
                    icon: "success"
                });
            }
        } catch (error) {
            console.log(error.response);
        }
    };

    const isPermissionChecked = (permissionId) => {
        console.log("Checking permission:", permissionId, "in", modalData.permissions);
        return modalData.permissions.includes(permissionId); // Check by ID
    };
    
    

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle textAlign="center"><EditIcon /> Edit Role</DialogTitle>
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
    <Grid item xs={12} sm={6} md={3} key={permission.id}>
        <FormControlLabel
            control={
                <Checkbox
                    checked={isPermissionChecked(permission.id)} // Use permission ID for checking
                    onChange={() => handlePermissionChange(permission.id)} // Use permission ID for handling changes
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

export default EditRole;
