import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Home, Calendar, Car, ShoppingBag, User } from 'lucide-react-native';
import { MeltuneColors, Radius, Shadows, Spacing, Typography } from '@/theme';

export interface CustomTabBarProps {
  state: {
    index: number;
    routes: Array<{ key: string; name: string }>;
  };
  descriptors?: any;
  navigation?: {
    emit?: (event: any) => any;
    navigate?: (name: string) => void;
  };
  emitter?: any;
  navigateToTab?: (routeKey: string) => void;
  insets?: any;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  navigateToTab,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const tabsConfig = [
    { name: 'index', label: 'Home', icon: Home, route: '/' },
    { name: 'booking', label: 'Booking', icon: Calendar, route: '/booking' },
    { name: 'garage', label: 'Garage', icon: Car, route: '/garage' },
    { name: 'shop', label: 'Shop', icon: ShoppingBag, route: '/shop' },
    { name: 'profile', label: 'Profile', icon: User, route: '/profile' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.barInner}>
        {tabsConfig.map((tab, index) => {
          const isFocused = state.index === index;
          const Icon = tab.icon;

          const onPress = () => {
            if (navigation?.emit) {
              const event = navigation.emit({
                type: 'tabPress',
                target: state.routes[index]?.key || '',
                canPreventDefault: true,
              });

              if (!isFocused && !event?.defaultPrevented) {
                if (navigation.navigate) {
                  navigation.navigate(tab.name);
                } else if (navigateToTab && state.routes[index]?.key) {
                  navigateToTab(state.routes[index].key);
                }
              }
            } else if (!isFocused) {
              if (navigateToTab && state.routes[index]?.key) {
                navigateToTab(state.routes[index].key);
              } else {
                router.push(tab.route as any);
              }
            }
          };

          return (
            <Pressable
              key={tab.name}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={`Tab ${tab.label}`}
              style={styles.tabItem}
            >
              {isFocused && <View style={styles.activeIndicatorHairline} />}

              <View
                style={[
                  styles.iconBox,
                  isFocused && styles.iconBoxActive,
                ]}
              >
                <Icon
                  size={20}
                  color={
                    isFocused ? MeltuneColors.burntOrange : MeltuneColors.textMutedLight
                  }
                  strokeWidth={isFocused ? 2.3 : 1.8}
                />
              </View>

              <Text
                style={[
                  styles.label,
                  isFocused ? styles.labelActive : styles.labelInactive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: MeltuneColors.warmIvory,
    borderTopWidth: 1,
    borderTopColor: 'rgba(36, 37, 34, 0.08)',
    paddingTop: Spacing.sm, // Generous breathing room
    ...Shadows.subtle,
  },
  barInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 54,
    paddingHorizontal: Spacing.md,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  activeIndicatorHairline: {
    position: 'absolute',
    top: -Spacing.xs,
    left: '28%',
    right: '28%',
    height: 2.5,
    backgroundColor: MeltuneColors.burntOrange,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  iconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  iconBoxActive: {
    backgroundColor: 'rgba(217, 107, 58, 0.08)',
  },
  label: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    marginTop: 2,
  },
  labelActive: {
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.bold,
  },
  labelInactive: {
    color: MeltuneColors.textMutedLight,
    fontWeight: Typography.weight.medium,
  },
});
