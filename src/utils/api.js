/**
 * API Utility Module
 * Centralized helper for all backend API calls
 * Handles base URL, auth headers, and error responses
 */

// Backend API (override with VITE_API_ORIGIN, e.g. http://localhost:5001)
const API_ORIGIN =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_ORIGIN
    ? import.meta.env.VITE_API_ORIGIN.replace(/\/$/, '')
    : 'http://localhost:5001';

const API_BASE = `${API_ORIGIN}/api`;

export function getApiOrigin() {
  return API_ORIGIN;
}

// Storage key for JWT token
const TOKEN_KEY = 'lincesckf_token';

/**
 * Get the stored JWT token
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store the JWT token
 */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the JWT token (on logout)
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Build request headers — includes Authorization if token exists
 */
function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Generic fetch wrapper with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: getHeaders(),
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// ============================================================
// AUTH API
// ============================================================

export async function apiLogin(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiRegister(name, email, password, accountType) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, accountType }),
  });
}

// ============================================================
// HOME API
// ============================================================

export async function apiGetHomeData() {
  return request('/home');
}

// ============================================================
// PRODUCTS API
// ============================================================

export async function apiGetProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'all') query.set('category', params.category);
  if (params.sort) query.set('sort', params.sort);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);

  const queryString = query.toString();
  return request(`/products${queryString ? `?${queryString}` : ''}`);
}

export async function apiGetProductById(id) {
  return request(`/products/${id}`);
}

export async function apiCreateProduct(productData) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

export async function apiGetCategories() {
  return request('/products/categories');
}

// ============================================================
// CART API
// ============================================================

export async function apiGetCart() {
  return request('/cart');
}

export async function apiAddToCart(productId, quantity = 1, selectedSize = null) {
  return request('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity, selectedSize }),
  });
}

export async function apiUpdateCartItem(productId, quantity) {
  return request('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function apiRemoveFromCart(productId) {
  return request('/cart/remove', {
    method: 'DELETE',
    body: JSON.stringify({ productId }),
  });
}

// ============================================================
// ORDERS API
// ============================================================

export async function apiGetOrders() {
  return request('/orders');
}

export async function apiPlaceOrder(shippingInfo) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify({ shippingInfo }),
  });
}

// ============================================================
// USER API
// ============================================================

export async function apiUpdateProfile(name, email) {
  return request('/user/update', {
    method: 'PUT',
    body: JSON.stringify({ name, email }),
  });
}

export async function apiChangePassword(currentPassword, newPassword) {
  return request('/user/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function apiGetPreferences() {
  return request('/user/preferences');
}

export async function apiUpdatePreferences(preferences) {
  return request('/user/preferences', {
    method: 'PUT',
    body: JSON.stringify({ preferences }),
  });
}

// ============================================================
// CONTACT API
// ============================================================

export async function apiSubmitContact(formData) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

// ============================================================
// REVIEWS API
// ============================================================

export async function apiAddReview(productId, rating, comment) {
  return request('/reviews', {
    method: 'POST',
    body: JSON.stringify({ productId, rating, comment }),
  });
}
