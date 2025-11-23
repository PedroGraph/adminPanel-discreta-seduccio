import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
};

type NewUserPayload = {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  password: string;
}

interface UsersContextType {
  users: User[];
  filteredUsers: User[];
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  selectedUser: User | null;
  isCreateModalOpen: boolean;
  isDetailModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isEditModalOpen: boolean;
  isLoading: boolean;
  setSearchTerm: (term: string) => void;
  setRoleFilter: (role: string) => void;
  setStatusFilter: (status: string) => void;
  setSelectedUser: (user: User | null) => void;
  setIsCreateModalOpen: (open: boolean) => void;
  setIsDetailModalOpen: (open: boolean) => void;
  setIsDeleteModalOpen: (open: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;
  addUser: (user: NewUserPayload) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  updateUser: (id: number, updates: Partial<User>) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

const API_URL = 'http://localhost:3000/api';

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/users`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.data);
        } else {
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const addUser = async (userData: NewUserPayload) => {
    try {
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
        throw new Error(error.message || "No se pudo crear el usuario.");
      }

      const result = await response.json();
      setUsers(prev => [...prev, result.data]);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el usuario.");
      }

      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  const updateUser = async (id: number, updates: Partial<User>) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar el usuario.");
      }

      const result = await response.json();
      setUsers(prev => prev.map(user =>
        user.id === id ? result.data : user
      ));
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return (
    <UsersContext.Provider value={{
      users,
      filteredUsers,
      searchTerm,
      roleFilter,
      statusFilter,
      selectedUser,
      isCreateModalOpen,
      isDetailModalOpen,
      isDeleteModalOpen,
      isEditModalOpen,
      isLoading,
      setSearchTerm,
      setRoleFilter,
      setStatusFilter,
      setSelectedUser,
      setIsCreateModalOpen,
      setIsDetailModalOpen,
      setIsDeleteModalOpen,
      setIsEditModalOpen,
      addUser,
      deleteUser,
      updateUser,
    }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
