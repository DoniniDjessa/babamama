import { supabase } from './supabase';
import { createCustomer } from './customers';

export interface AuthCredentials {
  emailOrPhone: string;
  password: string;
}

export interface RegisterData {
  phone: string;
  email: string;
  password: string;
  name?: string;
}

/**
 * Check if the input is an email or phone number
 */
export function isEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

/**
 * Normalize phone number (remove spaces, dashes, etc.)
 * Handles international format (E.164) - keeps the + prefix if present
 */
export function normalizePhone(phone: string): string {
  // If phone already has + prefix (E.164 format), keep it
  if (phone.startsWith('+')) {
    return phone.replace(/\s|-|\(|\)/g, '');
  }
  // Otherwise, normalize and add + if it's a valid international number
  const cleaned = phone.replace(/\s|-|\(|\)/g, '');
  // If it starts with a country code (like 225 for CI), add +
  if (cleaned.length > 9 && !cleaned.startsWith('+')) {
    return '+' + cleaned;
  }
  return cleaned;
}

/**
 * Sign up a new user with both phone and email
 * Note: Supabase doesn't support phone + password auth, so we only use email for auth
 * and store phone in user metadata
 * Also creates a record in ali-customers table
 */
export async function signUp(data: RegisterData) {
  const { phone, email, password, name } = data;
  
  // Registration requires both phone and email
  // Store phone in metadata, but only use email for authentication
  const normalizedPhone = normalizePhone(phone);
  const { data: authData, error } = await supabase.auth.signUp({
    email: email,
    password,
    options: {
      data: {
        name: name || '',
        phone: normalizedPhone,
      },
    },
  });

  // If signup successful and user is created, save to ali-customers table
  if (authData?.user && !error) {
    const { error: customerError } = await createCustomer(
      authData.user,
      normalizedPhone,
      name
    );
    
    // If customer creation fails, log but don't fail the signup
    if (customerError) {
      console.error('Error creating customer record:', customerError);
    }
  }

  return { data: authData, error };
}

/**
 * Sign in a user with email or phone
 * If phone is provided, we find the user's email from their metadata via API
 */
export async function signIn(credentials: AuthCredentials) {
  const { emailOrPhone, password } = credentials;
  
  if (isEmail(emailOrPhone)) {
    // Sign in with email directly
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailOrPhone,
      password,
    });
    return { data, error };
  } else {
    // User provided a phone number
    // Find the user's email by phone number
    const normalizedPhone = normalizePhone(emailOrPhone);
    
    try {
      const response = await fetch('/api/auth/find-user-by-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: {
            message: result.error || 'Aucun utilisateur trouvé avec ce numéro de téléphone',
            name: 'UserNotFound',
            status: response.status,
          } as Error,
        };
      }

      // Now sign in with the found email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: result.email,
        password,
      });
      return { data, error };
    } catch (err) {
      return {
        data: null,
        error: {
          message: 'Une erreur est survenue lors de la recherche de votre compte',
          name: 'SignInError',
          status: 500,
        } as Error,
      };
    }
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  return await supabase.auth.signOut();
}

/**
 * Get the current session
 */
export async function getSession() {
  return await supabase.auth.getSession();
}

/**
 * Get the current user
 */
export async function getUser() {
  return await supabase.auth.getUser();
}

