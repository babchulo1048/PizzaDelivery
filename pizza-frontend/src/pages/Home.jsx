import React from 'react';
import { Container, Button } from '@mui/material';
import HeroSection from '../components/HeroSection';
import SlidingCards from '../components/SlidingCards';
import TopRestaurants from '../components/TopRestaurants';
import PopularPizzas from '../components/PopularPizzas';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import Order from './Order';


const App = () => {
    const navigate = useNavigate(); // Create a navigate function for navigation
    const authToken = localStorage.getItem('authToken'); // Get the auth token from localStorage

    return (
        <Container>
            <HeroSection />
            <SlidingCards />
            <TopRestaurants />
            {/* <PopularPizzas /> */}
            <Order />
            
        </Container>
    );
};

export default App;
