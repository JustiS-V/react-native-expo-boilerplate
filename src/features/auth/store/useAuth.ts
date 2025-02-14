import { create } from 'zustand';
import { mockApiCall } from '../../../services/api';
import { storage } from '../../../services/storage';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (email: string) => {
    set({ isLoading: true });
    try {
      const user = await mockApiCall({ email, name: email.split('@')[0] });
      await storage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    await storage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
}));
