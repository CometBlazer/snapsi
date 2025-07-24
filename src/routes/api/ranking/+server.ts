// src/routes/api/ranking/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$lib/api';

export const GET: RequestHandler = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ranking`);
    const data = await response.json();
    
    return json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Ranking info fetch failed:', error);
    return json(
      { error: 'Failed to fetch ranking info' },
      { status: 503 }
    );
  }
};