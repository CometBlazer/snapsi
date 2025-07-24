// src/routes/api/domains/suggest/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const EXTERNAL_API_URL = 'https://domainsapi-271115130311.northamerica-northeast2.run.app';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const requestBody = await request.json();
    // This will show up in your SvelteKit/Vite terminal, not the browser console
    console.log('[PROXY] Received request from client:', JSON.stringify(requestBody, null, 2));

    const externalApiResponse = await fetch(`${EXTERNAL_API_URL}/api/domains/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SvelteKit-Proxy/1.0', // Some APIs require a User-Agent
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`[PROXY] External API responded with status: ${externalApiResponse.status}`);
    
    // Get the response as raw text first to prevent JSON parsing errors
    const responseText = await externalApiResponse.text(); 
    
    if (!externalApiResponse.ok) {
        console.error('[PROXY] External API returned an error response body:', responseText);
        
        // Forward the exact error response to the browser
        // We set Content-Type header to ensure browser interprets it correctly
        return new Response(responseText, { 
            status: externalApiResponse.status,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    console.log('[PROXY] External API call was successful. Forwarding response.');
    
    return new Response(responseText, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'private, no-cache'
        }
    });

  } catch (error) {
    console.error('[PROXY] A critical error occurred in the proxy logic itself:', error);
    return json(
      { error: 'The API proxy encountered a critical internal error.' },
      { status: 500 }
    );
  }
};