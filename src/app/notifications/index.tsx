import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Wrench, Flame, ShieldAlert, ChevronRight } from 'lucide-react-native';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { PREVIEW_NOTIFICATIONS } from '@/services/previewData';
import { useNotificationsQuery } from '@/hooks/useWorkshopData';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function NotificationCenterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: notifications = PREVIEW_NOTIFICATIONS, refetch } = useNotificationsQuery();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Wrench size={18} color={MeltuneColors.burntOrange} />;
      case 'loyalty':
        return <Flame size={18} color={MeltuneColors.burntOrange} />;
      default:
        return <Bell size={18} color={MeltuneColors.charcoal} />;
    }
  };

  return (
    <GradientBackground variant="subtleIvory">
      <AppHeader
        title="Pusat Notifikasi"
        subtitle="Pemberitahuan Servis, Workbay & Promo"
        tag="PUSAT NOTIFIKASI"
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={MeltuneColors.burntOrange}
          />
        }
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxl },
        ]}
      >
        <View style={styles.list}>
          {notifications.map(notif => (
            <Pressable
              key={notif.id}
              onPress={() => {
                if (notif.type === 'booking') router.push('/booking/tracking');
                if (notif.type === 'loyalty') router.push('/loyalty');
              }}
              style={({ pressed }) => [
                styles.notifCard,
                !notif.read && styles.notifUnread,
                Shadows.subtle,
                pressed && styles.notifPressed,
              ]}
            >
              <View style={styles.iconBox}>{getIcon(notif.type)}</View>

              <View style={styles.textColumn}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{notif.title}</Text>
                  {!notif.read && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.message}>{notif.message}</Text>
                <Text style={styles.timestamp}>{notif.createdAt}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
  },
  list: {
    gap: Spacing.sm,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  notifUnread: {
    borderColor: 'rgba(217, 107, 58, 0.4)',
    backgroundColor: '#FFFDFB',
  },
  notifPressed: {
    backgroundColor: MeltuneColors.surfaceLightMuted,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: MeltuneColors.surfaceLightElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    flex: 1,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
    marginLeft: Spacing.xs,
  },
  message: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
    lineHeight: 18,
  },
  timestamp: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    marginTop: Spacing.xs,
  },
});
