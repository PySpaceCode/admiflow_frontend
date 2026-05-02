/**
 * API Helper — Admission AI
 * All fetch calls go through here.
 * Handles FastAPI 422 validation errors, network errors, and JWT headers.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(method, path, body = null, isFormData = false) {
  const options = {
    method,
    headers: {},
  };

  // Attach JWT token if present
  const token = localStorage.getItem('token');
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
    const res = await fetch(`${BASE_URL}${path}`, options);

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { detail: res.statusText };
      }

      // FastAPI 422 → detail is an array of field errors
      if (res.status === 422 && Array.isArray(errorData.detail)) {
        const messages = errorData.detail.map(err => {
          const field = err.loc?.[err.loc.length - 1] || 'field';
          return `${field}: ${err.msg}`;
        });
        throw new Error(messages.join(' · '));
      }

      const errorMsg =
        typeof errorData.detail === 'string'
          ? errorData.detail
          : errorData.message || res.statusText;
      throw new Error(errorMsg);
    }

    return res.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(
        `Cannot reach server. Make sure FastAPI is running on ${BASE_URL}`
      );
    }
    console.error(`API [${method} ${path}]:`, error.message);
    throw error;
  }
}

export const api = {
  get:    (path)                   => request('GET',    path),
  post:   (path, body, isFormData) => request('POST',   path, body, isFormData),
  put:    (path, body)             => request('PUT',    path, body),
  delete: (path)                   => request('DELETE', path),
};
