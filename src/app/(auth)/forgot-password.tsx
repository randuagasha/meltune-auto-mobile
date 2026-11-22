import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    if (!email) return;
    setIsSent(true);
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
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color={MeltuneColors.warmIvory} />
          <Text style={styles.backText}>Kembali</Text>
        </Pressable>

        <View style={[styles.card, Shadows.darkElevated]}>
          {isSent ? (
            <View style={styles.successBox}>
              <CheckCircle2 size={48} color={MeltuneColors.statusSuccess} />
              <Text style={styles.successTitle}>Tautan Reset Terkirim!</Text>
              <Text style={styles.successDesc}>
                Kami telah mengirimkan instruksi pemulihan kata sandi ke{' '}
                <Text style={{ fontWeight: 'bold' }}>{email}</Text>. Silakan periksa kotak masuk email Anda.
              </Text>
              <PrimaryButton
                title="Lanjutkan ke Reset Password"
                onPress={() => router.push('/(auth)/reset-password')}
                style={{ width: '100%', marginTop: Spacing.lg }}
              />
            </View>
          ) : (
            <>
              <Text style={styles.cardHeading}>Pemulihan Kata Sandi</Text>
              <Text style={styles.cardDesc}>
                Masukkan alamat email yang terdaftar pada MELTUNE AUTO untuk menerima tautan konfirmasi kata sandi baru.
              </Text>

              <FormInput
                label="Alamat Email Terdaftar"
                placeholder="nama@domain.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Mail size={16} color={MeltuneColors.textMutedLight} />}
              />

              <PrimaryButton
                title="Kirim Tautan Pemulihan"
                onPress={handleSend}
                size="lg"
                style={{ width: '100%', marginTop: Spacing.sm }}
              />
            </>
          )}
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  backText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.warmIvory,
    fontWeight: Typography.weight.semibold,
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
  successBox: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  successTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title3,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.charcoal,
    marginTop: Spacing.md,
  },
  successDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
});
