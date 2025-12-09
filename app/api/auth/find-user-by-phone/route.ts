import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedPhone = phone.replace(/\s|-|\(|\)/g, '');
    const phoneWithPlus = normalizedPhone.startsWith('+') 
      ? normalizedPhone 
      : '+' + normalizedPhone;

    // Use Supabase Admin API to search for user by phone in metadata
    // Note: This requires SUPABASE_SERVICE_ROLE_KEY in environment variables
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      );
    }

    // Create admin client
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // List all users and find the one with matching phone
    // Note: This is not efficient for large user bases, but works for now
    const { data: { users }, error } = await adminClient.auth.admin.listUsers();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Find user with matching phone in metadata
    const user = users.find(
      (u) => u.user_metadata?.phone === phoneWithPlus || 
             u.user_metadata?.phone === normalizedPhone
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Aucun utilisateur trouvé avec ce numéro de téléphone' },
        { status: 404 }
      );
    }

    return NextResponse.json({ email: user.email });
  } catch (error) {
    console.error('Error finding user by phone:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

