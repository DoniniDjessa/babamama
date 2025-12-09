import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface Customer {
  id: string;
  auth_user_id: string;
  email: string;
  phone: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Create a customer record in ali-customers table
 */
export async function createCustomer(user: User, phone: string, name?: string) {
  const { data, error } = await supabase
    .from('ali-customers')
    .insert({
      auth_user_id: user.id,
      email: user.email || '',
      phone: phone,
      name: name || user.user_metadata?.name || '',
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get customer by auth user ID
 */
export async function getCustomerByAuthId(authUserId: string) {
  const { data, error } = await supabase
    .from('ali-customers')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single();

  return { data, error };
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  const { data, error } = await supabase
    .from('ali-customers')
    .select('*')
    .eq('email', email)
    .single();

  return { data, error };
}

/**
 * Get customer by phone
 */
export async function getCustomerByPhone(phone: string) {
  const { data, error } = await supabase
    .from('ali-customers')
    .select('*')
    .eq('phone', phone)
    .single();

  return { data, error };
}

/**
 * Update customer information
 */
export async function updateCustomer(authUserId: string, updates: Partial<Customer>) {
  const { data, error } = await supabase
    .from('ali-customers')
    .update(updates)
    .eq('auth_user_id', authUserId)
    .select()
    .single();

  return { data, error };
}

/**
 * Migrate existing user to ali-customers table
 * This function should be called for users who registered before ali-customers was created
 */
export async function migrateExistingUser(user: User) {
  // Check if customer already exists
  const { data: existing } = await getCustomerByAuthId(user.id);
  
  if (existing) {
    return { data: existing, error: null };
  }

  // Create customer record
  const phone = user.user_metadata?.phone || user.phone || '';
  const name = user.user_metadata?.name || '';
  
  return await createCustomer(user, phone, name);
}

