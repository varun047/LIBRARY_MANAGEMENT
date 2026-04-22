const configuredBase = (import.meta.env.VITE_API_BASE_URL || '').trim();

function normalizeApiBase(base) {
  if (!base) return '';

  const trimmed = base.replace(/\/+$/, '');

  // Keep explicit absolute URLs as-is.
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Keep root-relative base paths (e.g. "/api").
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // Treat bare host values (e.g. "localhost:5000" or "api.example.com") as absolute.
  return `http://${trimmed}`;
}

const API_BASE = normalizeApiBase(configuredBase);

function createUrl(path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!API_BASE) {
    return path;
  }

  if (/^https?:\/\//i.test(API_BASE)) {
    return new URL(path, `${API_BASE}/`).toString();
  }

  // API_BASE can be a root-relative path, so preserve frontend origin in that case.
  return `${API_BASE}${path}`;
}

async function request(path, options = {}) {
  const response = await fetch(createUrl(path), {
    credentials: 'include',
    ...options
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson ? payload?.error || payload?.message : `Request failed: ${response.status}`;
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return payload;
}

function postJson(path, payload) {
  return request(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function fetchStatistics() {
  return request('/api/statistics');
}

export function fetchBooks() {
  return request('/api/books');
}

export function fetchUsers() {
  return request('/api/users');
}

export function fetchTransactions() {
  return request('/api/transactions');
}

export function addBook(payload) {
  return postJson('/api/books', payload);
}

export function registerUser(payload) {
  return postJson('/api/users', payload);
}

export function borrowBook(payload) {
  return postJson('/api/borrow', payload);
}

export function returnBook(payload) {
  return postJson('/api/return', payload);
}

export async function loginUser({ identity, password }) {
  const body = new URLSearchParams({
    identity,
    password,
    next: '/app/dashboard'
  });

  const response = await fetch(createUrl('/login'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'text/html'
    },
    body: body.toString(),
    redirect: 'follow'
  });

  if (!response.ok) {
    return { success: false, message: 'Login failed.' };
  }

  const finalPath = new URL(response.url, window.location.origin).pathname;
  if (finalPath.startsWith('/dashboard') || finalPath.startsWith('/app/dashboard')) {
    return { success: true };
  }

  return { success: false, message: 'Invalid credentials.' };
}

export async function logoutUser() {
  await fetch(createUrl('/logout'), {
    method: 'POST',
    credentials: 'include'
  });
  return { success: true };
}
