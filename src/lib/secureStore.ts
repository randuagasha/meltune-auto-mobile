import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = 'meltune_auth_token';

/**
 * Storage adapter for Supabase client
 * Uses AsyncStorage as primary persistence so large Supabase session payloads
 * (which exceed Expo SecureStore's 2048-byte limit) are never truncated or lost.
 */
export const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      }
      // 1. Try AsyncStorage first
      const val = await AsyncStorage.getItem(key);
      if (val !== null) return val;

      // 2. Fallback to SecureStore
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
      // Always persist to AsyncStorage (no 2048 byte limit)
      await AsyncStorage.setItem(key, value);

      // Also mirror to SecureStore if payload fits within 2048 bytes
      if (value.length < 2000) {
        try {
          await SecureStore.setItemAsync(key, value);
        } catch {
          // Ignore SecureStore size errors
        }
      }
    } catch {
      // Ignore storage errors on locked devices
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
      await AsyncStorage.removeItem(key);
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        // Ignore deletion errors
      }
    } catch {
      // Ignore storage errors
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
