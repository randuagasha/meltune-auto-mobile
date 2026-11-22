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
        Shadows.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.imageContainer}>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <View style={styles.placeholder} />
        )}

        {product.partNumber && (
          <View style={styles.partNumberTag}>
            <Text style={styles.partNumberText}>{product.partNumber}</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.categoryTag}>
          {product.category.replace('_', ' ').toUpperCase()}
        </Text>

        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>HARGA OEM</Text>
            <Text style={styles.price}>
              Rp {product.price.toLocaleString('id-ID')}
            </Text>
          </View>

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
              accessibilityLabel={`Add ${product.name} to cart`}
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
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    overflow: 'hidden',
    width: '48%',
    marginBottom: Spacing.md,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.985 }],
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
  },
  partNumberTag: {
    position: 'absolute',
    top: Spacing.xs,
    left: Spacing.xs,
    backgroundColor: 'rgba(36, 37, 34, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  partNumberText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 8,
    color: MeltuneColors.champagne,
    fontWeight: Typography.weight.bold,
  },
  body: {
    padding: Spacing.sm,
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryTag: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    lineHeight: 16,
    minHeight: 32,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: MeltuneColors.borderLight,
  },
  priceLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 8,
    color: MeltuneColors.textMutedLight,
  },
  price: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.extrabold,
    color: MeltuneColors.burntOrange,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
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
