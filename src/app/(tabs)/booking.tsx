import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Clock,
  CheckCircle2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  AlertCircle,
} from 'lucide-react-native';
import { AmbientGradientShell } from '@/components/layout/AmbientGradientShell';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { FormInput } from '@/components/ui/FormInput';
import { DividedList } from '@/components/ui/DividedList';
import { TechnicalListRow } from '@/components/ui/TechnicalListRow';
import { PREVIEW_VEHICLES, PREVIEW_SERVICES } from '@/services/previewData';
import {
  useVehiclesQuery,
  useServicesQuery,
  useCreateBookingMutation,
  useAvailableSlotsQuery,
} from '@/hooks/useWorkshopData';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

const FALLBACK_TIME_SLOTS = [
  '08:30 - 10:00',
  '10:00 - 11:30',
  '13:00 - 14:30',
  '14:30 - 16:00',
  '16:00 - 17:30',
];

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function formatDateToYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function BookingScreen() {
  const router = useRouter();
  const { data: vehicles = [] } = useVehiclesQuery();
  const { data: services = [] } = useServicesQuery();
  const createBookingMutation = useCreateBookingMutation();

  const now = new Date();
  const todayYMD = formatDateToYMD(now);

  const [step, setStep] = useState(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>(todayYMD);
  const [scheduledTime, setScheduledTime] = useState<string>(FALLBACK_TIME_SLOTS[1]);
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [createdBookingRef, setCreatedBookingRef] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Calendar month/year navigation state
  const [viewYear, setViewYear] = useState<number>(now.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(now.getMonth());

  // Available slots query for the selected date
  const { data: slotsData, isLoading: loadingSlots } = useAvailableSlotsQuery(scheduledDate);

  // Sync selected vehicle when vehicles load
  useEffect(() => {
    if (vehicles.length > 0) {
      if (!selectedVehicleId || !vehicles.some(v => v.id === selectedVehicleId)) {
        setSelectedVehicleId(vehicles[0].id);
      }
    } else if (PREVIEW_VEHICLES.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(PREVIEW_VEHICLES[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  // Sync selected service when services load
  useEffect(() => {
    if (services.length > 0) {
      if (
        selectedServiceIds.length === 0 ||
        !services.some(s => selectedServiceIds.includes(s.id))
      ) {
        setSelectedServiceIds([services[0].id]);
      }
    } else if (PREVIEW_SERVICES.length > 0 && selectedServiceIds.length === 0) {
      setSelectedServiceIds([PREVIEW_SERVICES[0].id]);
    }
  }, [services, selectedServiceIds]);

  const selectedVehicle =
    vehicles.find(v => v.id === selectedVehicleId) ||
    PREVIEW_VEHICLES.find(v => v.id === selectedVehicleId);

  const activeServices = services.length > 0 ? services : PREVIEW_SERVICES;
  const selectedServices = activeServices.filter(s =>
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

  // Calendar calculation
  const canGoPrev =
    viewYear > now.getFullYear() ||
    (viewYear === now.getFullYear() && viewMonth > now.getMonth());

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewYear(y => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(y => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday
  const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate(); // accounts for leap years

  const calendarDays: Array<{
    dayNum: number | null;
    dateYMD: string;
    isPast: boolean;
    isSunday: boolean;
    isToday: boolean;
  }> = [];

  for (let b = 0; b < firstDayIndex; b++) {
    calendarDays.push({
      dayNum: null,
      dateYMD: '',
      isPast: true,
      isSunday: false,
      isToday: false,
    });
  }

  for (let d = 1; d <= totalDaysInMonth; d++) {
    const ymd = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = new Date(viewYear, viewMonth, d).getDay();
    const isPast = ymd < todayYMD;
    const isSunday = dayOfWeek === 0;
    const isToday = ymd === todayYMD;
    calendarDays.push({
      dayNum: d,
      dateYMD: ymd,
      isPast,
      isSunday,
      isToday,
    });
  }

  const selectedDateObj = new Date(scheduledDate);
  const isSelectedDateSunday = selectedDateObj.getDay() === 0;

  const dynamicSlots = slotsData?.slots || FALLBACK_TIME_SLOTS.map(s => ({
    slot: s,
    available: true,
    capacity: 2,
    remaining: 2,
  }));

  const handleNext = async () => {
    if (step === 1 && !selectedVehicleId) {
      Alert.alert('Perhatian', 'Silakan pilih kendaraan yang akan diservis.');
      return;
    }
    if (step === 2 && selectedServiceIds.length === 0) {
      Alert.alert('Perhatian', 'Pilih minimal satu paket servis.');
      return;
    }
    if (step === 3 && isSelectedDateSunday) {
      Alert.alert(
        'Bengkel Libur',
        'Bengkel Meltune tutup pada hari Minggu. Silakan pilih hari operasional (Senin - Sabtu).'
      );
      return;
    }
    if (step < 4) {
      setStep(s => s + 1);
    } else {
      setSubmitting(true);
      try {
        const res = await createBookingMutation.mutateAsync({
          vehicleId: selectedVehicleId,
          vehicleName: selectedVehicle
            ? `${selectedVehicle.brand} ${selectedVehicle.model}`
            : 'Mobil',
          licensePlate: selectedVehicle?.licensePlate || '',
          serviceIds: selectedServiceIds,
          serviceNames: selectedServices.map(s => s.name),
          totalPrice,
          totalDurationMinutes: totalDuration,
          scheduledDate,
          scheduledTimeSlot: scheduledTime,
          problemDescription:
            problemDescription.trim() || 'Servis berkala Meltune Auto',
        });
        setCreatedBookingRef(res.bookingReference || res.id || 'MLT-NEW');
        setIsSuccessModal(true);
      } catch (err: any) {
        const errMsg =
          err?.response?.data?.message || err?.message || 'Terjadi kesalahan sistem.';

        if (
          err?.response?.status === 401 ||
          errMsg.toLowerCase().includes('token') ||
          errMsg.toLowerCase().includes('unauthorized')
        ) {
          Alert.alert(
            'Sesi Login Kedaluwarsa',
            'Sesi masuk Anda telah kedaluwarsa. Silakan masuk kembali ke akun Anda untuk menyelesaikan reservasi.',
            [
              {
                text: 'Masuk Kembali',
                onPress: () => router.replace('/(auth)/login'),
              },
            ]
          );
        } else {
          Alert.alert('Gagal Membuat Reservasi', errMsg);
        }
      } finally {
        setSubmitting(false);
      }
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
      tag="LOKASI SERVIS BSD"
      title="Reservasi Servis"
      subtitle="Jadwalkan perawatan presisi kendaraan Anda"
      showBack={step > 1}
      onBackPress={handleBack}
    >
      {/* 1. Step Indicator Bar */}
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

          {vehicles.length === 0 && (
            <View style={styles.emptyVehiclesCard}>
              <AlertCircle size={28} color={MeltuneColors.burntOrange} />
              <Text style={styles.emptyVehiclesTitle}>Belum Ada Kendaraan Terdaftar</Text>
              <Text style={styles.emptyVehiclesSub}>
                Daftarkan kendaraan pertama Anda ke garasi digital untuk melanjutkan booking servis.
              </Text>
              <Pressable
                onPress={() => router.push('/vehicle/add')}
                style={styles.addFirstVehicleBtn}
              >
                <Plus size={16} color={MeltuneColors.white} />
                <Text style={styles.addFirstVehicleBtnText}>Tambah Kendaraan Baru</Text>
              </Pressable>
            </View>
          )}

          {vehicles.length > 0 && (
            <DividedList
              data={vehicles}
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
                      <Text style={styles.vehicleModelName}>
                        {v.brand} {v.model}
                      </Text>
                      <Text style={styles.vehiclePlate}>
                        {v.licensePlate} • Tahun {v.year}
                      </Text>
                      {v.mileage ? (
                        <Text style={styles.vehicleMileage}>
                          Odometer: {v.mileage?.toLocaleString('id-ID')} km
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
            />
          )}

          {vehicles.length > 0 && (
            <Pressable
              onPress={() => router.push('/vehicle/add')}
              style={styles.addVehicleButton}
            >
              <Plus size={16} color={MeltuneColors.burntOrange} />
              <Text style={styles.addVehicleButtonText}>Daftarkan Mobil Baru</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* STEP 2: SERVICE SELECTION */}
      {step === 2 && (
        <View style={styles.stepBlock}>
          <View style={styles.stepTitleGroup}>
            <Text style={styles.stepHeading}>Pilih Paket Layanan</Text>
            <Text style={styles.stepSub}>
              Pilih satu atau lebih paket servis berkala, tune up, sistem rem, atau suspensi.
            </Text>
          </View>

          <DividedList
            data={activeServices}
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

          {/* Summary Bar */}
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
            <Text style={styles.stepHeading}>Tentukan Jadwal Kedatangan</Text>
            <Text style={styles.stepSub}>
              Bengkel Meltune beroperasi Senin - Sabtu pukul 08:30 - 17:30 WIB.
            </Text>
          </View>

          {/* Dynamic Month Calendar */}
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeaderRow}>
              <View style={styles.calendarTitleWrap}>
                <CalendarIcon size={18} color={MeltuneColors.burntOrange} />
                <Text style={styles.calendarMonthText}>
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </Text>
              </View>
              <View style={styles.calendarNavButtons}>
                <Pressable
                  onPress={handlePrevMonth}
                  disabled={!canGoPrev}
                  style={[
                    styles.calNavBtn,
                    !canGoPrev && styles.calNavBtnDisabled,
                  ]}
                >
                  <ChevronLeft
                    size={18}
                    color={
                      canGoPrev
                        ? MeltuneColors.charcoal
                        : MeltuneColors.textMutedLight
                    }
                  />
                </Pressable>
                <Pressable onPress={handleNextMonth} style={styles.calNavBtn}>
                  <ChevronRight size={18} color={MeltuneColors.charcoal} />
                </Pressable>
              </View>
            </View>

            {/* Day of Week Labels */}
            <View style={styles.calendarDaysHeader}>
              {DAY_LABELS.map((lbl, idx) => (
                <Text
                  key={lbl}
                  style={[
                    styles.calDayHeaderLabel,
                    idx === 0 && styles.calSundayHeader,
                  ]}
                >
                  {lbl}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((cell, idx) => {
                if (cell.dayNum === null) {
                  return <View key={`blank-${idx}`} style={styles.calCellEmpty} />;
                }

                const isSelected = scheduledDate === cell.dateYMD;
                const isDisabled = cell.isPast || cell.isSunday;

                return (
                  <Pressable
                    key={cell.dateYMD}
                    disabled={isDisabled}
                    onPress={() => setScheduledDate(cell.dateYMD)}
                    style={[
                      styles.calCell,
                      isSelected && styles.calCellSelected,
                      cell.isToday && !isSelected && styles.calCellToday,
                      isDisabled && styles.calCellDisabled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.calCellText,
                        cell.isSunday && styles.calCellSundayText,
                        cell.isToday && styles.calCellTodayText,
                        isSelected && styles.calCellTextSelected,
                        isDisabled && styles.calCellDisabledText,
                      ]}
                    >
                      {cell.dayNum}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {isSelectedDateSunday && (
              <View style={styles.sundayWarningBox}>
                <AlertCircle size={16} color={MeltuneColors.burntOrange} />
                <Text style={styles.sundayWarningText}>
                  Bengkel tutup pada hari Minggu. Silakan pilih hari Senin - Sabtu.
                </Text>
              </View>
            )}
          </View>

          {/* Time Slots */}
          <View style={styles.slotsSection}>
            <View style={styles.slotsHeaderRow}>
              <Text style={styles.fieldSectionLabel}>Pilih Jam Servis</Text>
              {loadingSlots && (
                <ActivityIndicator size="small" color={MeltuneColors.burntOrange} />
              )}
            </View>

            <View style={styles.slotGrid}>
              {dynamicSlots.map(s => {
                const isSelected = scheduledTime === s.slot;
                const isFull = !s.available || s.remaining <= 0;

                return (
                  <Pressable
                    key={s.slot}
                    disabled={isFull}
                    onPress={() => setScheduledTime(s.slot)}
                    style={[
                      styles.slotTile,
                      isSelected && styles.slotTileSelected,
                      isFull && styles.slotTileFull,
                    ]}
                  >
                    <View style={styles.slotContentRow}>
                      <Clock
                        size={14}
                        color={
                          isSelected
                            ? MeltuneColors.white
                            : isFull
                            ? MeltuneColors.textMutedLight
                            : MeltuneColors.textSecondaryLight
                        }
                      />
                      <Text
                        style={[
                          styles.slotTimeText,
                          isSelected && styles.slotTextSelected,
                          isFull && styles.slotTextFull,
                        ]}
                      >
                        {s.slot} WIB
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.slotCapacityText,
                        isSelected && styles.slotCapacitySelected,
                        isFull && styles.slotCapacityFull,
                      ]}
                    >
                      {isFull ? 'Penuh' : `Tersedia: ${s.remaining} slot`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
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
              Pastikan rincian data mobil dan jadwal servis telah sesuai sebelum verifikasi.
            </Text>
          </View>

          <View style={[styles.summaryCard, Shadows.subtle]}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Kendaraan</Text>
              <Text style={styles.summaryValueBold}>
                {selectedVehicle?.brand} {selectedVehicle?.model} ({selectedVehicle?.licensePlate})
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
              <Text style={styles.summaryLabel}>Estimasi Durasi Servis</Text>
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
          title={step === 4 ? 'Konfirmasi Reservasi Servis' : 'Lanjutkan Langkah'}
          onPress={handleNext}
          loading={submitting}
          size="lg"
        />
      </View>

      {/* Success Modal */}
      {isSuccessModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, Shadows.darkElevated]}>
            <View style={styles.modalIconBox}>
              <CheckCircle2 size={44} color={MeltuneColors.statusSuccess} />
            </View>

            <Text style={styles.modalTitle}>Reservasi Berhasil</Text>
            <Text style={styles.modalRef}>Kode: {createdBookingRef}</Text>

            <Text style={styles.modalMessage}>
              Jadwal servis mobil Anda telah masuk ke antrean servis Meltune Auto. Kepala teknisi kami akan menyiapkan stall pengerjaan.
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(36, 37, 34, 0.08)',
    marginBottom: Spacing.xl,
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
    marginBottom: Spacing.xxxl,
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
  emptyVehiclesCard: {
    marginHorizontal: Spacing.xl,
    padding: Spacing.xl,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(217, 107, 58, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(217, 107, 58, 0.25)',
    alignItems: 'center',
  },
  emptyVehiclesTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    marginTop: Spacing.md,
  },
  emptyVehiclesSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  addFirstVehicleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: MeltuneColors.burntOrange,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.xs,
  },
  addFirstVehicleBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
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
  calendarContainer: {
    marginHorizontal: Spacing.xl,
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.1)',
    padding: Spacing.lg,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(36, 37, 34, 0.06)',
  },
  calendarTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  calendarMonthText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  calendarNavButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  calNavBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  calNavBtnDisabled: {
    opacity: 0.3,
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  calDayHeaderLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.textMutedLight,
  },
  calSundayHeader: {
    color: '#D9534F',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCellEmpty: {
    width: '14.28%',
    height: 38,
  },
  calCell: {
    width: '14.28%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xs,
    marginVertical: 2,
  },
  calCellSelected: {
    backgroundColor: MeltuneColors.burntOrange,
  },
  calCellToday: {
    borderWidth: 1,
    borderColor: MeltuneColors.burntOrange,
  },
  calCellDisabled: {
    opacity: 0.25,
  },
  calCellText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.charcoal,
  },
  calCellSundayText: {
    color: '#D9534F',
  },
  calCellTodayText: {
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.bold,
  },
  calCellTextSelected: {
    color: MeltuneColors.white,
    fontWeight: Typography.weight.bold,
  },
  calCellDisabledText: {
    color: MeltuneColors.textMutedLight,
  },
  sundayWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(217, 107, 58, 0.08)',
    padding: Spacing.sm,
    borderRadius: Radius.xs,
    marginTop: Spacing.md,
  },
  sundayWarningText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.medium,
    flex: 1,
  },
  slotsSection: {
    marginTop: Spacing.xl,
  },
  slotsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  fieldSectionLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  slotTile: {
    width: '48%',
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.1)',
    borderRadius: Radius.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    minHeight: 56,
    justifyContent: 'center',
  },
  slotTileSelected: {
    backgroundColor: MeltuneColors.burntOrange,
    borderColor: MeltuneColors.burntOrange,
  },
  slotTileFull: {
    backgroundColor: 'rgba(36, 37, 34, 0.04)',
    borderColor: 'rgba(36, 37, 34, 0.06)',
    opacity: 0.6,
  },
  slotContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
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
  slotTextFull: {
    color: MeltuneColors.textMutedLight,
  },
  slotCapacityText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 4,
  },
  slotCapacitySelected: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  slotCapacityFull: {
    color: '#D9534F',
  },
  inputWrapper: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
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
