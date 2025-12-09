import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { migrateExistingUser } from '@/lib/customers';

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Migrate the user
    const { data, error } = await migrateExistingUser(session.user);

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la migration' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      customer: data,
      message: 'Utilisateur migré avec succès' 
    });
  } catch (error) {
    console.error('Error migrating user:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

