// src/services/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.15:5000/api', // Emulador Android (ou use IP local ex: 'http://192.168.x.x:5000/api')
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
