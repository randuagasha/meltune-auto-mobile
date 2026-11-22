import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MeltuneColors } from '@/theme';

interface DividedListProps<T> {
  data: T[];
  renderItem: (item: T, index: number, isLast: boolean) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
  dividerColor?: string;
  withOuterBorders?: boolean;
}

export function DividedList<T>({
  data,
  renderItem,
  keyExtractor,
  dark = false,
  style,
  dividerColor,
  withOuterBorders = false,
}: DividedListProps<T>) {
  const line =
    dividerColor ||
    (dark ? 'rgba(216, 198, 174, 0.16)' : 'rgba(36, 37, 34, 0.1)');

  return (
    <View
      style={[
        styles.listContainer,
        withOuterBorders && {
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: line,
        },
        style,
      ]}
    >
      {data.map((item, index) => {
        const isLast = index === data.length - 1;
        const key = keyExtractor(item, index);
        return (
          <View key={key} style={styles.itemWrapper}>
            {renderItem(item, index, isLast)}
            {!isLast && <View style={[styles.divider, { backgroundColor: line }]} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
  },
  itemWrapper: {
    width: '100%',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});
