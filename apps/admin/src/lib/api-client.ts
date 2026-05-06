const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

function getToken() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('merma-admin-auth');
    return raw ? JSON.parse(raw)?.token : null;
  } catch {
    return null;
  }
}

export async function adminFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    throw new Error('Credenciales incorrectas o sesión expirada');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(err.message ?? 'Error en la petición');
  }

  return res.json();
}
