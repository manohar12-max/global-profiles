import axios from 'axios';

const api = axios.create({
  baseURL: 'https://global-profiles.onrender.com/api',
});

export default api;
