import axios from 'axios';

// Gunakan alamat localhost port 3000 untuk backend API
const API_BASE_URL = `http://${window.location.hostname}:3000/api`;

// Inisialisasi Axios client dengan kredensial aktif untuk bertukar Cookie
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // WAJIB untuk mengirim/menerima Cookie HTTP-Only
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 1. API Autentikasi Pengguna
 */
export const authAPI = {
  register: async (username, email, password) => {
    const response = await apiClient.post('/auth/register', { username, email, password });
    return response.data;
  },
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

/**
 * 2. API Riwayat Belajar & Sesi
 */
export const historyAPI = {
  getSessions: async () => {
    const response = await apiClient.get('/history');
    return response.data;
  },
  createSession: async (title = 'Sesi Belajar Baru', initialCode = '') => {
    const response = await apiClient.post('/history', { title, initialCode });
    return response.data;
  },
  getSession: async (sessionId) => {
    const response = await apiClient.get(`/history/${sessionId}`);
    return response.data;
  },
  saveCode: async (sessionId, lastSavedCode) => {
    const response = await apiClient.put(`/history/${sessionId}/code`, { lastSavedCode });
    return response.data;
  },
  deleteSession: async (sessionId) => {
    const response = await apiClient.delete(`/history/${sessionId}`);
    return response.data;
  },
};

/**
 * 3. API Interaksi Socratic Mentor
 */
export const sendMentorMessage = async (message, currentCode, errorMessage, history, sessionId) => {
  const response = await apiClient.post('/mentor', {
    message,
    currentCode,
    errorMessage,
    history,
    sessionId, // Hubungkan pesan chat ke sesi database tertentu
  });
  return response.data;
};
