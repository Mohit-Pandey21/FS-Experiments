import { dummyUsers } from './dummyUsers';

export const login = (email, password) => {
  const user = dummyUsers.find((u) => u.email === email);
  if (!user || user.password !== password) {
    return { success: false, error: 'Invalid email or password' };
  }

  // 30 minute expiry
  const payload = {
    userId: user.id,
    role: user.role,
    name: user.name,
    exp: Date.now() + 1000 * 60 * 30,
  };

  const token = btoa(JSON.stringify(payload));
  localStorage.setItem('token', token);

  return { success: true, token, user };
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch (error) {
    return null;
  }
};

export const validateToken = () => {
  const token = getToken();
  if (!token) return { valid: false, error: 'Not authenticated — please sign in again.' };

  const payload = decodeToken(token);
  if (!payload || payload.exp < Date.now()) {
    logout();
    return { valid: false, error: 'Session expired — please sign in again.' };
  }

  return { valid: true, payload, token };
};
