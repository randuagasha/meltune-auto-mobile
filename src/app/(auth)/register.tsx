import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = () => {
    setError(null);
    if (!fullName || !email || !password) {
      setError('Nama lengkap, email, dan kata sandi wajib diisi.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 600);
  };

  return (
    <AmbientGradientBackground preset="deepAuth">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top, 24) + Spacing.lg,
              paddingBottom: Math.max(insets.bottom, 24) + Spacing.xl,
            },
          ]}
        >
          <View style={styles.brandContainer}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>REGISTRASI PELANGGAN BARU</Text>
            </View>
            <Text style={styles.brandTitle}>Buat Akun Meltune</Text>
            <Text style={styles.brandSubtitle}>
              Daftarkan diri Anda untuk kemudahan booking servis dan pemantauan garasi mobil.
            </Text>
          </View>

          <View style={[styles.card, Shadows.darkElevated]}>
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <FormInput
              label="Nama Lengkap Pemilik"
              placeholder="Contoh: Randu Pradana"
              value={fullName}
              onChangeText={setFullName}
              icon={<User size={16} color={MeltuneColors.textMutedLight} />}
            />

            <FormInput
              label="Alamat Email"
              placeholder="nama@domain.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={16} color={MeltuneColors.textMutedLight} />}
            />

            <FormInput
              label="Nomor WhatsApp / Telepon"
              placeholder="+62 812-xxxx-xxxx"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon={<Phone size={16} color={MeltuneColors.textMutedLight} />}
            />

            <FormInput
              label="Kata Sandi"
              placeholder="Minimal 8 karakter..."
              value={password}
              onChangeText={setPassword}
              isPassword
              icon={<Lock size={16} color={MeltuneColors.textMutedLight} />}
            />

            <FormInput
              label="Ulangi Kata Sandi"
              placeholder="Konfirmasi kata sandi..."
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              icon={<Lock size={16} color={MeltuneColors.textMutedLight} />}
            />

            <PrimaryButton
              title="Daftar Akun Workshop"
              onPress={handleRegister}
              loading={loading}
              size="lg"
              style={styles.submitButton}
              iconRight={<ArrowRight size={18} color={MeltuneColors.white} />}
            />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>Sudah memiliki akun terdaftar?</Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Masuk di sini</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AmbientGradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  brandBadge: {
    backgroundColor: 'rgba(217, 107, 58, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(217, 107, 58, 0.4)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    marginBottom: Spacing.xs,
  },
  brandBadgeText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
    letterSpacing: 1.5,
  },
  brandTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title1,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.white,
    letterSpacing: Typography.letterSpacing.editorialHeading,
  },
  brandSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryDark,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 290,
    lineHeight: 18,
  },
  card: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.statusDanger,
  },
  submitButton: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xl,
  },
  footerPrompt: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryDark,
  },
  footerLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
});
