import axios from 'axios';

// Tạo instance axios với base URL
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để xử lý token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API calls
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
};

export const userAPI = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
};

export const productAPI = {
    getProducts: (params) => api.get('/products', { params }),
    getProductById: (id) => api.get(`/products/${id}`),
    createProduct: (data) => api.post('/products', data),
    updateProduct: (id, data) => api.put(`/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default api; 