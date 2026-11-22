import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { MeltuneColors } from '@/theme';

// Prevent native splash screen from autohiding before resources load
SplashScreen.preventAutoHideAsync().catch(() => { });

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after initialization
    SplashScreen.hideAsync().catch(() => { });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: MeltuneColors.warmIvory },
          animation: 'fade_from_bottom',
        }}
      >
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
  );
}
