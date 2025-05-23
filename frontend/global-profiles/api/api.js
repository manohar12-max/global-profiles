import axios from 'axios';
//"https://blog-6bpi.onrender.com/api"
//http://localhost:5000/api
const api = axios.create({
  baseURL: 'https://global-profiles.onrender.com/api',
});

export default api;
