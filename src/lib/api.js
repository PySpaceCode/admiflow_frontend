/**
 * API Helper — AdmitFlow / InterviewAI
 * All fetch calls go through here.
 * Backend: https://productionai1.onrender.com
 * Routes are at root level (e.g. /register, /login, /me)
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://productionai1.onrender.com';

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
    // Browser sets Content-Type + boundary automatically for FormData
    if (body) options.body = body;
  }

  try {
    console.log(`[API] ${method} ${BASE_URL}${path}`, body);
    const res = await fetch(`${BASE_URL}${path}`, options);
    console.log(`[API] Response ${res.status}`, res.ok);

    // Parse body (may be empty on some endpoints)
    let data;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text };
    }

    if (!res.ok) {
      // FastAPI 422 → detail is an array of field errors
      if (res.status === 422 && Array.isArray(data.detail)) {
        const messages = data.detail.map((err) => {
          const field = err.loc?.[err.loc.length - 1] || 'field';
          return `${field}: ${err.msg}`;
        });
        throw new Error(messages.join(' · '));
      }

      const errorMsg =
        typeof data.detail === 'string'
          ? data.detail
          : data.message || res.statusText;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    if (
      error.name === 'TypeError' &&
      error.message.toLowerCase().includes('failed to fetch')
    ) {
      throw new Error(
        `Cannot reach server. Make sure the backend is running at ${BASE_URL}`
      );
    }
    console.error(`[API] [${method} ${path}]:`, error.message);
    throw error;
  }
}

export const api = {
  get:    (path)                   => request('GET',    path),
  post:   (path, body, isFormData) => request('POST',   path, body, isFormData),
  put:    (path, body)             => request('PUT',    path, body),
  patch:  (path, body)             => request('PATCH',  path, body),
  delete: (path)                   => request('DELETE', path),
};
