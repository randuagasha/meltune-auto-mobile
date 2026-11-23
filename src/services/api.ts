import { apiClient } from './apiClient';
import { supabase } from '@/lib/supabase';
import {
  Vehicle,
  ServiceItem,
  Booking,
  ProductItem,
  Order,
  LoyaltyProfile,
  RewardItem,
  NotificationItem,
} from '@/types';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

export const api = {
  // 1. Vehicles
  vehicles: {
    getAll: async (): Promise<Vehicle[]> => {
      const res = await apiClient.get<ApiResponse<Vehicle[]>>('/vehicles');
      return res.data.data;
    },
    getById: async (id: string): Promise<Vehicle | undefined> => {
      const all = await api.vehicles.getAll();
      return all.find(v => v.id === id);
    },
    create: async (data: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> => {
      const res = await apiClient.post<ApiResponse<Vehicle>>('/vehicles', data);
      return res.data.data;
    },
    update: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
      const res = await apiClient.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data);
      return res.data.data;
    },
    delete: async (id: string): Promise<boolean> => {
      await apiClient.delete(`/vehicles/${id}`);
      return true;
    },
  },

  // 2. Services
  services: {
    getAll: async (): Promise<ServiceItem[]> => {
      const res = await apiClient.get<ApiResponse<ServiceItem[]>>('/services');
      return res.data.data;
    },
    getById: async (id: string): Promise<ServiceItem> => {
      const res = await apiClient.get<ApiResponse<ServiceItem>>(`/services/${id}`);
      return res.data.data;
    },
  },

  // 3. Bookings
  bookings: {
    getAll: async (): Promise<Booking[]> => {
      const res = await apiClient.get<ApiResponse<Booking[]>>('/bookings');
      return res.data.data;
    },
    getById: async (id: string): Promise<Booking> => {
      const res = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
      return res.data.data;
    },
    getAvailableSlots: async (date: string): Promise<{ date: string; slots: Array<{ slot: string; available: boolean; capacity: number; remaining: number }> }> => {
      const res = await apiClient.get<ApiResponse<any>>(`/bookings/available-slots?date=${encodeURIComponent(date)}`);
      return res.data.data;
    },
    create: async (data: {
      vehicleId: string;
      vehicleName?: string;
      licensePlate?: string;
      serviceIds: string[];
      serviceNames?: string[];
      totalPrice: number;
      totalDurationMinutes: number;
      scheduledDate: string;
      scheduledTimeSlot: string;
      problemDescription: string;
      photoUrls?: string[];
    }): Promise<Booking> => {
      const res = await apiClient.post<ApiResponse<Booking>>('/bookings', data);
      return res.data.data;
    },
    cancel: async (id: string, rejectionReason?: string): Promise<Booking> => {
      const res = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, {
        status: 'cancelled',
        rejectionReason: rejectionReason || 'Dibatalkan oleh pelanggan melalui aplikasi mobile',
      });
      return res.data.data;
    },
  },

  // 4. Products
  products: {
    getAll: async (params?: { category?: string; search?: string }): Promise<ProductItem[]> => {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      const qs = query.toString();
      const res = await apiClient.get<ApiResponse<ProductItem[]>>(`/products${qs ? `?${qs}` : ''}`);
      return res.data.data;
    },
    getById: async (id: string): Promise<ProductItem> => {
      const res = await apiClient.get<ApiResponse<ProductItem>>(`/products/${id}`);
      return res.data.data;
    },
  },

  // 5. Orders
  orders: {
    getAll: async (): Promise<Order[]> => {
      const res = await apiClient.get<ApiResponse<Order[]>>('/orders');
      return res.data.data;
    },
    create: async (data: {
      items: Array<{ productId: string; productName?: string; price: number; quantity: number }>;
      shippingMethod: 'workshop_pickup' | 'express_courier';
      shippingAddress?: string;
      paymentMethod: 'qris' | 'bank_transfer' | 'workshop_cash';
    }): Promise<Order> => {
      const res = await apiClient.post<ApiResponse<Order>>('/orders', data);
      return res.data.data;
    },
  },

  // 6. Loyalty
  loyalty: {
    getProfile: async (): Promise<LoyaltyProfile> => {
      const res = await apiClient.get<ApiResponse<LoyaltyProfile>>('/loyalty/profile');
      return res.data.data;
    },
    getRewards: async (): Promise<RewardItem[]> => {
      const res = await apiClient.get<ApiResponse<RewardItem[]>>('/loyalty/rewards');
      return res.data.data;
    },
    checkIn: async (): Promise<{ pointsEarned: number; currentPoints: number; currentStreak: number; message: string; success: boolean }> => {
      try {
        const res = await apiClient.post<ApiResponse<any>>('/loyalty/check-in', {});
        return { ...res.data.data, success: true };
      } catch (err: any) {
        return {
          pointsEarned: 0,
          currentPoints: 0,
          currentStreak: 0,
          message: err?.response?.data?.message || err?.message || 'Check-in loyalty gagal diproses.',
          success: false,
        };
      }
    },
    redeem: async (rewardId: string): Promise<{ success: boolean; message: string; code?: string }> => {
      try {
        const res = await apiClient.post<ApiResponse<any>>('/loyalty/redeem', { rewardId });
        return {
          success: true,
          message: res.data.message || 'Reward berhasil ditukar',
          code: res.data.data?.redemptionCode,
        };
      } catch (err: any) {
        return {
          success: false,
          message: err?.response?.data?.message || err?.message || 'Gagal menukarkan reward.',
        };
      }
    },
  },

  // 7. Notifications
  notifications: {
    getAll: async (): Promise<NotificationItem[]> => {
      try {
        const res = await apiClient.get<ApiResponse<NotificationItem[]>>('/notifications');
        return res.data.data;
      } catch {
        return [];
      }
    },
  },
};
