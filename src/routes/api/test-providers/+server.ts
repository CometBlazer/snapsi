// src/routes/api/test-providers/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
const API_BASE_URL = 'https://domainsapi-271115130311.northamerica-northeast2.run.app';

export const GET: RequestHandler = async ({ request }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test-providers`, {
      headers: {
        // Forward user's IP for rate limiting
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || 
                          request.headers.get('x-real-ip') || 
                          'unknown'
      }
    });
    
    const data = await response.json();
    
    return json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'private, max-age=60' // Cache for 1 minute
      }
    });
  } catch (error) {
    console.error('Provider test failed:', error);
    return json(
      { error: 'Failed to test providers' },
      { status: 503 }
    );
  }
};