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
import { Car, Hash, Calendar, Gauge } from 'lucide-react-native';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function AddVehicleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2023');
  const [licensePlate, setLicensePlate] = useState('');
  const [mileage, setMileage] = useState('');
  const [transmission, setTransmission] = useState<'automatic' | 'manual'>('automatic');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel'>('petrol');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!brand || !model || !licensePlate) {
      Alert.alert('Perhatian', 'Merek, model, dan plat nomor polisi wajib diisi.');
      return;
    }

    Alert.alert(
      'Kendaraan Terdaftar',
      `${brand} ${model} (${licensePlate}) berhasil ditambahkan ke garasi mobil Anda.`,
      [{ text: 'Selesai', onPress: () => router.back() }]
    );
  };

  return (
    <GradientBackground variant="subtleIvory">
      <AppHeader
        title="Daftarkan Mobil"
        subtitle="Identitas Kendaraan untuk Database Workshop"
        tag="NEW FLEET REGISTRATION"
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
            label="Merek Kendaraan"
            placeholder="Contoh: BMW, Honda, Toyota, Porsche"
            value={brand}
            onChangeText={setBrand}
            icon={<Car size={16} color={MeltuneColors.textMutedLight} />}
          />

          <FormInput
            label="Model & Varian Spesifik"
            placeholder="Contoh: 330i M Sport (G20), Civic Type R (FL5)"
            value={model}
            onChangeText={setModel}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormInput
                label="Tahun Pembuatan"
                placeholder="2023"
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
                icon={<Calendar size={16} color={MeltuneColors.textMutedLight} />}
              />
            </View>
            <View style={{ flex: 1.2 }}>
              <FormInput
                label="Plat Nomor Polisi"
                placeholder="B 1234 XYZ"
                value={licensePlate}
                onChangeText={setLicensePlate}
                autoCapitalize="characters"
                icon={<Hash size={16} color={MeltuneColors.textMutedLight} />}
              />
            </View>
          </View>

          <FormInput
            label="Odometer Saat Ini (KM)"
            placeholder="Contoh: 28450"
            value={mileage}
            onChangeText={setMileage}
            keyboardType="numeric"
            icon={<Gauge size={16} color={MeltuneColors.textMutedLight} />}
          />

          <FormInput
            label="Catatan Khusus Kendaraan (Opsional)"
            placeholder="Spesifikasi modifikasi, oli mesin preferensi, riwayat khusus..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={{ minHeight: 70 }}
          />

          <PrimaryButton
            title="Simpan ke Garasi Saya"
            onPress={handleSubmit}
            size="lg"
            style={styles.submitBtn}
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
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  submitBtn: {
    width: '100%',
    marginTop: Spacing.md,
  },
});
