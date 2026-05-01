/**
 * API Helper — AdmitFlow
 * Backend: https://admitflow-rbzm.onrender.com/api
 * Handles wrapped { success, message, data } responses from FastAPI.
 */

let BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admitflow-rbzm.onrender.com';
// Normalize: remove trailing / or /api so components can use full /api/... paths safely
if (BASE_URL.endsWith('/')) BASE_URL = BASE_URL.slice(0, -1);
if (BASE_URL.endsWith('/api')) BASE_URL = BASE_URL.slice(0, -4);
if (BASE_URL.endsWith('/')) BASE_URL = BASE_URL.slice(0, -1);

// We will now use full paths (like /api/register) in the components for clarity






async function request(method, path, body = null, isFormData = false) {
  const options = {
    method,
    headers: {},
  };

  // Attach JWT token if present
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData) {
    options.headers['Content-Type'] = 'application/json';
    if (body) options.body = JSON.stringify(body);
  } else {
    if (body) options.body = body;
  }

  try {
    console.log(`[API] ${method} ${BASE_URL}${path}`, body);
    const res = await fetch(`${BASE_URL}${path}`, options);
    console.log(`[API] Response status: ${res.status}`);

    // Parse the response body always
    let data;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text };
    }

    console.log(`[API] Response body:`, data);

    // This backend always wraps: { success, message, data }
    // For error responses, extract the message and throw
    if (!res.ok) {
      // FastAPI 422 validation error
      if (res.status === 422) {
        const details = data.details || data.detail;
        if (Array.isArray(details)) {
          const messages = details.map((err) => {
            if (typeof err === 'string') return err;
            const field = err.loc?.[err.loc.length - 1] || 'field';
            return `${field}: ${err.msg}`;
          });
          throw new Error(messages.join(' · '));
        }
      }

      // Standardize error responses
      let errorMsg = data.message || res.statusText || 'Request failed';
      
      // If we have detailed crash info from the middleware, include it for debugging
      if (data.data && typeof data.data === 'object' && data.data.error) {
        errorMsg = `${errorMsg}: ${data.data.error}`;
      }
      
      throw new Error(errorMsg);
    }

    // Return the full parsed body (caller handles success/data)
    return data;
  } catch (error) {
    if (
      error.name === 'TypeError' &&
      error.message.toLowerCase().includes('failed to fetch')
    ) {
      throw new Error(
        'Cannot reach server. The backend may be starting up — please try again in a moment.'
      );
    }
    console.error(`[API] [${method} ${path}]:`, error.message);
    throw error;
  }
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body, isFormData) => request('POST', path, body, isFormData),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
  logout: async () => {
    try {
      await request('POST', '/api/auth/logout');
    } catch (err) {
      console.warn('[API] Logout request failed:', err);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        // Clear auth cookie for middleware
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    }
  }
};
