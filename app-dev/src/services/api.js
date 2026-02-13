const BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001');

const ERROR_MESSAGES = {
  Offline: '오프라인 상태입니다. 인터넷 연결을 확인해주세요.',
  NetworkError: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
  401: '로그인이 필요합니다.',
  403: '접근 권한이 없습니다.',
  404: '요청한 정보를 찾을 수 없습니다.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(ERROR_MESSAGES[response.status] || ERROR_MESSAGES[500]);
  }

  if (!response.ok) {
    const message = body.error || ERROR_MESSAGES[response.status] || ERROR_MESSAGES[500];
    throw new Error(message);
  }

  // Support new { success, data } format while staying backward-compatible
  return body.data !== undefined ? body.data : body;
};

const safeFetch = (url, options) => {
  if (!navigator.onLine) {
    return Promise.reject(new Error(ERROR_MESSAGES.Offline));
  }
  return fetch(url, options).catch(() => {
    throw new Error(ERROR_MESSAGES.NetworkError);
  });
};

const api = {
  get: (path) =>
    safeFetch(`${BASE_URL}${path}`, { headers: getHeaders() }).then(handleResponse),

  post: (path, body) =>
    safeFetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path, body) =>
    safeFetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path, body) =>
    safeFetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse),
};

export default api;
