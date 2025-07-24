// src/routes/api/health/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
const API_BASE_URL = 'https://domainsapi-271115130311.northamerica-northeast2.run.app';

export const GET: RequestHandler = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    
    return json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'public, max-age=60' // Cache for 1 minute
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return json(
      { error: 'Failed to connect to API' },
      { status: 503 }
    );
  }
};