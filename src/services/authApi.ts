import { apiClient } from './apiClient';
import { UserProfile, UserRole } from '@/types';

export interface BackendUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  isActive: boolean;
}

export interface AuthMeResponse {
  status: 'success' | 'error';
  data: {
    user: BackendUser;
  };
  message: string;
}

export interface AuthLogoutResponse {
  status: 'success' | 'error';
  data: {
    loggedOut: boolean;
  };
  message: string;
}

export interface UpdateProfileResponse {
  status: 'success' | 'error';
  data: {
    id: string;
    fullName: string;
    phone?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  };
  message: string;
}

export const authApi = {
  /**
   * Fetch authoritative current user profile from Express backend
   */
  async getCurrentUser(token?: string): Promise<BackendUser> {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await apiClient.get<AuthMeResponse>('/auth/me', { headers });
    return response.data.data.user;
  },

  /**
   * Request backend session invalidation / audit logging
   */
  async logout(token?: string): Promise<boolean> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await apiClient.post<AuthLogoutResponse>('/auth/logout', {}, { headers });
      return response.data.data?.loggedOut ?? true;
    } catch {
      // Return true even if backend server is unreachable so client-side logout completes
      return true;
    }
  },

  /**
   * Update profile information via Express backend
   */
  async updateProfile(
    data: { fullName?: string; phone?: string },
    token?: string
  ): Promise<UpdateProfileResponse['data']> {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await apiClient.post<UpdateProfileResponse>('/auth/profile', data, { headers });
    return response.data.data;
  },
};
