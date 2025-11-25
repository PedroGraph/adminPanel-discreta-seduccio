const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token?: string;
  };
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
}

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  const result: LoginResponse = await response.json();
  return result.data.user;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al cerrar sesión');
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const result: AuthResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Register a new user
 */
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrar usuario');
  }

  const result: LoginResponse = await response.json();
  return result.data.user;
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al solicitar restablecimiento de contraseña');
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, password: newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al restablecer contraseña');
  }
};
