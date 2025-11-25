const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'employee';
  status?: 'active' | 'inactive';
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'manager' | 'employee';
  status?: 'active' | 'inactive';
}

export interface UsersResponse {
  success: boolean;
  data: User[];
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los usuarios');
  }

  const result: UsersResponse = await response.json();
  return result.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el usuario');
  }

  const result: UserResponse = await response.json();
  return result.data;
};

/**
 * Create a new user
 */
export const createUser = async (userData: CreateUserPayload): Promise<User> => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'No se pudo crear el usuario');
  }

  const result: UserResponse = await response.json();
  return result.data;
};

/**
 * Update an existing user
 */
export const updateUser = async (id: number, updates: UpdateUserPayload): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'No se pudo actualizar el usuario');
  }

  const result: UserResponse = await response.json();
  return result.data;
};

/**
 * Delete a user
 */
export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'No se pudo eliminar el usuario');
  }
};
