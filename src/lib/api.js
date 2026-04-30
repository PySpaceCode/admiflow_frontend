/**
 * API Helper — AdmitFlow
 * Backend: https://admitflow-rbzm.onrender.com/api
 * Handles wrapped { success, message, data } responses from FastAPI.
 */

let BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admitflow-rbzm.onrender.com/api';
if (!BASE_URL.endsWith('/api')) {
  if (BASE_URL.endsWith('/')) {
    BASE_URL = BASE_URL.slice(0, -1);
  }
  BASE_URL = `${BASE_URL}/api`;
}


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

      // Wrapped error: { success: false, message: "...", data: null }
      const errorMsg =
        data.message ||
        (typeof data.detail === 'string' ? data.detail : null) ||
        res.statusText ||
        'Request failed';
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
};
