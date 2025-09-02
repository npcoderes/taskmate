import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND;
console.log("API_BASE_URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  updateProfilePic: (formData) => 
    api.put('/users/profile-pic', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updatePassword: (passwordData) => api.put('/users/password', passwordData),
};

export const tasksAPI = {
  getAllTasks: () => api.get('/tasks'),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getAnalytics: () => api.get('/tasks/analytics'),
};

export default api;
