import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { ExpoSecureStoreAdapter } from './secureStore';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://kqcdkbtloumcirzhbnwh.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_SSwcYGlA3U_-oPIFkoJumA_vxRnLodw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
