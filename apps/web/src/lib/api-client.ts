const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Basic API client for Merma Marketplace.
 * Handles common fetch logic and typing.
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
}

export const catalogApi = {
  getProducts: (page = 1, limit = 20) => 
    apiFetch<any[]>(`/catalog?page=${page}&limit=${limit}`),
  
  searchProducts: (query: string, filter?: string) => 
    apiFetch<any>(`/catalog/search?q=${query}${filter ? `&filter=${filter}` : ''}`),
    
  getProduct: (id: string) => 
    apiFetch<any>(`/catalog/${id}`),
};
