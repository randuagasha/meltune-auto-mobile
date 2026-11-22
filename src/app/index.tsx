import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { MeltuneColors } from '@/theme';

export default function RootIndex() {
  const { isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={MeltuneColors.burntOrange} size="large" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#562114',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
