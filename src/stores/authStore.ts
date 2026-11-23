import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { saveAuthToken, removeAuthToken } from '@/lib/secureStore';
import { clearQueryCache } from '@/lib/queryClient';
import { authApi, BackendUser } from '@/services/authApi';
import { UserProfile, UserRole } from '@/types';

export interface RegisterParams {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
  requiresEmailVerification?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;

  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (params: RegisterParams) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: UserProfile | null) => void;
}

let authSubscriptionInitialized = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  error: null,

  initializeAuth: async () => {
    // Register live auth state change listener once
    if (!authSubscriptionInitialized) {
      authSubscriptionInitialized = true;
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.access_token) {
          await saveAuthToken(session.access_token);
          set(state => ({
            token: session.access_token,
            isAuthenticated: true,
            user: state.user
              ? { ...state.user, id: session.user.id, email: session.user.email || state.user.email }
              : null,
          }));
        } else if (event === 'SIGNED_OUT') {
          await removeAuthToken();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      });
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token && session.user) {
        await saveAuthToken(session.access_token);

        try {
          // Verify with Express backend API
          const backendUser = await authApi.getCurrentUser(session.access_token);

          if (!backendUser.isActive) {
            await supabase.auth.signOut();
            await removeAuthToken();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isInitializing: false,
              error: 'Akun Anda dinonaktifkan. Silakan hubungi admin workshop.',
            });
            return;
          }

          set({
            user: {
              id: backendUser.id,
              email: backendUser.email,
              fullName: backendUser.fullName || session.user.user_metadata?.full_name || 'Pelanggan Meltune',
              phone: backendUser.phone || session.user.user_metadata?.phone,
              role: (backendUser.role as UserRole) || 'customer',
              isActive: backendUser.isActive,
            },
            token: session.access_token,
            isAuthenticated: true,
            isInitializing: false,
            error: null,
          });
          return;
        } catch {
          // If Express backend is temporarily unreachable, maintain Supabase session profile
          set({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Pelanggan Meltune',
              phone: session.user.user_metadata?.phone,
              role: 'customer',
              isActive: true,
            },
            token: session.access_token,
            isAuthenticated: true,
            isInitializing: false,
            error: null,
          });
          return;
        }
      }

      // No active session
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitializing: false,
      });
    } catch (err: any) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitializing: false,
        error: err?.message || 'Gagal memulihkan sesi autentikasi',
      });
    }
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        let errorMsg = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = 'Alamat email atau kata sandi tidak cocok. Silakan periksa kembali.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg = 'Alamat email belum dikonfirmasi. Silakan periksa kotak masuk atau spam email Anda.';
        }
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }

      if (!data.session || !data.user) {
        set({ isLoading: false, error: 'Gagal mendapatkan sesi login' });
        return { success: false, error: 'Gagal mendapatkan sesi login' };
      }

      const token = data.session.access_token;
      await saveAuthToken(token);

      // Verify with backend
      let profileUser: UserProfile;
      try {
        const backendUser = await authApi.getCurrentUser(token);
        if (!backendUser.isActive) {
          await supabase.auth.signOut();
          await removeAuthToken();
          const inactiveMsg = 'Akun Anda dinonaktifkan. Silakan hubungi admin workshop MELTUNE AUTO.';
          set({ isLoading: false, error: inactiveMsg });
          return { success: false, error: inactiveMsg };
        }

        profileUser = {
          id: backendUser.id,
          email: backendUser.email,
          fullName: backendUser.fullName || data.user.user_metadata?.full_name || 'Pelanggan Meltune',
          phone: backendUser.phone || data.user.user_metadata?.phone,
          role: (backendUser.role as UserRole) || 'customer',
          isActive: backendUser.isActive,
        };
      } catch {
        // Fallback to Supabase user metadata
        profileUser = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Pelanggan Meltune',
          phone: data.user.user_metadata?.phone,
          role: 'customer',
          isActive: true,
        };
      }

      set({
        user: profileUser,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (err: any) {
      const msg = err?.message || 'Terjadi kesalahan sistem saat proses masuk';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  register: async (params: RegisterParams): Promise<AuthResponse> => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim(),
        password: params.password,
        options: {
          data: {
            full_name: params.fullName.trim(),
            phone: params.phone.trim(),
          },
        },
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        // Auto-confirmed / immediate session
        const token = data.session.access_token;
        await saveAuthToken(token);

        let profileUser: UserProfile;
        try {
          const backendUser = await authApi.getCurrentUser(token);
          profileUser = {
            id: backendUser.id,
            email: backendUser.email,
            fullName: backendUser.fullName || params.fullName,
            phone: backendUser.phone || params.phone,
            role: (backendUser.role as UserRole) || 'customer',
            isActive: backendUser.isActive,
          };
        } catch {
          profileUser = {
            id: data.user.id,
            email: data.user.email || params.email,
            fullName: params.fullName,
            phone: params.phone,
            role: 'customer',
            isActive: true,
          };
        }

        set({
          user: profileUser,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true, requiresEmailVerification: false };
      }

      // Email confirmation link was sent
      set({ isLoading: false, error: null });
      return {
        success: true,
        requiresEmailVerification: true,
        message:
          'Pendaftaran berhasil! Tautan konfirmasi telah dikirimkan ke email Anda. Silakan verifikasi email Anda sebelum masuk.',
      };
    } catch (err: any) {
      const msg = err?.message || 'Terjadi kesalahan saat pendaftaran';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const currentToken = get().token;
      if (currentToken) {
        await authApi.logout(currentToken);
      }
      await supabase.auth.signOut();
      await removeAuthToken();
      clearQueryCache();
    } catch {
      clearQueryCache();
    } finally {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
  setUser: user => set({ user }),
}));
