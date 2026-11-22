import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = 'meltune_auth_token';

/**
 * Custom storage adapter for Supabase client
 * Compatible with React Native (Expo SecureStore) and Web (localStorage)
 */
export const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Ignore secure storage errors on locked devices
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Ignore secure storage deletion errors
    }
  },
};

/**
 * Helper to store raw JWT access token for Express API calls
 */
export async function saveAuthToken(token: string): Promise<void> {
  await ExpoSecureStoreAdapter.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Helper to retrieve raw JWT access token for Express API calls
 */
export async function getAuthToken(): Promise<string | null> {
  return await ExpoSecureStoreAdapter.getItem(AUTH_TOKEN_KEY);
}

/**
 * Helper to remove raw JWT access token
 */
export async function removeAuthToken(): Promise<void> {
  await ExpoSecureStoreAdapter.removeItem(AUTH_TOKEN_KEY);
}
