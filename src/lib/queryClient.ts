import { QueryClient, focusManager } from '@tanstack/react-query';
import { AppState, AppStateStatus, Platform } from 'react-native';

/**
 * Configure TanStack Query global client with 2-minute staleTime and 15-minute garbage collection
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes fresh window
      gcTime: 1000 * 60 * 15,    // 15 minutes cache persistence
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

/**
 * React Native AppState listener to trigger automatic refetches on app foreground resume
 */
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

AppState.addEventListener('change', onAppStateChange);

/**
 * Centralized, strongly-typed query keys for organized domain cache invalidation
 */
export const QueryKeys = {
  profile: ['profile'] as const,
  vehicles: ['vehicles'] as const,
  vehicle: (id: string) => ['vehicles', id] as const,
  services: ['services'] as const,
  service: (id: string) => ['services', id] as const,
  bookings: ['bookings'] as const,
  booking: (id: string) => ['bookings', id] as const,
  availableSlots: (date: string) => ['bookings', 'available-slots', date] as const,
  products: (params?: { category?: string; search?: string }) => ['products', params || {}] as const,
  product: (id: string) => ['products', id] as const,
  orders: ['orders'] as const,
  loyaltyProfile: ['loyalty', 'profile'] as const,
  loyaltyRewards: ['loyalty', 'rewards'] as const,
  notifications: ['notifications'] as const,
};

/**
 * Purge all cached user data on logout to prevent cross-account cache leakage
 */
export function clearQueryCache(): void {
  queryClient.clear();
}
