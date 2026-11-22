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
import { AmbientGradientShell } from '@/components/layout/AmbientGradientShell';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/services/authApi';
import { PREVIEW_USER } from '@/services/previewData';
import { MeltuneColors, Radius, Spacing, Shadows } from '@/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, token, setUser } = useAuthStore();

  const [fullName, setFullName] = useState(user?.fullName || PREVIEW_USER.fullName);
  const [email] = useState(user?.email || PREVIEW_USER.email);
  const [phone, setPhone] = useState(user?.phone || PREVIEW_USER.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (token) {
        await authApi.updateProfile({ fullName, phone }, token);
      }
      if (user) {
        setUser({
          ...user,
          fullName,
          phone,
        });
      }
      Alert.alert(
        'Profil Diperbarui',
        'Data profil Anda telah berhasil disimpan.',
        [{ text: 'Kembali', onPress: () => router.back() }]
      );
    } catch (err: any) {
      Alert.alert('Gagal Memperbarui Profil', err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AmbientGradientShell
      showBack
      title="Edit Profil"
      subtitle="Perbarui Identitas Pengemudi Terdaftar"
      tag="CUSTOMER PROFILE"
    >
      <View style={styles.content}>
        <View style={[styles.card, Shadows.card]}>
          <FormInput
            label="Nama Lengkap"
            value={fullName}
            onChangeText={setFullName}
            icon={<User size={16} color={MeltuneColors.textMutedLight} />}
          />

          <FormInput
            label="Alamat Email (Akun Supabase)"
            value={email}
            editable={false}
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
            loading={saving}
            size="lg"
            style={{ width: '100%', marginTop: Spacing.md }}
          />
        </View>
      </View>
    </AmbientGradientShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.xl,
  },
  card: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
  },
});
