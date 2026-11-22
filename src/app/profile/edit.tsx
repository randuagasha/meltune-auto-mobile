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
import { User, Mail, Phone } from 'lucide-react-native';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { PREVIEW_USER } from '@/services/previewData';
import { MeltuneColors, Radius, Spacing, Shadows } from '@/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState(PREVIEW_USER.fullName);
  const [email, setEmail] = useState(PREVIEW_USER.email);
  const [phone, setPhone] = useState(PREVIEW_USER.phone || '');

  const handleSave = () => {
    Alert.alert(
      'Profil Diperbarui',
      'Data profil Anda telah berhasil disimpan.',
      [{ text: 'Kembali', onPress: () => router.back() }]
    );
  };

  return (
    <GradientBackground variant="subtleIvory">
      <AppHeader
        title="Edit Profil"
        subtitle="Perbarui Identitas Pengemudi Terdaftar"
        tag="CUSTOMER PROFILE"
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxl },
        ]}
      >
        <View style={[styles.card, Shadows.card]}>
          <FormInput
            label="Nama Lengkap"
            value={fullName}
            onChangeText={setFullName}
            icon={<User size={16} color={MeltuneColors.textMutedLight} />}
          />

          <FormInput
            label="Alamat Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={16} color={MeltuneColors.textMutedLight} />}
          />

          <FormInput
            label="Nomor WhatsApp / Telepon"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon={<Phone size={16} color={MeltuneColors.textMutedLight} />}
          />

          <PrimaryButton
            title="Simpan Perubahan"
            onPress={handleSave}
            size="lg"
            style={{ width: '100%', marginTop: Spacing.md }}
          />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
  },
});
