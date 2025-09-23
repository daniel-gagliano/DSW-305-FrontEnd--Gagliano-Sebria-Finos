// cliente axios centralizado para llamar al backend
// uso Vite env var VITE_BACKEND_URL si esta definida, si no usa localhost:3000
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// exporto el cliente
export default axiosClient;
