import { supabase } from './supabase';

export interface OrderItem {
  product_id: string;
  title: string;
  price: number;
  qty: number;
}

export interface CreateOrderData {
  customer_name: string;
  customer_phone: string;
  delivery_address?: string;
  items: OrderItem[];
  total_amount_xof: number;
  payment_method: 'wave' | 'om' | 'cash' | 'pending';
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string | null;
  items: OrderItem[];
  total_amount_xof: number;
  payment_method: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  created_at: string;
}

/**
 * Create a new order
 */
export async function createOrder(data: CreateOrderData) {
  const { data: order, error } = await supabase
    .from('ali-orders')
    .insert({
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      delivery_address: data.delivery_address || null,
      items: data.items,
      total_amount_xof: data.total_amount_xof,
      payment_method: data.payment_method,
      status: 'pending',
    })
    .select()
    .single();

  return { data: order as Order | null, error };
}

/**
 * Get order by ID (for tracking)
 */
export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('ali-orders')
    .select('*')
    .eq('id', orderId)
    .single();

  return { data: data as Order | null, error };
}

/**
 * Get orders by customer phone number
 */
export async function getOrdersByPhone(phone: string) {
  const normalizedPhone = phone.replace(/\s|-|\(|\)/g, '');
  const { data, error } = await supabase
    .from('ali-orders')
    .select('*')
    .eq('customer_phone', normalizedPhone)
    .order('created_at', { ascending: false });

  return { data: data as Order[] | null, error };
}

/**
 * Get orders by customer email (via ali-customers)
 */
export async function getOrdersByCustomerEmail(email: string) {
  // First get customer by email
  const { data: customer } = await supabase
    .from('ali-customers')
    .select('phone')
    .eq('email', email)
    .single();

  if (!customer?.phone) {
    return { data: [], error: null };
  }

  return getOrdersByPhone(customer.phone);
}

