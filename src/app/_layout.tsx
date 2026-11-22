import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { queryClient } from '@/lib/queryClient';
import { MeltuneColors } from '@/theme';
import { useAuthStore } from '@/stores/authStore';

// Prevent native splash screen from autohiding before resources load
SplashScreen.preventAutoHideAsync().catch(() => {});

function RouteGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isInitializing } = useAuthStore();

  useEffect(() => {
    if (isInitializing) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Unauthenticated users are protected and routed to login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Authenticated users in auth group are redirected to main tabs
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isInitializing, segments]);

  return null;
}

export default function RootLayout() {
  const { initializeAuth, isInitializing } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isInitializing) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isInitializing]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <RouteGuard />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: MeltuneColors.warmIvory },
            animation: 'fade_from_bottom',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="booking/detail" options={{ presentation: 'card' }} />
          <Stack.Screen name="booking/tracking" options={{ presentation: 'card' }} />
          <Stack.Screen name="booking/history" options={{ presentation: 'card' }} />
          <Stack.Screen name="loyalty/index" options={{ presentation: 'card' }} />
          <Stack.Screen name="notifications/index" options={{ presentation: 'card' }} />
          <Stack.Screen name="vehicle/detail" options={{ presentation: 'card' }} />
          <Stack.Screen name="vehicle/add" options={{ presentation: 'modal' }} />
          <Stack.Screen name="vehicle/edit" options={{ presentation: 'modal' }} />
          <Stack.Screen name="profile/edit" options={{ presentation: 'card' }} />
          <Stack.Screen name="support/index" options={{ presentation: 'card' }} />
          <Stack.Screen name="shop/detail" options={{ presentation: 'card' }} />
          <Stack.Screen name="shop/cart" options={{ presentation: 'card' }} />
          <Stack.Screen name="shop/orders" options={{ presentation: 'card' }} />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
