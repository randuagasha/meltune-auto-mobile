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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ShoppingBag,
  CheckCircle2,
  Shield,
  Plus,
  Minus,
} from 'lucide-react-native';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { PREVIEW_PRODUCTS } from '@/services/previewData';
import { useProductsQuery } from '@/hooks/useWorkshopData';
import { useCartStore } from '@/stores/cartStore';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function ProductDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { data: products = PREVIEW_PRODUCTS } = useProductsQuery();

  const productId = String(params.id || '');
  const product =
    products.find(p => p.id === productId) ||
    PREVIEW_PRODUCTS.find(p => p.id === productId) ||
    PREVIEW_PRODUCTS[0];

  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    Alert.alert(
      'Ditambahkan ke Keranjang',
      `${quantity}x ${product.name} telah masuk ke keranjang belanja Anda.`,
      [
        { text: 'Lanjut Belanja', style: 'cancel' },
        { text: 'Buka Keranjang', onPress: () => router.push('/shop/cart') },
      ]
    );
  };

  return (
    <GradientBackground variant="softLuxury">
      <AppHeader
        title={product.name}
        subtitle={`Part No: ${product.partNumber || 'OEM-GENUINE'}`}
        tag="AUTHENTIC ITEM"
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 90 },
        ]}
      >
        {/* Product Image Stage */}
        <View style={[styles.imageStage, Shadows.card]}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            contentFit="cover"
          />
          {product.stock > 0 && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>STOK TERSEDIA: {product.stock} UNIT</Text>
            </View>
          )}
        </View>

        {/* Product Info Card */}
        <View style={[styles.infoCard, Shadows.subtle]}>
          <Text style={styles.categoryBadge}>
            {product.category.replace('_', ' ').toUpperCase()}
          </Text>
          <Text style={styles.productTitle}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>HARGA PART OEM RESMI</Text>
            <Text style={styles.priceValue}>
              Rp {product.price.toLocaleString('id-ID')}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descHeading}>DESKRIPSI & SPESIFIKASI</Text>
          <Text style={styles.descText}>{product.description}</Text>

          {/* Specifications Table */}
          {product.specifications && (
            <View style={styles.specsTable}>
              {Object.entries(product.specifications).map(([key, val]) => (
                <View key={key} style={styles.specsTableRow}>
                  <Text style={styles.specsKey}>{key}</Text>
                  <Text style={styles.specsVal}>{val}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Compatibility List */}
          {product.compatibility && product.compatibility.length > 0 && (
            <View style={styles.compatBox}>
              <Text style={styles.compatTitle}>KOMPATIBILITAS KENDARAAN TERVERIFIKASI</Text>
              {product.compatibility.map((car, idx) => (
                <Text key={idx} style={styles.compatItem}>
                  ✓ {car}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Quality Guarantee Box */}
        <View style={styles.guaranteeBox}>
          <Shield size={20} color={MeltuneColors.burntOrange} />
          <View style={styles.guaranteeText}>
            <Text style={styles.guaranteeTitle}>Jaminan 100% Produk Original & Bersegel</Text>
            <Text style={styles.guaranteeSub}>
              Didistribusikan resmi dari distributor authorized Indonesia dengan serial number resmi.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View
        style={[
          styles.bottomActionBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
          Shadows.darkElevated,
        ]}
      >
        {/* Quantity Counter */}
        <View style={styles.quantityCounter}>
          <Pressable
            onPress={() => setQuantity(q => Math.max(1, q - 1))}
            style={styles.qtyBtn}
          >
            <Minus size={14} color={MeltuneColors.charcoal} />
          </Pressable>
          <Text style={styles.qtyText}>{quantity}</Text>
          <Pressable
            onPress={() => setQuantity(q => q + 1)}
            style={styles.qtyBtn}
          >
            <Plus size={14} color={MeltuneColors.charcoal} />
          </Pressable>
        </View>

        <PrimaryButton
          title={`+ Keranjang (Rp ${(product.price * quantity).toLocaleString('id-ID')})`}
          onPress={handleAddToCart}
          style={styles.addToCartBtn}
          icon={<ShoppingBag size={16} color={MeltuneColors.white} />}
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  imageStage: {
    width: '100%',
    aspectRatio: 1.2,
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  stockBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: MeltuneColors.charcoal,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  stockText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.champagne,
    fontWeight: Typography.weight.bold,
  },
  infoCard: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.lg,
  },
  categoryBadge: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  productTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title3,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.charcoal,
    lineHeight: 24,
  },
  priceRow: {
    marginTop: Spacing.md,
  },
  priceLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 0.8,
  },
  priceValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.title1,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: MeltuneColors.borderLight,
    marginVertical: Spacing.md,
  },
  descHeading: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  descText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    lineHeight: 20,
  },
  specsTable: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  specsTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: MeltuneColors.borderLight,
  },
  specsKey: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
  },
  specsVal: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  compatBox: {
    marginTop: Spacing.md,
    backgroundColor: MeltuneColors.surfaceLightElevated,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  compatTitle: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 8,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  compatItem: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  guaranteeText: {
    flex: 1,
  },
  guaranteeTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  guaranteeSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
  },
  bottomActionBar: {
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
  quantityCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    borderRadius: Radius.sm,
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  qtyBtn: {
    padding: Spacing.sm,
  },
  qtyText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    paddingHorizontal: Spacing.xs,
    color: MeltuneColors.charcoal,
  },
  addToCartBtn: {
    flex: 1,
  },
});
