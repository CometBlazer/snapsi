// src/routes/api/examples/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const API_BASE_URL = 'https://domainsapi-271115130311.northamerica-northeast2.run.app';

export const GET: RequestHandler = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/examples`);
    const data = await response.json();
    
    return json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('Examples fetch failed:', error);
    return json(
      { error: 'Failed to fetch examples' },
      { status: 503 }
    );
  }
};