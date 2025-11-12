import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Order {
  id: string;
  order_number: string;
  client_name: string;
  company_name: string;
  products: Array<{ name: string; quantity: number; price: number }>;
  delivery_type: 'pickup' | 'delivery';
  comment?: string;
  status: 'pending' | 'accepted' | 'refused';
  refusal_message?: string;
  created_at: string;
  updated_at: string;
}
