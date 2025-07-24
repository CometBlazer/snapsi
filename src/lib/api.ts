// src/lib/api.ts - API client
export const API_BASE_URL = 'https://domainsapi-271115130311.northamerica-northeast2.run.app';

export interface DomainRequest {
  input_text: string;
  input_type?: 'idea' | 'exact_name' | 'base_name';
  field?: string;
  style?: 'short' | 'brandable' | 'keyword' | 'creative' | 'professional';
  domain_preference?: string;
  provider_preference?: 'name.com' | 'porkbun' | 'any';
  max_price?: number;
  num_choices?: number;
  additional_domains?: string[];
}

export interface DomainResult {
  domain: string;
  available: boolean;
  price_first_year?: number;
  price_annual?: number;
  registrar: string;
  deal_info?: string;
  score: number;
  input_source: string;
  ranking_factors?: Record<string, any>;
  pricing_details?: Record<string, any>;
}

export interface DomainResponse {
  domains: DomainResult[];
  request_id: string;
  timestamp: string;
  search_summary: Record<string, any>;
}

export interface ApiError {
  error?: string;
  detail?: string | { error: string; message: string; retry_after?: number };
}

export class DomainAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async suggestDomains(request: DomainRequest): Promise<DomainResponse> {
    console.log('🚀 Making request to:', `${this.baseUrl}/api/domains/suggest`);
    console.log('📦 Request data:', request);
    
    const response = await fetch(`${this.baseUrl}/api/domains/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      try {
        const error: ApiError = JSON.parse(errorText);
        const message = error.detail 
          ? (typeof error.detail === 'string' ? error.detail : error.detail.message)
          : error.error || 'Unknown error occurred';
        throw new Error(message);
      } catch (parseError) {
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('✅ Success! Got domains:', data.domains?.length || 0);
    return data;
  }

  async getHealth() {
    console.log('🔍 Checking health at:', `${this.baseUrl}/api/health`);
    const response = await fetch(`${this.baseUrl}/api/health`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async getRateLimit() {
    const response = await fetch(`${this.baseUrl}/api/rate-limit`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async getExamples() {
    const response = await fetch(`${this.baseUrl}/api/examples`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async getPricing() {
    const response = await fetch(`${this.baseUrl}/api/pricing`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async getTLDs() {
    const response = await fetch(`${this.baseUrl}/api/tlds`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async getRanking() {
    const response = await fetch(`${this.baseUrl}/api/ranking`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async testProviders() {
    const response = await fetch(`${this.baseUrl}/api/test-providers`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async parseInput(request: DomainRequest) {
    const response = await fetch(`${this.baseUrl}/api/parse-input`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
}

export const domainAPI = new DomainAPI();