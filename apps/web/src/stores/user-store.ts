import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  phone: string;
  email?: string;
  userType: "WORKER" | "EMPLOYER" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED";
  avatar?: string;
  realName?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "flex-user-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
