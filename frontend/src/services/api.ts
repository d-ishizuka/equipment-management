import axios from 'axios';

// Axiosインスタンスの作成と基本設定
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;