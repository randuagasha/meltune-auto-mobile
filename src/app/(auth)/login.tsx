import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react-native';
import { AmbientGradientShell } from '@/components/layout/AmbientGradientShell';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuthStore } from '@/stores/authStore';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error: authStoreError, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError || authStoreError;

  const validate = (): boolean => {
    setLocalError(null);
    clearError();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError('Alamat email wajib diisi.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setLocalError('Format alamat email tidak valid.');
      return false;
    }

    if (!password) {
      setLocalError('Kata sandi wajib diisi.');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    const result = await login(email, password);
    if (result.success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <AmbientGradientShell
      tag="PORTAL AUTENTIKASI"
      title="Masuk Akun"
      subtitle="Akses garasi mobil & layanan servis Meltune Auto"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.formContainer}>
          {/* Header Card / Intro */}
          <View style={styles.introBlock}>
            <Text style={styles.introHeading}>Portal Pelanggan</Text>
            <Text style={styles.introDesc}>
              Masuk untuk memantau pengerjaan workbay secara real-time, jadwal servis berkala, dan penukaran reward loyalitas.
            </Text>
          </View>

          {/* Feedback Error Banner */}
          {displayError && (
            <View style={styles.errorBanner}>
              <AlertCircle size={16} color={MeltuneColors.statusDanger} style={styles.errorIcon} />
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          )}

          {/* Input: Email */}
          <FormInput
            label="Alamat Email Terdaftar"
            placeholder="nama@domain.com"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (displayError) {
                setLocalError(null);
                clearError();
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            technicalCode="AUTH.EMAIL"
            icon={<Mail size={16} color={MeltuneColors.textMutedLight} />}
          />

          {/* Input: Password */}
          <FormInput
            label="Kata Sandi Akun"
            placeholder="Masukkan kata sandi..."
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (displayError) {
                setLocalError(null);
                clearError();
              }
            }}
            isPassword
            technicalCode="AUTH.SECRET"
            icon={<Lock size={16} color={MeltuneColors.textMutedLight} />}
          />

          {/* Forgot Password Action */}
          <Pressable
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotPasswordButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Lupa kata sandi"
          >
            <Text style={styles.forgotPasswordText}>Lupa kata sandi?</Text>
          </Pressable>

          {/* Submit Action */}
          <PrimaryButton
            title="Masuk ke Workshop"
            onPress={handleLogin}
            loading={isLoading}
            size="lg"
            style={styles.submitButton}
            iconRight={<ArrowRight size={18} color={MeltuneColors.white} />}
          />

          {/* Registration Navigation */}
          <View style={styles.registerPromptRow}>
            <Text style={styles.registerPromptText}>Belum memiliki akun pelanggan?</Text>
            <Pressable
              onPress={() => {
                clearError();
                setLocalError(null);
                router.push('/(auth)/register');
              }}
              hitSlop={8}
            >
              <Text style={styles.registerPromptLink}>Daftar Sekarang</Text>
            </Pressable>
          </View>

          {/* Technical Security Assurance */}
          <View style={styles.securityBox}>
            <ShieldCheck size={15} color={MeltuneColors.burntOrange} />
            <Text style={styles.securityText}>
              Enkripsi SSL 256-bit terhubung langsung ke Meltune API & Supabase Auth.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AmbientGradientShell>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: Spacing.xl, // 24px consistent horizontal padding
  },
  introBlock: {
    marginBottom: Spacing.xl,
  },
  introHeading: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title2,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.charcoal,
    letterSpacing: Typography.letterSpacing.tight,
  },
  introDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  errorIcon: {
    marginRight: Spacing.sm,
    flexShrink: 0,
  },
  errorText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.statusDanger,
    lineHeight: 18,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
    marginTop: -Spacing.xs,
  },
  forgotPasswordText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.burntOrange,
  },
  submitButton: {
    width: '100%',
  },
  registerPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xxl,
  },
  registerPromptText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
  },
  registerPromptLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.xxl,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: MeltuneColors.borderLight,
  },
  securityText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    lineHeight: 16,
  },
});
