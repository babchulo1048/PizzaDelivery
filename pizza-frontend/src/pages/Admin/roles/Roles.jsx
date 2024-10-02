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
import AddRole from './AddRole';
import EditRole from './EditRole';

const Roles = () => {
  const [roles, setRoles] = useState([]); // State for roles
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/roles');
      
        setRoles(response.data); // Set the fetched data to the roles state
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleOpenAddDialog = () => {
    setOpenAdd(true);
  };

  const handleCloseDialog = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    setSelectedRole(null);
    // setModalOpen(false);
  };


  const handleOpenEdit = (role) => {
    setSelectedRole(role); // Set the permission to edit
    setOpenEdit(true); // Open the edit dialog
  };

  const handleAddRole = (role) => {
    setRoles([...roles, role]);
  };

  const handleEditRole = (updatedRole) => {
    setRoles(roles.map((role) =>
      role.id === updatedRole.id ? updatedRole : role
    ));
    setOpenEdit(false);
  };

  const handleDeleteRole = async (id) => {
    const confirm = await swal({
      title: "Are you sure?",
      text: "You will not be able to recover this roles!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirm) {
      try {
        const response = await axiosInstance.delete(`/roles/${id}`
      );
        if(response.status === 200){
          setRoles(roles.filter((role) => role.id !== id));
          swal({
            title: "Roles Deleted Successfully!",
        
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
        accessorKey: 'id', // Column for role ID
        header: 'Role ID',
        size: 100,
      },
      {
        accessorKey: 'name', // Column for role name
        header: 'Role Name',
        size: 150,
      },
      {
        accessorKey: 'description', // Column for role description
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
                  <MenuItem onClick={() => handleDeleteRole(row.original.id)}>
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
    [roles]
  );

  // Set up the table with columns and fetched data
  const table = useMaterialReactTable({
    columns,
    data: roles, // Use fetched roles data here
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
        Add Roles
      </Button>
  <MaterialReactTable table={table} />
  <AddRole open={openAdd} onClose={handleCloseDialog} onAdd={handleAddRole} />
  {selectedRole && (
        <EditRole
          open={openEdit}
          onClose={handleCloseDialog}
          role={selectedRole}
          onEdit={handleEditRole}
        />
      )}
  </>
  )
};

export default Roles;
