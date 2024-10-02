import axios from 'axios';


const API_BASE_URL = "http://127.0.0.1:3000";


// Get targetId from localStorage
// const targetId = localStorage.getItem('targetId');

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set Authorization token dynamically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');  // Retrieve token from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export {  axiosInstance};
