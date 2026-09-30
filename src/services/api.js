const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('tb_admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  // States
  async getStates() {
    const res = await fetch(`${API_BASE}/states`);
    return handleResponse(res);
  },

  async getStateBySlug(slug) {
    const res = await fetch(`${API_BASE}/states/${encodeURIComponent(slug)}`);
    return handleResponse(res);
  },

  // Cities
  async getCities(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/cities${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  async getCityBySlug(slug) {
    const res = await fetch(`${API_BASE}/cities/${encodeURIComponent(slug)}`);
    return handleResponse(res);
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse(res);
  },

  async getCategoryBySlug(slug) {
    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(slug)}`);
    return handleResponse(res);
  },

  // Destinations
  async getDestinations(params = {}) {
    const cleanParams = {};
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        cleanParams[k] = v;
      }
    });
    const query = new URLSearchParams(cleanParams).toString();
    const res = await fetch(`${API_BASE}/destinations${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  async getDestinationBySlug(slug) {
    const res = await fetch(`${API_BASE}/destinations/${encodeURIComponent(slug)}`);
    return handleResponse(res);
  },

  async searchAll(q) {
    const res = await fetch(`${API_BASE}/destinations/search?q=${encodeURIComponent(q)}`);
    return handleResponse(res);
  },

  // Admin Auth
  async adminLogin(email, password) {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getAdminMe() {
    const res = await fetch(`${API_BASE}/admin/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getAdminDashboard() {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Admin State CRUD
  async createState(data) {
    const res = await fetch(`${API_BASE}/admin/states`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateState(id, data) {
    const res = await fetch(`${API_BASE}/admin/states/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteState(id) {
    const res = await fetch(`${API_BASE}/admin/states/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Admin City CRUD
  async createCity(data) {
    const res = await fetch(`${API_BASE}/admin/cities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateCity(id, data) {
    const res = await fetch(`${API_BASE}/admin/cities/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteCity(id) {
    const res = await fetch(`${API_BASE}/admin/cities/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Admin Category CRUD
  async createCategory(data) {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateCategory(id, data) {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Admin Destination CRUD
  async createDestination(data) {
    const res = await fetch(`${API_BASE}/admin/destinations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateDestination(id, data) {
    const res = await fetch(`${API_BASE}/admin/destinations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteDestination(id) {
    const res = await fetch(`${API_BASE}/admin/destinations/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
