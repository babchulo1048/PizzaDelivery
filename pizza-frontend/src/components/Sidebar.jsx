import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = () => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/orders">
          <ListItemText primary="Orders" />
        </ListItem>
        {/* Add more sidebar links here */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
