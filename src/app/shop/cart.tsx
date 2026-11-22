import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trash2, Plus, Minus, CheckCircle2, ShoppingBag } from 'lucide-react-native';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCartStore } from '@/stores/cartStore';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { items, updateQuantity, removeItem, clearCart, getTotalAmount } =
    useCartStore();
  const totalAmount = getTotalAmount();

  const [checkoutModal, setCheckoutModal] = useState(false);

  const handleCheckout = () => {
    setCheckoutModal(true);
  };

  const handleSuccessClose = () => {
    setCheckoutModal(false);
    clearCart();
    router.replace('/shop/orders');
  };

  return (
    <GradientBackground variant="subtleIvory">
      <AppHeader
        title="Keranjang Belanja"
        subtitle={`${items.length} Macam Suku Cadang Terpilih`}
        tag="AUTHENTIC PARTS CHECKOUT"
        showBack
      />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon={<ShoppingBag size={32} color={MeltuneColors.textMutedLight} />}
            title="Keranjang Anda Kosong"
            description="Jelajahi oli balap sintetik, part rem OEM, dan produk detailing bersertifikasi."
            actionTitle="Buka Toko Suku Cadang"
            onActionPress={() => router.push('/shop')}
          />
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + 120 },
            ]}
          >
            <View style={styles.itemsList}>
              {items.map(item => (
                <View
                  key={item.product.id}
                  style={[styles.cartItemCard, Shadows.subtle]}
                >
                  <Image
                    source={{ uri: item.product.imageUrl }}
                    style={styles.itemImage}
                    contentFit="cover"
                  />

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.product.name}
                    </Text>
                    <Text style={styles.itemPrice}>
                      Rp {item.product.price.toLocaleString('id-ID')}
                    </Text>

                    <View style={styles.controlsRow}>
                      <View style={styles.counterBox}>
                        <Pressable
                          onPress={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          style={styles.counterBtn}
                        >
                          <Minus size={12} color={MeltuneColors.charcoal} />
                        </Pressable>
                        <Text style={styles.counterText}>{item.quantity}</Text>
                        <Pressable
                          onPress={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          style={styles.counterBtn}
                        >
                          <Plus size={12} color={MeltuneColors.charcoal} />
                        </Pressable>
                      </View>

                      <Pressable
                        onPress={() => removeItem(item.product.id)}
                        style={styles.removeBtn}
                      >
                        <Trash2 size={16} color={MeltuneColors.statusDanger} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Price Summary Breakdown */}
            <View style={[styles.summaryBox, Shadows.subtle]}>
              <Text style={styles.summaryTitle}>RINGKASAN PEMBELIAN</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal Barang:</Text>
                <Text style={styles.summaryVal}>
                  Rp {totalAmount.toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pengambilan di Workshop BSD:</Text>
                <Text style={styles.summaryValFree}>GRATIS</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Pembayaran:</Text>
                <Text style={styles.totalVal}>
                  Rp {totalAmount.toLocaleString('id-ID')}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Checkout Bar */}
          <View
            style={[
              styles.checkoutBar,
              { paddingBottom: Math.max(insets.bottom, 12) },
              Shadows.darkElevated,
            ]}
          >
            <View style={styles.checkoutTotalCol}>
              <Text style={styles.checkoutTotalLabel}>TOTAL ESTIMASI</Text>
              <Text style={styles.checkoutTotalValue}>
                Rp {totalAmount.toLocaleString('id-ID')}
              </Text>
            </View>

            <PrimaryButton
              title="Lanjutkan Checkout"
              onPress={handleCheckout}
              style={styles.checkoutBtn}
            />
          </View>
        </>
      )}

      {/* Checkout Demo Success Modal */}
      {checkoutModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, Shadows.darkElevated]}>
            <View style={styles.modalSuccessIcon}>
              <CheckCircle2 size={42} color={MeltuneColors.statusSuccess} />
            </View>

            <Text style={styles.modalTitle}>Pesanan Dibuat!</Text>
            <Text style={styles.modalOrderNum}>ORD-20261122-8821</Text>

            <Text style={styles.modalDesc}>
              Pesanan suku cadang Anda telah tercatat. Anda dapat mengambilnya langsung di resepsionis MELTUNE AUTO BSD atau menunggu kurir workshop.
            </Text>

            <PrimaryButton
              title="Lihat Riwayat Pesanan Saya"
              onPress={handleSuccessClose}
              style={{ width: '100%' }}
            />
          </View>
        </View>
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: Spacing.xl,
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  itemsList: {
    gap: Spacing.md,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    lineHeight: 18,
  },
  itemPrice: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.surfaceLightElevated,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
  },
  counterBtn: {
    padding: 6,
  },
  counterText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    paddingHorizontal: 8,
    color: MeltuneColors.charcoal,
  },
  removeBtn: {
    padding: Spacing.xs,
  },
  summaryBox: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  summaryTitle: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
  },
  summaryVal: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
  },
  summaryValFree: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.statusSuccess,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: MeltuneColors.borderLight,
    marginVertical: Spacing.xs,
  },
  totalLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  totalVal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: MeltuneColors.white,
    borderTopWidth: 1,
    borderTopColor: MeltuneColors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },
  checkoutTotalCol: {
    flex: 1,
  },
  checkoutTotalLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 8,
    color: MeltuneColors.textMutedLight,
  },
  checkoutTotalValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title3,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
  },
  checkoutBtn: {
    flex: 1.2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    zIndex: 999,
  },
  modalBox: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  modalSuccessIcon: {
    width: 68,
    height: 68,
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
  modalOrderNum: {
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
  modalDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
});
