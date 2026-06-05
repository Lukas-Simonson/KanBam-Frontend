import axios from 'axios';
import router from '@/router';

const api = axios.create({
    baseURL: '/api/v1',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kanbam:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // clear auth and redirect
      localStorage.removeItem('kanbam:token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default api