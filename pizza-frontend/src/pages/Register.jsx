import React from 'react';
import { Box, TextField, Button, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';
import signUp from '../assets/signup.jpg';
import Grid from '@mui/material/Grid2';

const Register = () => {
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
        <Grid item size={{xs:12 ,md:6}} sx={{ display: { xs: 'none', md: 'block' } }}>
          <img 
            src={signUp} 
            alt="Sign Up" 
            style={{ borderRadius: '16px', width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </Grid>
        <Grid item size={{xs:12 ,md:6}}>
          <Box sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF5722' }}>
              Register
            </Typography>
            <Typography variant="body2" sx={{ mt: 2,  }}>
              If you are not a member, easily sign up
            </Typography>
            <form>
              <TextField 
                fullWidth 
                margin="normal" 
                variant="outlined" 
                label="Name" 
              />
              <TextField 
                fullWidth 
                margin="normal" 
                variant="outlined" 
                label="Email" 
                type="email" 
              />
              <TextField 
                fullWidth 
                margin="normal" 
                variant="outlined" 
                label="Password" 
                type="password" 
              />
              
              {/* Terms and Conditions Checkbox */}
              <FormControlLabel 
                control={<Checkbox />}
                label="I accept the Terms and Conditions"
                sx={{ marginTop: 2 }} 
              />
              
              <Button 
                variant="contained" 
                sx={{ backgroundColor: '#FF5722', color: 'white', mt: 3 }} 
                fullWidth
              >
                Sign Up
              </Button>
            </form>

            {/* Login Link */}
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Already have an account? 
              <Link to="/login" style={{ color: '#FF5722', textDecoration: 'none' }}> Login</Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
