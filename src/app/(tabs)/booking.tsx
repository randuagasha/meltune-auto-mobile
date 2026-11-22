import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Car,
  Wrench,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  ChevronRight,
  Plus,
  ArrowLeft,
} from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { FormInput } from '@/components/ui/FormInput';
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
  const insets = useSafeAreaInsets();

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
      // Step 4 is confirmation
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
    <AmbientGradientBackground preset="bookingWarm">
      <AppHeader
        title="Reservasi Servis"
        subtitle="Workbay Triage & Jadwal Pengerjaan Workshop"
        tag="MELTUNE AUTO BSD"
        showBack={step > 1}
        onBackPress={handleBack}
      />

      {/* Step Indicator */}
      <View style={styles.stepIndicatorContainer}>
        {[
          { num: 1, label: 'Kendaraan' },
          { num: 2, label: 'Layanan' },
          { num: 3, label: 'Jadwal' },
          { num: 4, label: 'Konfirmasi' },
        ].map(item => {
          const isActive = step === item.num;
          const isDone = step > item.num;
          return (
            <View key={item.num} style={styles.stepIndicatorItem}>
              <View
                style={[
                  styles.stepNumberBadge,
                  isActive && styles.stepNumberBadgeActive,
                  isDone && styles.stepNumberBadgeDone,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumberText,
                    (isActive || isDone) && styles.stepNumberTextActive,
                  ]}
                >
                  {isDone ? '✓' : item.num}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                  isDone && styles.stepLabelDone,
                ]}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 90 + Spacing.xxl },
        ]}
      >
        {/* STEP 1: VEHICLE SELECTION */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pilih Mobil dari Garasi Anda</Text>
            <Text style={styles.stepDesc}>
              Spesifikasi mesin dan riwayat pelumas kendaraan akan disesuaikan oleh kepala mekanik.
            </Text>

            <View style={styles.vehicleList}>
              {PREVIEW_VEHICLES.map(v => {
                const isSelected = selectedVehicleId === v.id;
                return (
                  <Pressable
                    key={v.id}
                    onPress={() => setSelectedVehicleId(v.id)}
                    style={[
                      styles.vehicleOptionCard,
                      isSelected && styles.vehicleOptionCardSelected,
                    ]}
                  >
                    <View style={styles.vehicleOptionHeader}>
                      <View style={styles.vehiclePlateTag}>
                        <Text style={styles.vehiclePlateText}>{v.licensePlate}</Text>
                      </View>
                      <View
                        style={[
                          styles.radioDot,
                          isSelected && styles.radioDotSelected,
                        ]}
                      />
                    </View>

                    <Text style={styles.vehicleModelText}>{v.model}</Text>
                    <Text style={styles.vehicleMetaText}>
                      {v.year} • {v.fuelType.toUpperCase()} • {v.transmission.toUpperCase()}
                    </Text>
                    <Text style={styles.vehicleMileageText}>
                      Odometer: {v.mileage?.toLocaleString('id-ID')} KM
                    </Text>
                  </Pressable>
                );
              })}

              <Pressable
                onPress={() => router.push('/vehicle/add')}
                style={styles.addNewVehicleButton}
              >
                <Plus size={16} color={MeltuneColors.burntOrange} />
                <Text style={styles.addNewVehicleText}>+ Daftarkan Mobil Baru</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* STEP 2: SERVICE SELECTION */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pilih Paket Pengerjaan</Text>
            <Text style={styles.stepDesc}>
              Bisa memilih lebih dari satu paket servis berkala, diagnostik, atau perbaikan roda.
            </Text>

            <View style={styles.serviceList}>
              {PREVIEW_SERVICES.map(s => {
                const isSelected = selectedServiceIds.includes(s.id);
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => toggleService(s.id)}
                    style={[
                      styles.serviceOptionCard,
                      isSelected && styles.serviceOptionCardSelected,
                    ]}
                  >
                    <View style={styles.serviceOptionTop}>
                      <View style={styles.serviceCategoryPill}>
                        <Text style={styles.serviceCategoryPillText}>
                          {s.category.toUpperCase()}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.checkboxBox,
                          isSelected && styles.checkboxBoxSelected,
                        ]}
                      >
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </View>

                    <Text style={styles.serviceOptionTitle}>{s.name}</Text>
                    <Text style={styles.serviceOptionDesc}>{s.description}</Text>

                    <View style={styles.serviceOptionFooter}>
                      <Text style={styles.serviceOptionPrice}>
                        Rp {s.price.toLocaleString('id-ID')}
                      </Text>
                      <View style={styles.durationPill}>
                        <Clock size={11} color={MeltuneColors.textSecondaryLight} />
                        <Text style={styles.durationText}>{s.estimatedDurationMinutes} Menit</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 3: DATE & TIME SELECTION */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Tentukan Waktu Kedatangan</Text>
            <Text style={styles.stepDesc}>
              Workbay MELTUNE AUTO beroperasi Senin - Sabtu pukul 08:30 - 17:30 WIB.
            </Text>

            {/* Date Selection */}
            <Text style={styles.subSectionLabel}>TANGGAL RESERVASI</Text>
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
                      styles.dateCard,
                      isSelected && styles.dateCardSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateDayName,
                        isSelected && styles.dateTextActive,
                      ]}
                    >
                      {dayName}
                    </Text>
                    <Text
                      style={[
                        styles.dateDayNum,
                        isSelected && styles.dateTextActive,
                      ]}
                    >
                      {dayNum}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Time Slot Selection */}
            <Text style={[styles.subSectionLabel, { marginTop: Spacing.lg }]}>
              SLOT WAKTU WORKBAY
            </Text>
            <View style={styles.slotGrid}>
              {TIME_SLOTS.map(slot => {
                const isSelected = scheduledTime === slot;
                return (
                  <Pressable
                    key={slot}
                    onPress={() => setScheduledTime(slot)}
                    style={[
                      styles.slotCard,
                      isSelected && styles.slotCardSelected,
                    ]}
                  >
                    <Clock
                      size={14}
                      color={
                        isSelected ? MeltuneColors.white : MeltuneColors.burntOrange
                      }
                    />
                    <Text
                      style={[
                        styles.slotText,
                        isSelected && styles.slotTextSelected,
                      ]}
                    >
                      {slot} WIB
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Problem notes */}
            <Text style={[styles.subSectionLabel, { marginTop: Spacing.lg }]}>
              CATATAN KELUHAN ATAU GEJALA TEKNIS
            </Text>
            <FormInput
              label="Deskripsi Keluhan (Opsional)"
              placeholder="Contoh: Bunyi decit saat pengereman pelan atau getaran pada stir di kecepatan 80 km/jam..."
              value={problemDescription}
              onChangeText={setProblemDescription}
              multiline
              numberOfLines={3}
              style={{ minHeight: 70 }}
            />
          </View>
        )}

        {/* STEP 4: CONFIRMATION SUMMARY */}
        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Konfirmasi Ringkasan Servis</Text>
            <Text style={styles.stepDesc}>
              Pastikan rincian kendaraan dan jadwal workbay telah sesuai sebelum verifikasi.
            </Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>KENDARAAN</Text>
                <Text style={styles.summaryValueBold}>
                  {selectedVehicle?.model} ({selectedVehicle?.licensePlate})
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>WAKTU KEDATANGAN</Text>
                <Text style={styles.summaryValue}>
                  {scheduledDate} • {scheduledTime} WIB
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>PAKET SERVIS</Text>
                <View style={styles.summaryServicesList}>
                  {selectedServices.map(s => (
                    <Text key={s.id} style={styles.summaryServiceItem}>
                      • {s.name}
                    </Text>
                  ))}
                </View>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>ESTIMASI DURASI</Text>
                <Text style={styles.summaryValue}>{totalDuration} Menit di Workbay</Text>
              </View>

              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>TOTAL ESTIMASI BIAYA</Text>
                <Text style={styles.totalAmount}>
                  Rp {totalPrice.toLocaleString('id-ID')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Next / Confirm Action Bar */}
        <View style={styles.actionRow}>
          <PrimaryButton
            title={step === 4 ? 'Konfirmasi Reservasi' : 'Lanjutkan Langkah'}
            onPress={handleNext}
            size="lg"
            style={styles.nextButton}
          />
        </View>

        {/* Success Modal Simulation */}
        {isSuccessModal && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, Shadows.darkElevated]}>
              <View style={styles.modalIconBox}>
                <CheckCircle2 size={40} color={MeltuneColors.statusSuccess} />
              </View>

              <Text style={styles.modalTitle}>Reservasi Terkirim!</Text>
              <Text style={styles.modalRef}>KODE: BK-20261122-NEW</Text>

              <Text style={styles.modalMessage}>
                Jadwal servis mobil Anda telah masuk ke sistem antrean workbay. Kepala teknisi kami akan memverifikasi ketersediaan suku cadang.
              </Text>

              <PrimaryButton
                title="Lihat Riwayat & Status Booking"
                onPress={() => {
                  setIsSuccessModal(false);
                  router.push('/booking/history');
                }}
                style={{ width: '100%', marginBottom: Spacing.sm }}
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
      </ScrollView>
    </AmbientGradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: MeltuneColors.white,
    borderBottomWidth: 1,
    borderBottomColor: MeltuneColors.borderLight,
    marginBottom: Spacing.lg,
  },
  stepIndicatorItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.surfaceLightElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepNumberBadgeActive: {
    backgroundColor: MeltuneColors.burntOrange,
  },
  stepNumberBadgeDone: {
    backgroundColor: MeltuneColors.statusSuccess,
  },
  stepNumberText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    fontWeight: Typography.weight.bold,
  },
  stepNumberTextActive: {
    color: MeltuneColors.white,
  },
  stepLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: MeltuneColors.textMutedLight,
  },
  stepLabelActive: {
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.bold,
  },
  stepLabelDone: {
    color: MeltuneColors.charcoal,
  },
  stepContent: {
    marginBottom: Spacing.lg,
  },
  stepTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title3,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    letterSpacing: Typography.letterSpacing.tight,
  },
  stepDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  vehicleList: {
    gap: Spacing.md,
  },
  vehicleOptionCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.md,
    ...Shadows.subtle,
  },
  vehicleOptionCardSelected: {
    borderColor: MeltuneColors.burntOrange,
    backgroundColor: '#FFFBF8',
  },
  vehicleOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  vehiclePlateTag: {
    backgroundColor: MeltuneColors.charcoal,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  vehiclePlateText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: MeltuneColors.borderLight,
  },
  radioDotSelected: {
    borderColor: MeltuneColors.burntOrange,
    backgroundColor: MeltuneColors.burntOrange,
  },
  vehicleModelText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  vehicleMetaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  vehicleMileageText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginTop: 4,
  },
  addNewVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: Spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: MeltuneColors.burntOrange,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(217, 107, 58, 0.04)',
  },
  addNewVehicleText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
  },
  serviceList: {
    gap: Spacing.md,
  },
  serviceOptionCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.md,
    ...Shadows.subtle,
  },
  serviceOptionCardSelected: {
    borderColor: MeltuneColors.burntOrange,
    backgroundColor: '#FFFBF8',
  },
  serviceOptionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  serviceCategoryPill: {
    backgroundColor: MeltuneColors.surfaceLightElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  serviceCategoryPillText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: Radius.xs,
    borderWidth: 1.5,
    borderColor: MeltuneColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxSelected: {
    backgroundColor: MeltuneColors.burntOrange,
    borderColor: MeltuneColors.burntOrange,
  },
  checkmark: {
    color: MeltuneColors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  serviceOptionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  serviceOptionDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 4,
    lineHeight: 18,
  },
  serviceOptionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: MeltuneColors.borderLight,
  },
  serviceOptionPrice: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  durationText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
  },
  subSectionLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 10,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dateCard: {
    flex: 1,
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  dateCardSelected: {
    backgroundColor: MeltuneColors.burntOrange,
    borderColor: MeltuneColors.burntOrange,
  },
  dateDayName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
  },
  dateDayNum: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.title3,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    marginTop: 2,
  },
  dateTextActive: {
    color: MeltuneColors.white,
  },
  slotGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  slotCardSelected: {
    backgroundColor: MeltuneColors.charcoal,
    borderColor: MeltuneColors.charcoal,
  },
  slotText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
    fontWeight: Typography.weight.semibold,
  },
  slotTextSelected: {
    color: MeltuneColors.white,
  },
  summaryCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.lg,
  },
  summaryRow: {
    marginVertical: Spacing.xs,
  },
  summaryLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 1,
  },
  summaryValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    color: MeltuneColors.charcoal,
    marginTop: 2,
  },
  summaryValueBold: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    marginTop: 2,
  },
  summaryServicesList: {
    marginTop: 4,
    gap: 2,
  },
  summaryServiceItem: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: MeltuneColors.borderLight,
    marginVertical: Spacing.sm,
  },
  totalBox: {
    backgroundColor: MeltuneColors.surfaceLightElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.textSecondaryLight,
    letterSpacing: 1,
  },
  totalAmount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title2,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
    marginTop: 2,
  },
  actionRow: {
    marginTop: Spacing.md,
  },
  nextButton: {
    width: '100%',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    zIndex: 999,
  },
  modalCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  modalIconBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.statusSuccessBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title2,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.charcoal,
  },
  modalRef: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  modalMessage: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
});
