import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (userData) => {
        try {
          const data = await authService.login(userData);
          if (data.message !== "Login successful") {
            throw new Error(data?.message);
          }

          set({
            user: data.user,
            token: data?.token || null,
            isAuthenticated: true,
          });

          return data;
        } catch (error) {
          set({
            error: error.message,
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.register(userData);
          set({
            user: data.user,
            isLoading: false,
          });
          return data;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
