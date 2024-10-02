import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate,Outlet } from 'react-router-dom';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza'; // Orders
import PeopleIcon from '@mui/icons-material/People'; // Roles
import SecurityIcon from '@mui/icons-material/Security'; // Permissions
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'; // Restaurant
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';

const drawerWidth = 240;

const sidebarItems = [
    { text: 'Orders', icon: <LocalPizzaIcon />, path: '/admin/orders' },
    { text: 'Roles', icon: <PeopleIcon />, path: '/admin/roles' }, // Add the appropriate path for each item
    { text: 'Permissions', icon: <SecurityIcon />, path: '/admin/permissions' },
    { text: 'Pizza', icon: <LocalPizzaIcon />, path: '/admin/pizza' },
    { text: 'Restaurant', icon: <RestaurantMenuIcon />, path: '/admin/restaurant' },
    { text: 'Topping', icon: <EmojiFoodBeverageIcon />, path: '/admin/topping' },
    
 
  ];
  

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function AdminDashboard() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate(); // Hook for navigating

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
  {sidebarItems.map((item, index) => (
    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        onClick={() => handleNavigation(item.path)} // Navigate to the defined path
        sx={{
          minHeight: 48,
          px: 2.5,
          justifyContent: open ? 'initial' : 'center',
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            justifyContent: 'center',
            mr: open ? 3 : 'auto',
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          sx={{
            opacity: open ? 1 : 0,
          }}
        />
      </ListItemButton>
    </ListItem>
  ))}
</List>

      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, }}>
  {/* <DrawerHeader /> */}
 
        
        <Outlet />

</Box>

    </Box>
  );
}
