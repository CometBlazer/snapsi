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
  ranking_factors?: Record<string, unknown>;
  pricing_details?: Record<string, unknown>;
}

export interface DomainResponse {
  domains: DomainResult[];
  request_id: string;
  timestamp: string;
  search_summary: Record<string, unknown>;
}

export interface ApiError {
  detail: string | { error: string; message: string; retry_after?: number };
}

export class DomainAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async suggestDomains(request: DomainRequest): Promise<DomainResponse> {
    console.log(request);
    const response = await fetch(`${this.baseUrl}/api/domains/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(typeof error.detail === 'string' ? error.detail : error.detail.message);
    }

    return response.json();
  }

  async getHealth() {
    const response = await fetch(`${this.baseUrl}/api/health`);
    return response.json();
  }

  async getRateLimit() {
    const response = await fetch(`${this.baseUrl}/api/rate-limit`);
    return response.json();
  }

  async getExamples() {
    const response = await fetch(`${this.baseUrl}/api/examples`);
    return response.json();
  }

  async getPricing() {
    const response = await fetch(`${this.baseUrl}/api/pricing`);
    return response.json();
  }

  async getTLDs() {
    const response = await fetch(`${this.baseUrl}/api/tlds`);
    return response.json();
  }

  async getRanking() {
    const response = await fetch(`${this.baseUrl}/api/ranking`);
    return response.json();
  }
}

export const domainAPI = new DomainAPI();