// src/routes/api/domains/suggest/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const API_BASE_URL = 'https://domainsapi-271115130311.northamerica-northeast2.run.app';

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Get the request body
    const body = await request.json();
    
    // Forward the request to your external API
    const response = await fetch(`${API_BASE_URL}/api/domains/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward user's IP for rate limiting
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || 
                          request.headers.get('x-real-ip') || 
                          'unknown'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    return json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'private, no-cache' // Don't cache domain searches
      }
    });
  } catch (error) {
    console.error('Domain search failed:', error);
    return json(
      { error: 'Failed to search domains' },
      { status: 500 }
    );
  }
};
