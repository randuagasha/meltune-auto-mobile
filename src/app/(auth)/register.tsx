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
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react-native';
import { AmbientGradientShell } from '@/components/layout/AmbientGradientShell';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuthStore } from '@/stores/authStore';
import { MeltuneColors, Radius, Spacing, Typography } from '@/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error: authStoreError, clearError } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);

  const displayError = localError || authStoreError;

  const validate = (): boolean => {
    setLocalError(null);
    clearError();

    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setLocalError('Nama lengkap minimal 2 karakter.');
      return false;
    }

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

    const trimmedPhone = phone.trim();
    if (!trimmedPhone || trimmedPhone.length < 9) {
      setLocalError('Nomor telepon / WhatsApp minimal 9 digit.');
      return false;
    }

    if (!password || password.length < 8) {
      setLocalError('Kata sandi harus minimal 8 karakter.');
      return false;
    }

    if (password !== confirmPassword) {
      setLocalError('Konfirmasi kata sandi tidak cocok.');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const result = await register({
      fullName,
      email,
      phone,
      password,
    });

    if (result.success) {
      if (result.requiresEmailVerification) {
        setVerificationNotice(
          result.message ||
            'Pendaftaran berhasil! Tautan verifikasi telah dikirimkan ke email Anda. Silakan verifikasi sebelum masuk.'
        );
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  return (
    <AmbientGradientShell
      showBack
      onBackPress={() => {
        clearError();
        router.replace('/(auth)/login');
      }}
      tag="REGISTRASI PELANGGAN"
      title="Buat Akun Baru"
      subtitle="Daftarkan profil untuk kemudahan perawatan kendaraan"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.formContainer}>
          {verificationNotice ? (
            /* Email Verification Success State */
            <View style={styles.verificationCard}>
              <View style={styles.verificationIconBox}>
                <CheckCircle2 size={44} color={MeltuneColors.statusSuccess} />
              </View>
              <Text style={styles.verificationTitle}>Pendaftaran Berhasil</Text>
              <Text style={styles.verificationDesc}>{verificationNotice}</Text>
              <PrimaryButton
                title="Lanjutkan ke Halaman Masuk"
                onPress={() => router.replace('/(auth)/login')}
                size="lg"
                style={styles.verificationButton}
                iconRight={<ArrowRight size={18} color={MeltuneColors.white} />}
              />
            </View>
          ) : (
            /* Registration Form */
            <>
              <View style={styles.introBlock}>
                <Text style={styles.introHeading}>Pendaftaran Akun Pelanggan</Text>
                <Text style={styles.introDesc}>
                  Daftarkan kendaraan dan data diri Anda untuk riwayat servis terpadu, booking online, dan program loyalitas.
                </Text>
              </View>

              {displayError && (
                <View style={styles.errorBanner}>
                  <AlertCircle size={16} color={MeltuneColors.statusDanger} style={styles.errorIcon} />
                  <Text style={styles.errorText}>{displayError}</Text>
                </View>
              )}

              <FormInput
                label="Nama Lengkap Pemilik"
                placeholder="Contoh: Randu Pradana"
                value={fullName}
                onChangeText={text => {
                  setFullName(text);
                  if (displayError) {
                    setLocalError(null);
                    clearError();
                  }
                }}
                autoCapitalize="words"
                technicalCode="USER.FULL_NAME"
                icon={<User size={16} color={MeltuneColors.textMutedLight} />}
              />

              <FormInput
                label="Alamat Email"
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
                technicalCode="USER.EMAIL"
                icon={<Mail size={16} color={MeltuneColors.textMutedLight} />}
              />

              <FormInput
                label="Nomor WhatsApp / HP"
                placeholder="081234567890"
                value={phone}
                onChangeText={text => {
                  setPhone(text);
                  if (displayError) {
                    setLocalError(null);
                    clearError();
                  }
                }}
                keyboardType="phone-pad"
                technicalCode="USER.PHONE"
                icon={<Phone size={16} color={MeltuneColors.textMutedLight} />}
              />

              <FormInput
                label="Kata Sandi (Min. 8 Karakter)"
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
                technicalCode="AUTH.PASSWORD"
                icon={<Lock size={16} color={MeltuneColors.textMutedLight} />}
              />

              <FormInput
                label="Konfirmasi Kata Sandi"
                placeholder="Ulangi kata sandi..."
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  if (displayError) {
                    setLocalError(null);
                    clearError();
                  }
                }}
                isPassword
                technicalCode="AUTH.CONFIRM"
                icon={<Lock size={16} color={MeltuneColors.textMutedLight} />}
              />

              <PrimaryButton
                title="Daftar Akun Workshop"
                onPress={handleRegister}
                loading={isLoading}
                size="lg"
                style={styles.submitButton}
                iconRight={<ArrowRight size={18} color={MeltuneColors.white} />}
              />

              <View style={styles.loginPromptRow}>
                <Text style={styles.loginPromptText}>Sudah memiliki akun terdaftar?</Text>
                <Pressable
                  onPress={() => {
                    clearError();
                    setLocalError(null);
                    router.replace('/(auth)/login');
                  }}
                  hitSlop={8}
                >
                  <Text style={styles.loginPromptLink}>Masuk di sini</Text>
                </Pressable>
              </View>

              <View style={styles.securityBox}>
                <ShieldCheck size={15} color={MeltuneColors.burntOrange} />
                <Text style={styles.securityText}>
                  Data tersimpan secara aman & dilindungi kebijakan privasi Meltune Auto.
                </Text>
              </View>
            </>
          )}
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
  submitButton: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  loginPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xxl,
  },
  loginPromptText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
  },
  loginPromptLink: {
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
  verificationCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  verificationIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  verificationTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title2,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    marginBottom: Spacing.xs,
  },
  verificationDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  verificationButton: {
    width: '100%',
  },
});
