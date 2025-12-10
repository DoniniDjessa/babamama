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
 * Normalize phone number - same logic as in checkout
 */
function normalizePhoneForOrder(phone: string): string {
  // Same normalization as in checkout page
  return phone.replace(/\s|-|\(|\)/g, '');
}

/**
 * Get orders by customer phone number
 * Tries multiple phone number formats to match orders
 */
export async function getOrdersByPhone(phone: string) {
  if (!phone || phone.trim() === '') {
    return { data: [], error: null };
  }

  // Normalize phone: remove spaces, dashes, parentheses (same as checkout)
  const normalizedPhone = normalizePhoneForOrder(phone);
  
  // Generate all possible variants
  const phoneVariants = new Set<string>();
  
  // Add original
  phoneVariants.add(phone);
  
  // Add normalized (no spaces/dashes/parentheses)
  phoneVariants.add(normalizedPhone);
  
  // Add with + prefix if not present
  if (!normalizedPhone.startsWith('+')) {
    phoneVariants.add(`+${normalizedPhone}`);
  }
  
  // Add without + prefix
  const withoutPlus = normalizedPhone.replace(/^\+/, '');
  phoneVariants.add(withoutPlus);
  
  // Also try with country code variations (for CI: +225 or 225)
  if (withoutPlus.startsWith('225')) {
    phoneVariants.add(withoutPlus);
    phoneVariants.add(`+${withoutPlus}`);
  } else if (withoutPlus.startsWith('0')) {
    // If starts with 0, try with 225 prefix
    const withCountryCode = `225${withoutPlus.substring(1)}`;
    phoneVariants.add(withCountryCode);
    phoneVariants.add(`+${withCountryCode}`);
  }

  const variantsArray = Array.from(phoneVariants);
  
  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Searching orders with phone variants:', { 
      original: phone, 
      normalized: normalizedPhone,
      variants: variantsArray 
    });
  }

  // Try exact matches first (more efficient)
  let { data, error } = await supabase
    .from('ali-orders')
    .select('*')
    .in('customer_phone', variantsArray)
    .order('created_at', { ascending: false });

  // If no exact matches, try partial matches (ilike)
  if ((!data || data.length === 0) && variantsArray.length > 0) {
    // Build OR query for partial matches
    const orConditions = variantsArray
      .map(v => `customer_phone.ilike.%${v}%`)
      .join(',');
    
    const { data: partialData, error: partialError } = await supabase
      .from('ali-orders')
      .select('*')
      .or(orConditions)
      .order('created_at', { ascending: false });
    
    if (partialData && partialData.length > 0) {
      data = partialData;
      error = partialError;
    }
  }

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Orders query result:', { 
      found: data?.length || 0, 
      error: error?.message,
      variants: variantsArray 
    });
  }

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

