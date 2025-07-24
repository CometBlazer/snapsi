// src/routes/api/rate-limit/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
const API_BASE_URL = 'https://domainsapi-271115130311.northamerica-northeast2.run.app';

export const GET: RequestHandler = async ({ request }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rate-limit`, {
      headers: {
        // Forward user's IP for accurate rate limit info
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || 
                          request.headers.get('x-real-ip') || 
                          'unknown'
      }
    });
    
    const data = await response.json();
    
    return json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'private, no-cache' // Don't cache rate limit info
      }
    });
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return json(
      { error: 'Failed to check rate limit' },
      { status: 503 }
    );
  }
};