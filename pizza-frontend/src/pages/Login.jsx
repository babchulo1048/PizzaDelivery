import React, { useState } from 'react';
import { Box, TextField, Button, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import signIn from '../assets/signin.jpg';
import Grid from '@mui/material/Grid2';
import { axiosInstance } from '../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate(); // For navigation after login

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axiosInstance.post('/users/login', {
        email,
        password,
      });
    

      // Handle successful login (e.g., save token, redirect)
      const { token,user } = response.data; // Adjust this according to your API response
      console.log("user",user)
      localStorage.setItem('authToken', token);
      localStorage.setItem('targetId', user.id);
      localStorage.setItem('role', user.role.name);

      const role = user.role.name


      if (rememberMe) {
        // Handle remember me logic if needed
      }
      if (role === 'super_admin') {
        navigate('/admin'); // Redirect to dashboard or desired page
      }
      else if (role === 'customer') {
        navigate('/')
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (e.g., show error message to user)
    }
  };

  return (
    <Box 
      sx={{ 
        backgroundColor: '#F0F0F0', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <Grid container maxWidth="md" sx={{ borderRadius: '16px', boxShadow: 3 }}>
        <Grid item size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          <img 
            src={signIn} 
            alt="Login" 
            style={{ borderRadius: '16px', width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }} >
          <Box sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF5722' }}>
              Login
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Welcome back! Please log in to your account
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField 
                fullWidth 
                margin="normal" 
                variant="outlined" 
                label="Email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField 
                fullWidth 
                margin="normal" 
                variant="outlined" 
                label="Password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel 
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                label="Remember me"
                sx={{ marginTop: 2 }} 
              />
              
              <Button 
                type="submit" // Set button type to submit
                variant="contained" 
                sx={{ backgroundColor: '#FF5722', color: 'white', mt: 3 }} 
                fullWidth
              >
                Login
              </Button>
            </form>

            {/* Register Link */}
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Don't have an account? 
              <Link to="/register" style={{ color: '#FF5722', textDecoration: 'none' }}> Register</Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
