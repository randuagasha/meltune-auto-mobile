import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Plus, Check } from 'lucide-react-native';
import { ProductItem } from '@/types';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

interface ProductCardProps {
  product: ProductItem;
  onPress: () => void;
  onAddToCart?: () => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  isInCart = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        Shadows.subtle,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Produk ${product.name}`}
    >
      {/* Product Image Area */}
      <View style={styles.imageContainer}>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>OEM</Text>
          </View>
        )}
      </View>

      {/* Product Details */}
      <View style={styles.body}>
        <Text style={styles.categoryLabel}>
          {product.category.replace('_', ' ')}
        </Text>

        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            Rp {product.price.toLocaleString('id-ID')}
          </Text>

          {onAddToCart && (
            <Pressable
              onPress={e => {
                e.stopPropagation();
                onAddToCart();
              }}
              style={({ pressed }) => [
                styles.addButton,
                isInCart && styles.addButtonActive,
                pressed && styles.addButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Tambah ${product.name} ke keranjang`}
              hitSlop={8}
            >
              {isInCart ? (
                <Check size={16} color={MeltuneColors.white} />
              ) : (
                <Plus size={16} color={MeltuneColors.white} />
              )}
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.08)',
    overflow: 'hidden',
    width: '47.5%',
    marginBottom: Spacing.xl, // 24px between product rows
  },
  cardPressed: {
    opacity: 0.98,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: MeltuneColors.surfaceLightElevated,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: MeltuneColors.surfaceLightElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 12,
    color: MeltuneColors.textMutedLight,
    fontWeight: Typography.weight.bold,
  },
  body: {
    padding: Spacing.md,
    justifyContent: 'space-between',
    flex: 1,
  },
  categoryLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption, // 13-14px
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.charcoal,
    lineHeight: 18,
    minHeight: 36,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
  },
  price: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    flex: 1,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: MeltuneColors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonActive: {
    backgroundColor: MeltuneColors.statusSuccess,
  },
  addButtonPressed: {
    backgroundColor: MeltuneColors.burntOrange,
  },
});
