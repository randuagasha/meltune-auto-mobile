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
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Mohon lengkapi email dan kata sandi Anda.');
      return;
    }

    setLoading(true);
    // UI Phase: simulates submission and routes to main app
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
          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>MELTUNE AUTO // EST. 2024</Text>
            </View>
            <Text style={styles.brandTitle}>MELTUNE AUTO</Text>
            <Text style={styles.brandSubtitle}>
              Platform Manajemen Servis & Pemeliharaan Otomotif Presisi
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, Shadows.darkElevated]}>
            <Text style={styles.cardHeading}>Masuk Akun Pengemudi</Text>
            <Text style={styles.cardDesc}>
              Akses garasi mobil pribadi, live tracking workbay, dan penukaran reward loyalitas.
            </Text>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <FormInput
              label="Alamat Email Terdaftar"
              placeholder="nama@domain.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              technicalCode="AUTH.EMAIL"
              icon={<Mail size={16} color={MeltuneColors.textMutedLight} />}
            />

            <FormInput
              label="Kata Sandi Akun"
              placeholder="Masukkan kata sandi..."
              value={password}
              onChangeText={setPassword}
              isPassword
              technicalCode="AUTH.PASSWORD"
              icon={<Lock size={16} color={MeltuneColors.textMutedLight} />}
            />

            <Pressable
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotPasswordButton}
            >
              <Text style={styles.forgotPasswordText}>Lupa kata sandi?</Text>
            </Pressable>

            <PrimaryButton
              title="Masuk ke Workshop"
              onPress={handleLogin}
              loading={loading}
              size="lg"
              style={styles.loginButton}
              iconRight={<ArrowRight size={18} color={MeltuneColors.white} />}
            />

            {/* Quick Demo Bypass for UI Preview */}
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              style={styles.demoBypassButton}
            >
              <Text style={styles.demoBypassText}>
                Preview Mode → Lanjutkan Langsung ke Beranda
              </Text>
            </Pressable>
          </View>

          {/* Register Prompt */}
          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>Belum memiliki akun pelanggan?</Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Daftar Sekarang</Text>
            </Pressable>
          </View>

          {/* Standards & Security Notice */}
          <View style={styles.securityBox}>
            <ShieldCheck size={16} color={MeltuneColors.champagne} />
            <Text style={styles.securityText}>
              Koneksi terenkripsi SSL 256-bit dan autentikasi aman Supabase Auth.
            </Text>
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
    fontSize: Typography.size.hero,
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
    maxWidth: 280,
    lineHeight: 18,
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
    letterSpacing: Typography.letterSpacing.tight,
  },
  cardDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 4,
    marginBottom: Spacing.lg,
    lineHeight: 18,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
    marginTop: -Spacing.xs,
  },
  forgotPasswordText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.burntOrange,
  },
  loginButton: {
    width: '100%',
  },
  demoBypassButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  demoBypassText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    textDecorationLine: 'underline',
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
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.xl,
  },
  securityText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedDark,
  },
});
