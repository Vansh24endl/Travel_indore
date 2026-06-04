import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request Interceptor: Attach token if it exists in localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response Interceptor: Handle auth failures globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Unauthenticated/Token expired
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api
