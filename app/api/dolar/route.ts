import { NextResponse } from 'next/server';

const DOLAR_API_URL = 'https://criptoya.com/api/dolar';

export async function GET() {
  try {
    const response = await fetch(DOLAR_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; VentaAutos/1.0)',
      },
      // Server-side fetch doesn't have CORS issues
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
      },
    });
  } catch (error) {
    // Return fallback data with current approximate rates
    const fallbackData = {
      blue: {
        ask: 1325,
        bid: 1305,
        variation: 0,
        timestamp: Math.floor(Date.now() / 1000)
      },
      oficial: {
        price: 1335,
        variation: -0.37,
        timestamp: Math.floor(Date.now() / 1000)
      }
    };
    
    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60', // 1 minute cache for fallback
      },
    });
  }
}