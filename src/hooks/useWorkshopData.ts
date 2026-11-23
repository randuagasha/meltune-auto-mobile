import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryClient, QueryKeys } from '@/lib/queryClient';
import {
  PREVIEW_VEHICLES,
  PREVIEW_SERVICES,
  PREVIEW_BOOKINGS,
  PREVIEW_PRODUCTS,
  PREVIEW_LOYALTY,
  PREVIEW_REWARDS,
  PREVIEW_NOTIFICATIONS,
} from '@/services/previewData';
import { Vehicle, ServiceItem, Booking, ProductItem, Order, LoyaltyProfile, RewardItem, NotificationItem } from '@/types';

// ==========================================
// 1. VEHICLES QUERIES & MUTATIONS
// ==========================================

export function useVehiclesQuery() {
  return useQuery<Vehicle[]>({
    queryKey: QueryKeys.vehicles,
    queryFn: async () => {
      try {
        const data = await api.vehicles.getAll();
        return Array.isArray(data) && data.length > 0 ? data : PREVIEW_VEHICLES;
      } catch {
        return PREVIEW_VEHICLES;
      }
    },
    initialData: PREVIEW_VEHICLES,
  });
}

export function useVehicleQuery(id?: string) {
  const { data: vehicles } = useVehiclesQuery();
  return useQuery<Vehicle | undefined>({
    queryKey: id ? QueryKeys.vehicle(id) : ['vehicles', 'none'],
    queryFn: async () => {
      if (!id) return undefined;
      try {
        const v = await api.vehicles.getById(id);
        return v || vehicles?.find(x => x.id === id);
      } catch {
        return vehicles?.find(x => x.id === id);
      }
    },
    enabled: Boolean(id),
  });
}

export function useCreateVehicleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Vehicle, 'id' | 'createdAt'>) => api.vehicles.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QueryKeys.vehicles });
    },
  });
}

export function useUpdateVehicleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vehicle> }) => api.vehicles.update(id, data),
    onSuccess: (_updated, variables) => {
      qc.invalidateQueries({ queryKey: QueryKeys.vehicles });
      qc.invalidateQueries({ queryKey: QueryKeys.vehicle(variables.id) });
    },
  });
}

export function useDeleteVehicleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.vehicles.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QueryKeys.vehicles });
    },
  });
}

// ==========================================
// 2. SERVICES QUERIES
// ==========================================

export function useServicesQuery() {
  return useQuery<ServiceItem[]>({
    queryKey: QueryKeys.services,
    queryFn: async () => {
      try {
        const data = await api.services.getAll();
        return Array.isArray(data) && data.length > 0 ? data : PREVIEW_SERVICES;
      } catch {
        return PREVIEW_SERVICES;
      }
    },
    initialData: PREVIEW_SERVICES,
  });
}

// ==========================================
// 3. BOOKINGS QUERIES & MUTATIONS
// ==========================================

export function useBookingsQuery() {
  return useQuery<Booking[]>({
    queryKey: QueryKeys.bookings,
    queryFn: async () => {
      try {
        const data = await api.bookings.getAll();
        return Array.isArray(data) && data.length > 0 ? data : PREVIEW_BOOKINGS;
      } catch {
        return PREVIEW_BOOKINGS;
      }
    },
    initialData: PREVIEW_BOOKINGS,
  });
}

export function useBookingQuery(id?: string) {
  const { data: bookings } = useBookingsQuery();
  return useQuery<Booking | undefined>({
    queryKey: id ? QueryKeys.booking(id) : ['bookings', 'none'],
    queryFn: async () => {
      if (!id) return undefined;
      try {
        const b = await api.bookings.getById(id);
        return b || bookings?.find(x => x.id === id);
      } catch {
        return bookings?.find(x => x.id === id);
      }
    },
    enabled: Boolean(id),
  });
}

export function useAvailableSlotsQuery(date: string) {
  return useQuery({
    queryKey: ['available-slots', date],
    queryFn: async () => {
      if (!date) return null;
      try {
        return await api.bookings.getAvailableSlots(date);
      } catch {
        return null;
      }
    },
    enabled: Boolean(date),
  });
}

