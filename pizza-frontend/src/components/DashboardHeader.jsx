import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';// Your Drawer component
import DrawerHeader from './DrawerHeader'// Your DrawerHeader

const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet /> {/* This will render the main content based on the route */}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
