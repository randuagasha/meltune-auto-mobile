import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { AmbientGradientBackground } from '@/components/ui/AmbientGradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { ProductCard } from '@/components/product/ProductCard';
import { PREVIEW_PRODUCTS } from '@/services/previewData';
import { useCartStore } from '@/stores/cartStore';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

const CATEGORIES = [
  { id: 'all', label: 'Semua Produk' },
  { id: 'engine_oil', label: 'Oli & Pelumas' },
  { id: 'parts', label: 'Suku Cadang' },
  { id: 'car_care', label: 'Car Care' },
  { id: 'maintenance', label: 'Perawatan' },
];

export default function ShopScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { items, addItem, getTotalCount, getTotalAmount } = useCartStore();
  const totalCartCount = getTotalCount();
  const totalCartAmount = getTotalAmount();

  const filteredProducts = PREVIEW_PRODUCTS.filter(p => {
    const matchCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.partNumber && p.partNumber.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <AmbientGradientBackground preset="shopLuxury">
      <AppHeader
        title="Toko Suku Cadang"
        subtitle="Pelumas Performa & Part OEM Tersertifikasi"
        tag="AUTHENTIC PARTS // BSD"
        rightAction={
          <Pressable
            onPress={() => router.push('/shop/cart')}
            style={styles.cartHeaderButton}
            accessibilityLabel="Shopping Cart"
          >
            <ShoppingBag size={20} color={MeltuneColors.charcoal} />
            {totalCartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
              </View>
            )}
          </Pressable>
        }
      />

      {/* Search Input Box */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={18} color={MeltuneColors.textMutedLight} />
          <TextInput
            placeholder="Cari suku cadang, oli mesin, nomor part OEM..."
            placeholderTextColor={MeltuneColors.textMutedLight}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Category Filter Pills */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: totalCartCount > 0 ? 150 : 90 + Spacing.xxl },
        ]}
      >
        <View style={styles.productsGrid}>
          {filteredProducts.map(product => {
            const inCart = items.some(item => item.product.id === product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                isInCart={inCart}
                onPress={() =>
                  router.push({
                    pathname: '/shop/detail',
                    params: { id: product.id },
                  })
                }
                onAddToCart={() => addItem(product)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Cart Bottom Bar */}
      {totalCartCount > 0 && (
        <View
          style={[
            styles.floatingCartBar,
            Shadows.darkElevated,
            { bottom: 65 + Spacing.sm },
          ]}
        >
          <View style={styles.floatingCartInfo}>
            <Text style={styles.floatingCartCount}>
              {totalCartCount} Barang di Keranjang
            </Text>
            <Text style={styles.floatingCartTotal}>
              Rp {totalCartAmount.toLocaleString('id-ID')}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/shop/cart')}
            style={({ pressed }) => [
              styles.floatingCartButton,
              pressed && styles.floatingCartButtonPressed,
            ]}
          >
            <Text style={styles.floatingCartButtonText}>Buka Keranjang</Text>
            <ArrowRight size={16} color={MeltuneColors.white} />
          </Pressable>
        </View>
      )}
    </AmbientGradientBackground>
  );
}

const styles = StyleSheet.create({
  cartHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: MeltuneColors.burntOrange,
    width: 17,
    height: 17,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: MeltuneColors.white,
  },
  cartBadgeText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
  },
  categoriesContainer: {
    marginBottom: Spacing.md,
  },
  categoriesList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryPill: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
  },
  categoryPillSelected: {
    backgroundColor: MeltuneColors.charcoal,
    borderColor: MeltuneColors.charcoal,
  },
  categoryPillText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.medium,
    color: MeltuneColors.charcoal,
  },
  categoryPillTextSelected: {
    color: MeltuneColors.white,
    fontWeight: Typography.weight.bold,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  floatingCartBar: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: MeltuneColors.charcoal,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(216, 198, 174, 0.3)',
  },
  floatingCartInfo: {
    flex: 1,
  },
  floatingCartCount: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.champagne,
    letterSpacing: 0.5,
  },
  floatingCartTotal: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.white,
    marginTop: 1,
  },
  floatingCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: MeltuneColors.burntOrange,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
  floatingCartButtonPressed: {
    backgroundColor: MeltuneColors.orangePressed,
  },
  floatingCartButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
  },
});
