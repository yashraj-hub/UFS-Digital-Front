const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const ADMIN_TOKEN_KEY = "ufs_admin_token";

export function getAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAdminToken();

  if (!headers.has("content-type") && options.body) {
    headers.set("content-type", "application/json");
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload.message || payload.error || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload.data ?? payload;
}

export const adminApi = {
  listBlogCategories: () => request("/admin/content/blog-categories"),

  login: (credentials) =>
    request("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  me: () => request("/admin/auth/me"),

  changePassword: (oldPassword, newPassword, confirmPassword) =>
    request("/admin/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    }),

  permissions: () => request("/admin/permissions"),

  listRoles: () => request("/admin/roles"),

  createRole: (data) =>
    request("/admin/roles", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateRole: (id, data) =>
    request(`/admin/roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  removeRole: (id) =>
    request(`/admin/roles/${id}`, {
      method: "DELETE",
    }),

  listUsers: () => request("/admin/users"),

  createUser: (data) =>
    request("/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateUser: (id, data) =>
    request(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  removeUser: (id) =>
    request(`/admin/users/${id}`, {
      method: "DELETE",
    }),

  list: (resource, params = {}) => {
    let path = `/admin/content/${resource}`;
    const query = new URLSearchParams(params).toString();
    if (query) {
      path += `?${query}`;
    }
    return request(path);
  },

  create: (resource, data) =>
    request(`/admin/content/${resource}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (resource, id, data) =>
    request(`/admin/content/${resource}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  remove: (resource, id) =>
    request(`/admin/content/${resource}/${id}`, {
      method: "DELETE",
    }),

  bulkDelete: (resource, ids) =>
    request(`/admin/content/${resource}/bulk-delete`, {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),

  getActivityLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/activity-logs${qs ? `?${qs}` : ""}`);
  },
};
