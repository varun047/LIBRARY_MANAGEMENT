const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
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
  return postJson('/books', payload);
}

export function registerUser(payload) {
  return postJson('/users', payload);
}

export function borrowBook(payload) {
  return postJson('/borrow', payload);
}

export function returnBook(payload) {
  return postJson('/return', payload);
}
