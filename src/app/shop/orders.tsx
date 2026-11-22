import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingBag, ChevronRight, Package, Clock } from 'lucide-react-native';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

const PREVIEW_ORDERS = [
  {
    id: 'ord_01',
    orderNumber: 'ORD-20261120-041',
    items: [
      { name: 'Motul 300V Power 5W-40 (2L)', quantity: 2, price: 885000 },
      { name: 'Liqui Moly Cera Tec (300ml)', quantity: 1, price: 365000 },
    ],
    totalAmount: 2135000,
    status: 'ready_for_pickup' as const,
    date: '20 Nov 2026',
    shippingMethod: 'Pengambilan di Workshop BSD',
  },
  {
    id: 'ord_02',
    orderNumber: 'ORD-20261010-019',
    items: [
      { name: 'Brembo HP2000 Sport Fast Road Pads', quantity: 1, price: 2450000 },
    ],
    totalAmount: 2450000,
    status: 'completed' as const,
    date: '10 Okt 2026',
    shippingMethod: 'Pengambilan di Workshop BSD',
  },
];

export default function OrderHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <GradientBackground variant="subtleIvory">
      <AppHeader
        title="Pesanan Suku Cadang"
        subtitle="Log Pengambilan & Status Paket OEM"
        tag="PURCHASE ARCHIVE"
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xxl },
        ]}
      >
        <View style={styles.list}>
          {PREVIEW_ORDERS.map(order => (
            <View key={order.id} style={[styles.orderCard, Shadows.subtle]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderNum}>{order.orderNumber}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <StatusBadge status={order.status} />
              </View>

              <View style={styles.itemsList}>
                {order.items.map((it, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {it.quantity}x {it.name}
                    </Text>
                    <Text style={styles.itemSubtotal}>
                      Rp {(it.price * it.quantity).toLocaleString('id-ID')}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.methodBox}>
                  <Package size={13} color={MeltuneColors.textMutedLight} />
                  <Text style={styles.methodText}>{order.shippingMethod}</Text>
                </View>

                <View style={styles.totalBox}>
                  <Text style={styles.totalLabel}>TOTAL</Text>
                  <Text style={styles.totalValue}>
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </Text>
                </View>
              </View>
            </View>
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
    gap: Spacing.md,
  },
  orderCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  orderNum: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  orderDate: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  itemsList: {
    marginTop: Spacing.sm,
    gap: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
    flex: 1,
    marginRight: Spacing.sm,
  },
  itemSubtotal: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: MeltuneColors.borderLight,
  },
  methodBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  methodText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
  },
  totalBox: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 8,
    color: MeltuneColors.textMutedLight,
  },
  totalValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
  },
});
