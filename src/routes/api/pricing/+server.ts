// src/routes/api/pricing/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$lib/api';

export const GET: RequestHandler = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pricing`);
    const data = await response.json();
    
    return json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('Pricing fetch failed:', error);
    return json(
      { error: 'Failed to fetch pricing' },
      { status: 503 }
    );
  }
};