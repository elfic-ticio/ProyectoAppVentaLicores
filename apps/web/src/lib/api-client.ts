// En Vercel: usa URL relativa — next.config.ts reescribe /api/v1/* → backend real.
// En local: NEXT_PUBLIC_API_URL apunta a http://localhost:3001/api/v1
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

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
