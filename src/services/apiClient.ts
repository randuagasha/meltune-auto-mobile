import axios from 'axios';
import { getAuthToken } from '@/lib/secureStore';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach Authorization header
apiClient.interceptors.request.use(async config => {
  try {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Continue without token if retrieval fails
  }
  return config;
});
