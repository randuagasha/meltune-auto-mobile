import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock, CheckCircle2 } from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      Alert.alert('Perhatian', 'Pastikan konfirmasi kata sandi telah cocok.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Berhasil',
        'Kata sandi Anda telah berhasil diperbarui. Silakan masuk kembali.',
        [{ text: 'Masuk Sekarang', onPress: () => router.replace('/(auth)/login') }]
      );
    }, 600);
  };

  return (
    <AmbientGradientBackground preset="deepAuth">
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 24) + Spacing.lg,
            paddingBottom: Math.max(insets.bottom, 24) + Spacing.xl,
          },
        ]}
      >
        <View style={[styles.card, Shadows.darkElevated]}>
          <Text style={styles.cardHeading}>Atur Kata Sandi Baru</Text>
          <Text style={styles.cardDesc}>
            Gunakan kombinasi minimal 8 karakter huruf, angka, dan simbol untuk keamanan akun otomotif Anda.
          </Text>

          <FormInput
            label="Kata Sandi Baru"
            placeholder="Minimal 8 karakter..."
            value={newPassword}
            onChangeText={setNewPassword}
            isPassword
            icon={<Lock size={16} color={MeltuneColors.textMutedLight} />}
          />

          <FormInput
            label="Konfirmasi Kata Sandi Baru"
            placeholder="Ketik ulang kata sandi baru..."
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            icon={<Lock size={16} color={MeltuneColors.textMutedLight} />}
          />

          <PrimaryButton
            title="Simpan Kata Sandi Baru"
            onPress={handleReset}
            loading={loading}
            size="lg"
            style={{ width: '100%', marginTop: Spacing.sm }}
          />
        </View>
      </ScrollView>
    </AmbientGradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
  },
  cardHeading: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title2,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.charcoal,
  },
  cardDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 4,
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
});
