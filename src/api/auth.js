import { getPublicEnv } from '../utils/env';
const API_BASE_URL = getPublicEnv('VITE_API_BASE_URL');

async function readJsonOrText(response) {
  try {
    const data = await response.json();
    return { json: data, text: null };
  } catch (e) {
    const t = await response.text();
    return { json: null, text: t };
  }
}

export const registerUser = async (email, password) => {
  try {
    if (!API_BASE_URL) {
      console.error('Missing VITE_API_BASE_URL');
      throw new Error('API base URL missing');
    }
    console.log('Register request', API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const parsed = await readJsonOrText(response);
    if (!response.ok) {
      const message = parsed.json?.message || parsed.text || 'Registration failed';
      console.error('Registration failed', message);
      throw new Error(message);
    }
    if (!parsed.json) {
      console.error('Registration parse error', parsed.text?.slice(0, 200));
      throw new Error('Registration response is not JSON');
    }
    return parsed.json;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    if (!API_BASE_URL) {
      console.error('Missing VITE_API_BASE_URL');
      throw new Error('API base URL missing');
    }
    console.log('Login request', API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const parsed = await readJsonOrText(response);
    if (!response.ok) {
      const message = parsed.json?.message || parsed.text || 'Login failed';
      console.error('Login failed', message);
      throw new Error(message);
    }
    if (!parsed.json) {
      console.error('Login parse error', parsed.text?.slice(0, 200));
      throw new Error('Login response is not JSON');
    }
    return parsed.json;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Alternative function name as suggested by backend (for compatibility)
export const login = async (email, password) => {
  try {
    if (!API_BASE_URL) {
      console.error('Missing VITE_API_BASE_URL');
      throw new Error('API base URL missing');
    }
    console.log('Login request (alias)', API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const parsed = await readJsonOrText(response);
    if (!response.ok) {
      const message = parsed.json?.message || parsed.text || 'Login failed';
      console.error('Login failed', message);
      throw new Error(message);
    }
    if (!parsed.json) {
      console.error('Login parse error', parsed.text?.slice(0, 200));
      throw new Error('Login response is not JSON');
    }
    return parsed.json;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const verifyToken = async (token) => {
  if (!API_BASE_URL) {
    console.error('Missing VITE_API_BASE_URL');
    throw new Error('API base URL missing');
  }
  console.log('Verify token request', API_BASE_URL);
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  const parsed = await readJsonOrText(response);
  if (!response.ok) {
    const message = parsed.json?.message || parsed.text || 'Token verification failed';
    console.error('Verify token failed', message);
    throw new Error(message);
  }
  if (!parsed.json) {
    console.error('Verify token parse error', parsed.text?.slice(0, 200));
    throw new Error('Verify token response is not JSON');
  }
  return parsed.json;
};
