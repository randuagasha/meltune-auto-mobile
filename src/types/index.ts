export type UserRole = 'customer' | 'mechanic' | 'superadmin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  isActive?: boolean;
  avatarUrl?: string;
  createdAt?: string;
}

export type TransmissionType = 'automatic' | 'manual' | 'cvt' | 'dual-clutch';
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';

export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  transmission: TransmissionType;
  fuelType: FuelType;
  mileage?: number;
  color?: string;
  vin?: string;
  engineCode?: string;
  imageUrl?: string;
  lastServiceDate?: string;
  nextServiceMileage?: number;
  notes?: string;
  createdAt: string;
}

export type ServiceCategory = 'maintenance' | 'diagnostics' | 'repair' | 'detailing' | 'performance';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  estimatedDurationMinutes: number;
  imageUrl?: string;
  isActive: boolean;
  workbayRequirement?: string;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'waiting_for_parts'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface ServiceStage {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  timestamp?: string;
  technicianNotes?: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  userName: string;
  userPhone?: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  serviceIds: string[];
  serviceNames: string[];
  totalPrice: number;
  totalDurationMinutes: number;
  scheduledDate: string;
  scheduledTimeSlot: string;
  problemDescription: string;
  photoUrls?: string[];
  status: BookingStatus;
  workbayNumber?: string;
  assignedMechanic?: string;
  mechanicNotes?: string;
  rejectionReason?: string;
  stages?: ServiceStage[];
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory =
  | 'engine_oil'
  | 'car_care'
  | 'parts'
  | 'accessories'
  | 'maintenance';

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  isAvailable: boolean;
  partNumber?: string;
  specifications?: Record<string, string>;
  compatibility?: string[];
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'ready_for_pickup'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  partNumber?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userPhone?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  shippingMethod: 'workshop_pickup' | 'express_courier';
  shippingAddress?: string;
  paymentMethod: 'qris' | 'bank_transfer' | 'workshop_cash';
  status: OrderStatus;
  createdAt: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  stock: number;
  imageUrl: string;
  category?: 'discount' | 'service' | 'merchandise';
}

export interface LoyaltyProfile {
  userId: string;
  points: number;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate?: string;
  tierName: 'Precision Member' | 'Silver Collector' | 'Gold Master' | 'Apex VIP';
  redemptionHistory: Array<{
    id: string;
    rewardId: string;
    rewardTitle: string;
    pointsSpent: number;
    redeemedAt: string;
    code: string;
  }>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'maintenance' | 'loyalty' | 'order' | 'announcement';
  read: boolean;
  createdAt: string;
  referenceId?: string;
}

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'advisor' | 'mechanic';
  content: string;
  createdAt: string;
}

export interface SupportThread {
  id: string;
  customerId: string;
  customerName: string;
  vehicleModel?: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  lastActivity: string;
  messages: SupportMessage[];
}
