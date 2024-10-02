import React, { useMemo, useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Button, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { axiosInstance } from '../../../config/api';
import AddPermission from './AddPermission';
import EditPermission from './EditPermission';

const Permissions = () => {
  const [permissions, setPermissions] = useState([]); // State for permissions
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosInstance.get('/permission');
        console.log("response", response.data);
        setPermissions(response.data); // Set the fetched data to the permissions state
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  // Open the AddPermission dialog
  const handleOpenAddDialog = () => {
    setOpenAdd(true);
  };

  // Open the EditPermission dialog
  const handleOpenEdit = (permission) => {
    setSelectedPermission(permission); // Set the permission to edit
    setOpenEdit(true); // Open the edit dialog
  };

  // Close all dialogs
  const handleCloseDialog = () => {
    setOpenAdd(false);
    setOpenEdit(false); // Close edit dialog as well
    setSelectedPermission(null); // Clear selected permission
  };

  const handleAddPermission = (permission) => {
    // Logic to handle the newly added permission
    setPermissions((prev) => [...prev, permission]); 
  };

  const handleEditPermission = (updatedPermission) => {
    setPermissions(permissions.map((permission) =>
      permission.id === updatedPermission.id ? updatedPermission : permission
    ));
    setOpenEdit(false); // Close edit dialog after editing
  };

  const handleDeletePermission = async (id) => {
    const confirm = await swal({
      title: "Are you sure?",
      text: "You will not be able to recover this permissions!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirm) {
      try {
        const response = await axiosInstance.delete(`/permission/${id}`
      );
        if(response.status === 200){
          setPermissions(permissions.filter((semester) => semester.id !== id));
          swal({
            title: "Permissions Deleted Successfully!",
        
            icon: "success"
          });
        }
      } catch (error) {
      
        swal({
          title: `${error.response.data.message}`,
      
          icon: "warning"
        });
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id', // Column for permission ID
        header: 'Permission ID',
        size: 100,
      },
      {
        accessorKey: 'name', // Column for permission name
        header: 'Permission Name',
        size: 150,
      },
      {
        accessorKey: 'description', // Column for permission description
        header: 'Description',
        size: 200,
      },
      {
        accessorKey: 'actions', // Column for action buttons
        header: 'Actions',
        Cell: ({ row }) => (
          <PopupState variant="popover" popupId={`actions-popup-${row.id}`}>
            {(popupState) => (
              <>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  <MoreVertIcon />
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={() => handleOpenEdit(row.original)}>
                    <EditIcon fontSize="small" />
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => handleDeletePermission(row.original.id)}>
                    <DeleteIcon fontSize="small" />
                    Delete
                  </MenuItem>
                </Menu>
              </>
            )}
          </PopupState>
        ),
      },
    ],
    [permissions] // Added dependencies to update on permission change
  );

  // Set up the table with columns and fetched data
  const table = useMaterialReactTable({
    columns,
    data: permissions, // Use fetched permissions data here
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
        Add Permission
      </Button>
      <MaterialReactTable table={table} />
      <AddPermission open={openAdd} onClose={handleCloseDialog} onAdd={handleAddPermission} />
      {openEdit && selectedPermission && (
        <EditPermission
          open={openEdit}
          onClose={handleCloseDialog}
          permission={selectedPermission}
          onEdit={handleEditPermission}
        />
      )}
    </>
  );
};

export default Permissions;
