import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';

const Navbar = () => {
    const location = useLocation(); // Detect the current route
    const token = localStorage.getItem('authToken'); // Check for auth token
    const role = localStorage.getItem('role'); // Get user role from localStorage
    const navigate = useNavigate(); // For navigation

    const linkStyle = (path) => ({
        textDecoration: 'none',
        color: location.pathname === path ? '#FF8100' : '#16120DBF', // Change color if active
        margin: '0 20px'
    });

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove token
        localStorage.removeItem('role'); // Remove role
        localStorage.removeItem('targetId'); // Remove other stored data
        navigate('/'); // Redirect to homepage
    };

    return (
        <AppBar 
            position="static" 
            style={{ 
                background: 'rgba(255, 129, 0, 0.2)', // 20% opacity background
                boxShadow: '0px 0px 15px 0px rgba(255, 129, 0, 0.2)' 
            }}>
            <Toolbar>
                {/* Left Side */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalPizzaIcon style={{ color: '#FF8100', marginRight: '10px' }} /> {/* Pizza Icon */}
                    <Typography variant="h6" style={{ flexGrow: 1, color: '#AF5901' }}>
                        Pizza
                    </Typography>
                </Box>

                {/* Center Items */}
                <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
                    {/* Render common links for all users */}
                    <Link to="/" style={linkStyle('/')}>
                        <Typography variant="h6">Home</Typography>
                    </Link>
                    <Link to="/about" style={linkStyle('/about')}>
                        <Typography variant="h6">Who We Are</Typography>
                    </Link>
                    
                    {/* Render authenticated customer-specific links */}
                    {role === 'customer' && token && (
                        <>
                            <Link to="/order-history" style={linkStyle('/order-history')}>
                                <Typography variant="h6">Order History</Typography>
                            </Link>
                            {/* <Link to="/orders" style={linkStyle('/orders')}>
                                <Typography variant="h6">Orders</Typography>
                            </Link> */}
                        </>
                    )}

                    {/* Render super admin-specific links */}
                    {role === 'super_admin' && token && (
                        <Link to="/dashboard" style={linkStyle('/dashboard')}>
                            <Typography variant="h6">Dashboard</Typography>
                        </Link>
                    )}
                </Box>

                {/* Right Side - Login/Register or Logout Button */}
                {token ? (
                    <Button 
                        variant="contained" 
                        style={{ background: '#FF890F', color: 'white', borderRadius: '5px' }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                ) : (
                    <>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Button 
                                variant="contained" 
                                style={{ background: '#FF890F', color: 'white', borderRadius: '5px', marginRight: '10px' }}>
                                Login
                            </Button>
                        </Link>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <Button 
                                variant="contained" 
                                style={{ background: '#FF890F', color: 'white', borderRadius: '5px' }}>
                                Register
                            </Button>
                        </Link>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
