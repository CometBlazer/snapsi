// src/routes/api/parse-input/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
const API_BASE_URL = 'https://domainsapi-271115130311.northamerica-northeast2.run.app';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/parse-input`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        'Cache-Control': 'private, no-cache'
      }
    });
  } catch (error) {
    console.error('Input parsing failed:', error);
    return json(
      { error: 'Failed to parse input' },
      { status: 500 }
    );
  }
};