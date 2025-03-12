import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'http://127.0.0.1:8000/api/',

});

export default axiosInstance;
//http://192.168.0.89:8081/