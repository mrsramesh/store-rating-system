// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Adjust based on your backend URL

const authService = {
  login: (email, password) => {
    return axios.post(`${API_URL}/signin`, { email, password });
  },
  signup: (userData) => {
    return axios.post(`${API_URL}/signup`, userData);
  },
  resetPassword: (email, new_password, confirm_password, reset_token) => {
    return axios.post(`${API_URL}/reset-password`, { email, new_password, confirm_password, reset_token });
  }
};

export default authService;