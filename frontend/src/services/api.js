import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://180.235.121.253:8151',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Long timeout instance for AI analysis uploads
const apiLong = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://180.235.121.253:8151',
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for auth tokens
const addAuthInterceptor = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('reva_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
    instance.interceptors.response.use(
        (response) => response.data,
        (error) => {
            let message = 'An unexpected error occurred';
            if (error.response) {
                message = error.response.data?.message || error.response.data?.error || message;
            } else if (error.request) {
                message = 'No response from medical server. Verify backend status.';
            } else {
                message = error.message;
            }
            console.error('API Error:', message);
            return Promise.reject(message);
        }
    );
};

addAuthInterceptor(api);
addAuthInterceptor(apiLong);

export const authService = {
    login: (credentials) => api.post('/login', credentials),
    signup: (userData) => api.post('/signup', userData),
    changePassword: (data) => api.post('/change-password', data),
    sendOtp: (email) => api.post('/send-otp', { email }),
    verifyOtp: (email, otp) => api.post('/verify-otp', { email, otp }),
    resetPassword: (email, password) => api.post('/reset-password', { email, password }),
};

export const reportService = {
    uploadReport: (formData) => apiLong.post('/upload-report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    uploadFollowup: (formData) => apiLong.post('/upload-followup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getLatestAnalysis: (userId) => api.get(`/latest-analysis/${userId}`),
    getPatientHistory: (userId) => api.get(`/patient-history/${userId}`),
    getReportDetails: (reportId) => api.get(`/report-details/${reportId}`),
    getReportPdf: (reportId) => api.get(`/report-pdf/${reportId}`, { responseType: 'blob' }),
};

export default api;

