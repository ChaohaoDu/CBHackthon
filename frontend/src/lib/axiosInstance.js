import axios from 'axios';

// Create an instance of Axios with the base URL configured
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api', // Fallback to localhost if not defined
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
