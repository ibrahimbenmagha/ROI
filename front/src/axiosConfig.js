import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'http://127.0.0.1:8000/api/',

});

export default axiosInstance;


export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};


