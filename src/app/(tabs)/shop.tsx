import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { AmbientGradientShell } from '@/components/layout/AmbientGradientShell';
import { ProductCard } from '@/components/product/ProductCard';
import { PREVIEW_PRODUCTS } from '@/services/previewData';
import { useProductsQuery } from '@/hooks/useWorkshopData';
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

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: products = [], refetch } = useProductsQuery({
    category: selectedCategory,
    search: search.trim() || undefined,
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const { items, addItem, getTotalCount, getTotalAmount } = useCartStore();
  const totalCartCount = getTotalCount();
  const totalCartAmount = getTotalAmount();

  const filteredProducts = products.filter(p => {
    const matchCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.partNumber && p.partNumber.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/shop/cart')}
      style={({ pressed }) => [
        styles.cartHeaderButton,
        pressed && styles.cartHeaderButtonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Buka Keranjang"
      hitSlop={10}
    >
      <ShoppingBag size={20} color={MeltuneColors.white} />
      {totalCartCount > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <AmbientGradientShell
      tag="KATALOG SUKU CADANG"
      title="Toko Suku Cadang"
      subtitle="Pelumas performa dan suku cadang asli OEM"
      headerRight={renderHeaderRight()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={MeltuneColors.burntOrange}
        />
      }
    >
      {/* 1. Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={18} color={MeltuneColors.textMutedLight} />
          <TextInput
            placeholder="Cari oli mesin, kampas rem, filter udara..."
            placeholderTextColor={MeltuneColors.textMutedLight}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* 2. Category Filter Tabs */}
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryTab,
                  isSelected && styles.categoryTabSelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    isSelected && styles.categoryTabTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Product Results Header */}
      <View style={styles.resultsHeaderRow}>
        <Text style={styles.resultsTitle}>
          {selectedCategory === 'all'
            ? 'Katalog Produk'
            : CATEGORIES.find(c => c.id === selectedCategory)?.label}
        </Text>
        <Text style={styles.resultsCount}>{filteredProducts.length} Produk</Text>
      </View>

      {/* 4. Product Items Grid */}
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

      {/* Floating Cart Checkout Bar (When Cart Has Items) */}
      {totalCartCount > 0 && (
        <View
          style={[
            styles.floatingCartBar,
            Shadows.card,
            { bottom: 65 + Spacing.lg },
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
    </AmbientGradientShell>
  );
}

const styles = StyleSheet.create({
  cartHeaderButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartHeaderButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  cartBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: MeltuneColors.burntOrange,
    width: 16,
    height: 16,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
  },
  searchSection: {
    paddingHorizontal: Spacing.xl, // 24px consistent horizontal padding
    marginBottom: Spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.1)',
    paddingHorizontal: Spacing.lg,
    height: 48,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    color: MeltuneColors.charcoal,
  },
  categorySection: {
    marginBottom: Spacing.xl, // 24px
  },
  categoryList: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  categoryTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.08)',
  },
  categoryTabSelected: {
    backgroundColor: MeltuneColors.charcoal,
    borderColor: MeltuneColors.charcoal,
  },
  categoryTabText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.medium,
    color: MeltuneColors.textSecondaryLight,
  },
  categoryTabTextSelected: {
    color: MeltuneColors.white,
    fontWeight: Typography.weight.bold,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  resultsTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.headline,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
  },
  resultsCount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textMutedLight,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, // 24px
  },
  floatingCartBar: {
    position: 'absolute',
    left: Spacing.xl,
    right: Spacing.xl,
    backgroundColor: MeltuneColors.charcoal,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingCartInfo: {
    flex: 1,
  },
  floatingCartCount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.champagne,
  },
  floatingCartTotal: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.white,
    marginTop: 2,
  },
  floatingCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: MeltuneColors.burntOrange,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.xs,
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
