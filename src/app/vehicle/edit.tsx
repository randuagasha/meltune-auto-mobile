import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { PREVIEW_VEHICLES } from '@/services/previewData';
import { useVehiclesQuery, useUpdateVehicleMutation } from '@/hooks/useWorkshopData';
import { MeltuneColors, Radius, Spacing, Shadows } from '@/theme';

export default function EditVehicleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { data: vehicles = [] } = useVehiclesQuery();
  const updateVehicleMutation = useUpdateVehicleMutation();

  const vehicleId = String(params.id || '');
  const vehicle =
    vehicles.find(v => v.id === vehicleId) ||
    PREVIEW_VEHICLES.find(v => v.id === vehicleId) ||
    PREVIEW_VEHICLES[0];

  const [model, setModel] = useState(vehicle.model);
  const [licensePlate, setLicensePlate] = useState(vehicle.licensePlate);
  const [mileage, setMileage] = useState(String(vehicle.mileage || ''));
  const [notes, setNotes] = useState(vehicle.notes || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    setSubmitting(true);
    try {
      await updateVehicleMutation.mutateAsync({
        id: vehicle.id,
        data: {
          model: model.trim(),
          licensePlate: licensePlate.toUpperCase().trim(),
          mileage: mileage ? Number(mileage) : undefined,
          notes: notes.trim() || undefined,
        },
      });

      Alert.alert(
        'Perubahan Disimpan',
        'Informasi kendaraan telah berhasil diperbarui.',
        [{ text: 'Kembali', onPress: () => router.back() }]
      );
    } catch (err: any) {
      Alert.alert('Gagal Memperbarui Kendaraan', err?.message || 'Terjadi kesalahan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GradientBackground variant="subtleIvory">
      <AppHeader
        title="Edit Kendaraan"
        subtitle={`${vehicle.brand} ${vehicle.model}`}
        tag="UPDATE FLEET METRICS"
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
            label="Model & Varian"
            value={model}
            onChangeText={setModel}
          />

          <FormInput
            label="Plat Nomor Polisi"
            value={licensePlate}
            onChangeText={setLicensePlate}
            autoCapitalize="characters"
          />

          <FormInput
            label="Odometer Terakhir (KM)"
            value={mileage}
            onChangeText={setMileage}
            keyboardType="numeric"
          />

          <FormInput
            label="Catatan Khusus Kendaraan"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={{ minHeight: 70 }}
          />

          <PrimaryButton
            title="Simpan Perubahan Data"
            onPress={handleSave}
            loading={submitting}
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
