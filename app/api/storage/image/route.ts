import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    // Get the public URL from Supabase Storage
    const { data } = supabase.storage
      .from('venta-autos-images')
      .getPublicUrl(path);

    if (!data?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get image URL' },
        { status: 404 }
      );
    }

    // Redirect to the Supabase public URL
    return NextResponse.redirect(data.publicUrl);

  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}