import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Clock,
  CheckCircle2,
  Plus,
} from 'lucide-react-native';
import { AmbientGradientShell } from '@/components/layout/AmbientGradientShell';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { FormInput } from '@/components/ui/FormInput';
import { DividedList } from '@/components/ui/DividedList';
import { TechnicalListRow } from '@/components/ui/TechnicalListRow';
import { PREVIEW_VEHICLES, PREVIEW_SERVICES } from '@/services/previewData';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

const TIME_SLOTS = [
  '08:30 - 10:00',
  '10:00 - 11:30',
  '13:00 - 14:30',
  '14:30 - 16:00',
  '16:00 - 17:30',
];

export default function BookingScreen() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    PREVIEW_VEHICLES[0]?.id || ''
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    PREVIEW_SERVICES[0]?.id || '',
  ]);
  const [scheduledDate, setScheduledDate] = useState<string>('2026-11-24');
  const [scheduledTime, setScheduledTime] = useState<string>(TIME_SLOTS[1]);
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const selectedVehicle = PREVIEW_VEHICLES.find(v => v.id === selectedVehicleId);
  const selectedServices = PREVIEW_SERVICES.filter(s =>
    selectedServiceIds.includes(s.id)
  );

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.estimatedDurationMinutes,
    0
  );

  const toggleService = (id: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1 && !selectedVehicleId) {
      Alert.alert('Perhatian', 'Silakan pilih kendaraan yang akan diservis.');
      return;
    }
    if (step === 2 && selectedServiceIds.length === 0) {
      Alert.alert('Perhatian', 'Pilih minimal satu paket servis.');
      return;
    }
    if (step < 4) {
      setStep(s => s + 1);
    } else {
      setIsSuccessModal(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    } else {
      router.back();
    }
  };

  return (
    <AmbientGradientShell
      tag="WORKBAY BSD"
      title="Reservasi Servis"
      subtitle="Jadwalkan perawatan berkala kendaraan Anda"
      showBack={step > 1}
      onBackPress={handleBack}
    >
      {/* 1. Step Indicator Bar (At Top of Surface) */}
      <View style={styles.stepperContainer}>
        {[
          { num: 1, label: 'Kendaraan' },
          { num: 2, label: 'Layanan' },
          { num: 3, label: 'Jadwal' },
          { num: 4, label: 'Konfirmasi' },
        ].map(item => {
          const isActive = step === item.num;
          const isDone = step > item.num;

          return (
            <View key={item.num} style={styles.stepItem}>
              <View style={styles.stepTrackRow}>
                <View
                  style={[
                    styles.stepIndicator,
                    isActive && styles.stepIndicatorActive,
                    isDone && styles.stepIndicatorDone,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumText,
                      (isActive || isDone) && styles.stepNumTextActive,
                    ]}
                  >
                    {isDone ? '✓' : item.num}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.stepLabelText,
                  isActive && styles.stepLabelTextActive,
                  isDone && styles.stepLabelTextDone,
                ]}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* STEP 1: VEHICLE SELECTION */}
      {step === 1 && (
        <View style={styles.stepBlock}>
          <View style={styles.stepTitleGroup}>
            <Text style={styles.stepHeading}>Pilih Kendaraan dari Garasi</Text>
            <Text style={styles.stepSub}>
              Data spesifikasi mesin dan riwayat pelumas akan disesuaikan oleh kepala mekanik.
            </Text>
          </View>

          <DividedList
            data={PREVIEW_VEHICLES}
            keyExtractor={item => item.id}
            withOuterBorders
            renderItem={v => {
              const isSelected = selectedVehicleId === v.id;
              return (
                <Pressable
                  key={v.id}
                  onPress={() => setSelectedVehicleId(v.id)}
                  style={[
                    styles.vehicleRow,
                    isSelected && styles.vehicleRowSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>

                  <View style={styles.vehicleInfoCol}>
                    <Text style={styles.vehicleModelName}>{v.model}</Text>
                    <Text style={styles.vehiclePlate}>
                      {v.licensePlate} • Tahun {v.year}
                    </Text>
                    <Text style={styles.vehicleMileage}>
                      Odometer: {v.mileage?.toLocaleString('id-ID')} km
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />

          <Pressable
            onPress={() => router.push('/vehicle/add')}
            style={styles.addVehicleButton}
          >
            <Plus size={16} color={MeltuneColors.burntOrange} />
            <Text style={styles.addVehicleButtonText}>Daftarkan Mobil Baru</Text>
          </Pressable>
        </View>
      )}

      {/* STEP 2: SERVICE SELECTION */}
      {step === 2 && (
        <View style={styles.stepBlock}>
          <View style={styles.stepTitleGroup}>
            <Text style={styles.stepHeading}>Pilih Paket Layanan</Text>
            <Text style={styles.stepSub}>
              Bisa memilih lebih dari satu paket servis berkala, tune up, atau rem.
            </Text>
          </View>

          <DividedList
            data={PREVIEW_SERVICES}
            keyExtractor={item => item.id}
            withOuterBorders
            renderItem={s => {
              const isSelected = selectedServiceIds.includes(s.id);
              return (
                <TechnicalListRow
                  key={s.id}
                  selectable
                  selected={isSelected}
                  title={s.name}
                  subtitle={s.description}
                  value={`Rp ${s.price.toLocaleString('id-ID')}`}
                  valueSub={`${s.estimatedDurationMinutes} menit`}
                  onPress={() => toggleService(s.id)}
                />
              );
            }}
          />

          {/* Quiet Summary Line */}
          <View style={styles.triageSummaryBar}>
            <View>
              <Text style={styles.triageSummaryLabel}>Total Estimasi Biaya</Text>
              <Text style={styles.triageSummaryAmount}>
                Rp {totalPrice.toLocaleString('id-ID')}
              </Text>
            </View>
            <Text style={styles.triageSummaryDuration}>
              {selectedServiceIds.length} Layanan • ±{totalDuration} menit
            </Text>
          </View>
        </View>
      )}

      {/* STEP 3: DATE & TIME SELECTION */}
      {step === 3 && (
        <View style={styles.stepBlock}>
          <View style={styles.stepTitleGroup}>
            <Text style={styles.stepHeading}>Tentukan Waktu Kedatangan</Text>
            <Text style={styles.stepSub}>
              Workbay beroperasi Senin - Sabtu pukul 08:30 - 17:30 WIB.
            </Text>
          </View>

          {/* Date Selector */}
          <Text style={styles.fieldSectionLabel}>Pilih Tanggal</Text>
          <View style={styles.dateRow}>
            {['2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26'].map(d => {
              const isSelected = scheduledDate === d;
              const dateObj = new Date(d);
              const dayName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][
                dateObj.getDay()
              ];
              const dayNum = dateObj.getDate();

              return (
                <Pressable
                  key={d}
                  onPress={() => setScheduledDate(d)}
                  style={[
                    styles.dateTile,
                    isSelected && styles.dateTileSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateDayName,
                      isSelected && styles.dateTextSelected,
                    ]}
                  >
                    {dayName}
                  </Text>
                  <Text
                    style={[
                      styles.dateDayNum,
                      isSelected && styles.dateTextSelected,
                    ]}
                  >
                    {dayNum}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Time Slots */}
          <Text style={[styles.fieldSectionLabel, { marginTop: Spacing.xl }]}>
            Pilih Jam Workbay
          </Text>
          <View style={styles.slotGrid}>
            {TIME_SLOTS.map(slot => {
              const isSelected = scheduledTime === slot;
              return (
                <Pressable
                  key={slot}
                  onPress={() => setScheduledTime(slot)}
                  style={[
                    styles.slotTile,
                    isSelected && styles.slotTileSelected,
                  ]}
                >
                  <Clock
                    size={14}
                    color={
                      isSelected ? MeltuneColors.white : MeltuneColors.textSecondaryLight
                    }
                  />
                  <Text
                    style={[
                      styles.slotTimeText,
                      isSelected && styles.slotTextSelected,
                    ]}
                  >
                    {slot} WIB
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Problem Notes Input */}
          <Text style={[styles.fieldSectionLabel, { marginTop: Spacing.xl }]}>
            Catatan Gejala Kendaraan (Opsional)
          </Text>
          <View style={styles.inputWrapper}>
            <FormInput
              label=""
              placeholder="Contoh: Bunyi decit saat rem pelan, getaran setir pada 80 km/jam..."
              value={problemDescription}
              onChangeText={setProblemDescription}
              multiline
              numberOfLines={3}
              style={{ minHeight: 76 }}
            />
          </View>
        </View>
      )}

      {/* STEP 4: CONFIRMATION SUMMARY */}
      {step === 4 && (
        <View style={styles.stepBlock}>
          <View style={styles.stepTitleGroup}>
            <Text style={styles.stepHeading}>Konfirmasi Rincian Servis</Text>
            <Text style={styles.stepSub}>
              Pastikan rincian data mobil dan jadwal workbay telah sesuai sebelum verifikasi.
            </Text>
          </View>

          <View style={[styles.summaryCard, Shadows.subtle]}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Kendaraan</Text>
              <Text style={styles.summaryValueBold}>
                {selectedVehicle?.model} ({selectedVehicle?.licensePlate})
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Waktu Kedatangan</Text>
              <Text style={styles.summaryValue}>
                {scheduledDate} • {scheduledTime} WIB
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Paket Layanan</Text>
              <View style={styles.servicesCol}>
                {selectedServices.map(s => (
                  <Text key={s.id} style={styles.serviceLineItem}>
                    • {s.name} (Rp {s.price.toLocaleString('id-ID')})
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Estimasi Durasi Workbay</Text>
              <Text style={styles.summaryValue}>{totalDuration} Menit</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Estimasi Biaya</Text>
              <Text style={styles.totalAmount}>
                Rp {totalPrice.toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Primary Action Button */}
      <View style={styles.actionSection}>
        <PrimaryButton
          title={step === 4 ? 'Konfirmasi Reservasi Workbay' : 'Lanjutkan Langkah'}
          onPress={handleNext}
          size="lg"
        />
      </View>

      {/* Success Modal Simulation */}
      {isSuccessModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, Shadows.darkElevated]}>
            <View style={styles.modalIconBox}>
              <CheckCircle2 size={44} color={MeltuneColors.statusSuccess} />
            </View>

            <Text style={styles.modalTitle}>Reservasi Berhasil</Text>
            <Text style={styles.modalRef}>Kode: BK-20261122-NEW</Text>

            <Text style={styles.modalMessage}>
              Jadwal servis mobil Anda telah masuk ke sistem antrean workbay. Kepala teknisi kami akan menyiapkan stall pengerjaan.
            </Text>

            <PrimaryButton
              title="Lihat Riwayat Booking"
              onPress={() => {
                setIsSuccessModal(false);
                router.push('/booking/history');
              }}
              style={{ width: '100%', marginBottom: Spacing.md }}
            />

            <SecondaryButton
              title="Kembali ke Beranda"
              onPress={() => {
                setIsSuccessModal(false);
                setStep(1);
                router.push('/');
              }}
              style={{ width: '100%' }}
            />
          </View>
        </View>
      )}
    </AmbientGradientShell>
  );
}

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl, // 24px
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(36, 37, 34, 0.08)',
    marginBottom: Spacing.xl,      // 24px
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepTrackRow: {
    marginBottom: Spacing.xs,
  },
  stepIndicator: {
    width: 26,
    height: 26,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.surfaceLightElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicatorActive: {
    backgroundColor: MeltuneColors.burntOrange,
  },
  stepIndicatorDone: {
    backgroundColor: MeltuneColors.charcoal,
  },
  stepNumText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    fontWeight: Typography.weight.bold,
  },
  stepNumTextActive: {
    color: MeltuneColors.white,
  },
  stepLabelText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
  },
  stepLabelTextActive: {
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.bold,
  },
  stepLabelTextDone: {
    color: MeltuneColors.charcoal,
    fontWeight: Typography.weight.medium,
  },
  stepBlock: {
    marginBottom: Spacing.xxxl, // 40px
  },
  stepTitleGroup: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  stepHeading: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title2,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    letterSpacing: -0.4,
  },
  stepSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    minHeight: 74,
  },
  vehicleRowSelected: {
    backgroundColor: 'rgba(217, 107, 58, 0.05)',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(36, 37, 34, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  radioCircleSelected: {
    borderColor: MeltuneColors.burntOrange,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
  },
  vehicleInfoCol: {
    flex: 1,
  },
  vehicleModelName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  vehiclePlate: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  vehicleMileage: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginTop: 2,
  },
  addVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(217, 107, 58, 0.35)',
    backgroundColor: 'rgba(217, 107, 58, 0.04)',
    minHeight: 48,
  },
  addVehicleButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.burntOrange,
  },
  triageSummaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.08)',
  },
  triageSummaryLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
  },
  triageSummaryAmount: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    marginTop: 2,
  },
  triageSummaryDuration: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.semibold,
  },
  fieldSectionLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  dateTile: {
    flex: 1,
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.1)',
    borderRadius: Radius.xs,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    minHeight: 68,
  },
  dateTileSelected: {
    backgroundColor: MeltuneColors.charcoal,
    borderColor: MeltuneColors.charcoal,
  },
  dateDayName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
  },
  dateDayNum: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.title3,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    marginTop: 2,
  },
  dateTextSelected: {
    color: MeltuneColors.white,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  slotTile: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.1)',
    borderRadius: Radius.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 48,
  },
  slotTileSelected: {
    backgroundColor: MeltuneColors.burntOrange,
    borderColor: MeltuneColors.burntOrange,
  },
  slotTimeText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.charcoal,
  },
  slotTextSelected: {
    color: MeltuneColors.white,
  },
  inputWrapper: {
    paddingHorizontal: Spacing.xl,
  },
  summaryCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.08)',
    marginHorizontal: Spacing.xl,
    padding: Spacing.xl,
  },
  summaryItem: {
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginBottom: 4,
  },
  summaryValueBold: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  summaryValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    color: MeltuneColors.charcoal,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(36, 37, 34, 0.06)',
    marginVertical: Spacing.xs,
  },
  servicesCol: {
    gap: 4,
    marginTop: 2,
  },
  serviceLineItem: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(36, 37, 34, 0.08)',
  },
  totalLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  totalAmount: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.title2,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
  },
  actionSection: {
    paddingHorizontal: Spacing.xl,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    zIndex: 100,
  },
  modalCard: {
    width: '100%',
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.sm,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  modalIconBox: {
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title2,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    textAlign: 'center',
  },
  modalRef: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    color: MeltuneColors.burntOrange,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  modalMessage: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
});
