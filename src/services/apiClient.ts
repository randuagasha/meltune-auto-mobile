import axios, { InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getAuthToken, saveAuthToken } from '@/lib/secureStore';
import { supabase } from '@/lib/supabase';

export function getApiBaseUrl(): string {
  // 1. When running in a web browser, localhost is reachable
  if (Platform.OS === 'web') {
    return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  }

  // 2. Extract host IP dynamically from Expo bundler host (works seamlessly with Expo Go & physical devices)
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:4000/api/v1`;
    }
  }

  // 3. Android emulator loopback alias
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api/v1';
  }

  // 4. If an explicit non-localhost env URL is defined, use it
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  // 5. Default fallback to local development machine Wi-Fi IP
  return 'http://192.168.20.31:4000/api/v1';
}

export const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Retrieve fresh, active JWT access token from Supabase session.
 * Proactively refreshes the token if expired or close to expiry.
 */
export async function getFreshAccessToken(): Promise<string | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (!error && session?.access_token) {
      const nowSec = Math.floor(Date.now() / 1000);
      // Proactively refresh if token expires in less than 90 seconds
      if (session.expires_at && session.expires_at - nowSec < 90) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError && refreshData?.session?.access_token) {
          const freshToken = refreshData.session.access_token;
          await saveAuthToken(freshToken);
          return freshToken;
        }
      }
      await saveAuthToken(session.access_token);
      return session.access_token;
    }
  } catch (err) {
    console.warn('[apiClient] Error inspecting Supabase session:', err);
  }

  // Fallback to secure storage
  try {
    return await getAuthToken();
  } catch {
    return null;
  }
}

// Intercept requests to attach fresh Authorization header and dynamic baseURL
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    config.baseURL = getApiBaseUrl();
    const token = await getFreshAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  } catch {
    // Continue without token if retrieval fails
  }
  return config;
});

// Intercept 401 responses: automatically refresh session and retry once
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _isRetry?: boolean }) | undefined;
    const isAuthError =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry;

    if (isAuthError) {
      originalRequest._isRetry = true;
      try {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError && refreshData?.session?.access_token) {
          const freshToken = refreshData.session.access_token;
          await saveAuthToken(freshToken);
          originalRequest.headers.set('Authorization', `Bearer ${freshToken}`);
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        console.warn('[apiClient] Silent token refresh retry failed:', refreshErr);
      }
    }
    return Promise.reject(error);
  }
);