export function useCreateBookingMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.bookings.create>[0]) => api.bookings.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QueryKeys.bookings });
    },
  });
}

export function useCancelBookingMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => api.bookings.cancel(id, reason),
    onSuccess: (_result, vars) => {
      qc.invalidateQueries({ queryKey: QueryKeys.bookings });
      qc.invalidateQueries({ queryKey: QueryKeys.booking(vars.id) });
    },
  });
}

// ==========================================
// 4. PRODUCTS QUERIES
// ==========================================

export function useProductsQuery(params?: { category?: string; search?: string }) {
  return useQuery<ProductItem[]>({
    queryKey: QueryKeys.products(params),
    queryFn: async () => {
      try {
        const data = await api.products.getAll(params);
        if (Array.isArray(data) && data.length > 0) return data;
        if (params?.category && params.category !== 'all') {
          return PREVIEW_PRODUCTS.filter(p => p.category === params.category);
        }
        return PREVIEW_PRODUCTS;
      } catch {
        if (params?.category && params.category !== 'all') {
          return PREVIEW_PRODUCTS.filter(p => p.category === params.category);
        }
        return PREVIEW_PRODUCTS;
      }
    },
    initialData: PREVIEW_PRODUCTS,
  });
}

export function useProductQuery(id?: string) {
  return useQuery<ProductItem | undefined>({
    queryKey: id ? QueryKeys.product(id) : ['products', 'none'],
    queryFn: async () => {
      if (!id) return undefined;
      try {
        const p = await api.products.getById(id);
        return p || PREVIEW_PRODUCTS.find(x => x.id === id);
      } catch {
        return PREVIEW_PRODUCTS.find(x => x.id === id);
      }
    },
    enabled: Boolean(id),
  });
}

// ==========================================
// 5. ORDERS QUERIES & MUTATIONS
// ==========================================

export function useOrdersQuery() {
  return useQuery<Order[]>({
    queryKey: QueryKeys.orders,
    queryFn: async () => {
      try {
        const data = await api.orders.getAll();
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    },
  });
}

export function useCreateOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.orders.create>[0]) => api.orders.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QueryKeys.orders });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ==========================================
// 6. LOYALTY QUERIES & MUTATIONS
// ==========================================

export function useLoyaltyProfileQuery() {
  return useQuery<LoyaltyProfile>({
    queryKey: QueryKeys.loyaltyProfile,
    queryFn: async () => {
      try {
        const data = await api.loyalty.getProfile();
        return data || PREVIEW_LOYALTY;
      } catch {
        return PREVIEW_LOYALTY;
      }
    },
    initialData: PREVIEW_LOYALTY,
  });
}

export function useLoyaltyRewardsQuery() {
  return useQuery<RewardItem[]>({
    queryKey: QueryKeys.loyaltyRewards,
    queryFn: async () => {
      try {
        const data = await api.loyalty.getRewards();
        return Array.isArray(data) && data.length > 0 ? data : PREVIEW_REWARDS;
      } catch {
        return PREVIEW_REWARDS;
      }
    },
    initialData: PREVIEW_REWARDS,
  });
}

export function useDailyCheckInMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.loyalty.checkIn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QueryKeys.loyaltyProfile });
    },
  });
}

export function useRedeemRewardMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rewardId: string) => api.loyalty.redeem(rewardId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QueryKeys.loyaltyProfile });
      qc.invalidateQueries({ queryKey: QueryKeys.loyaltyRewards });
    },
  });
}

// ==========================================
// 7. NOTIFICATIONS QUERY
// ==========================================

export function useNotificationsQuery() {
  return useQuery<NotificationItem[]>({
    queryKey: QueryKeys.notifications,
    queryFn: async () => {
      try {
        const data = await api.notifications.getAll();
        return Array.isArray(data) && data.length > 0 ? data : PREVIEW_NOTIFICATIONS;
      } catch {
        return PREVIEW_NOTIFICATIONS;
      }
    },
    initialData: PREVIEW_NOTIFICATIONS,
  });
}
