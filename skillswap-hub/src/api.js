const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function clearToken() {
  localStorage.removeItem('token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}

export const api = {
  auth: {
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me'),
  },
  users: {
    list: (search) => request(`/users${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    get: (id) => request(`/users/${id}`),
    updateProfile: (data) => request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
    getReviews: (id) => request(`/users/${id}/reviews`),
    createReview: (id, data) => request(`/users/${id}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
    getStats: () => request('/users/stats'),
  },
  skills: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/skills${q ? `?${q}` : ''}`);
    },
    categories: () => request('/skills/categories'),
    my: () => request('/skills/my'),
    addTeach: (data) => request('/skills/teach', { method: 'POST', body: JSON.stringify(data) }),
    addLearn: (data) => request('/skills/learn', { method: 'POST', body: JSON.stringify(data) }),
    deleteTeach: (id) => request(`/skills/teach/${id}`, { method: 'DELETE' }),
    deleteLearn: (id) => request(`/skills/learn/${id}`, { method: 'DELETE' }),
    updateLearnProgress: (id, progress) => request(`/skills/learn/${id}`, { method: 'PUT', body: JSON.stringify({ progress }) }),
  },
  matches: {
    list: () => request('/matches'),
  },
  connections: {
    list: (status) => request(`/connections${status ? `?status=${status}` : ''}`),
    create: (connectedId) => request('/connections', { method: 'POST', body: JSON.stringify({ connectedId }) }),
    accept: (id) => request(`/connections/${id}/accept`, { method: 'PUT' }),
    reject: (id) => request(`/connections/${id}/reject`, { method: 'PUT' }),
    remove: (id) => request(`/connections/${id}`, { method: 'DELETE' }),
    suggested: () => request('/connections/suggested'),
    pending: () => request('/connections/pending'),
  },
  messages: {
    conversations: () => request('/messages/conversations'),
    get: (convId) => request(`/messages/conversations/${convId}`),
    create: (userId) => request('/messages/conversations', { method: 'POST', body: JSON.stringify({ userId }) }),
    send: (convId, text) => request(`/messages/conversations/${convId}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),
    markRead: (convId) => request(`/messages/conversations/${convId}/read`, { method: 'PUT' }),
  },
  notifications: {
    list: (filter) => request(`/notifications${filter ? `?filter=${filter}` : ''}`),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),
    unreadCount: () => request('/notifications/unread-count'),
  },
  community: {
    posts: (type) => request(`/community/posts${type && type !== 'all' ? `?type=${type}` : ''}`),
    getPost: (id) => request(`/community/posts/${id}`),
    createPost: (data) => request('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
    toggleLike: (id) => request(`/community/posts/${id}/like`, { method: 'POST' }),
    getComments: (id) => request(`/community/posts/${id}/comments`),
    addComment: (id, text) => request(`/community/posts/${id}/comments`, { method: 'POST', body: JSON.stringify({ text }) }),
    deletePost: (id) => request(`/community/posts/${id}`, { method: 'DELETE' }),
  },
  progress: {
    overview: () => request('/progress/overview'),
    weeklyActivity: () => request('/progress/weekly-activity'),
    monthly: () => request('/progress/monthly'),
    skillProgress: () => request('/progress/skill-progress'),
    achievements: () => request('/progress/achievements'),
    log: (data) => request('/progress/log', { method: 'POST', body: JSON.stringify(data) }),
  },
  settings: {
    get: () => request('/settings'),
    update: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
};

export { getToken, setToken, clearToken };
