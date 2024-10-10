import axios from 'axios';

export const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

if (import.meta.env.VITE_TEST_SLOW_API) {
  baseApi.interceptors.request.use(config => {
    return new Promise(resolve => setTimeout(() => resolve(config), 1000));
  });
}
