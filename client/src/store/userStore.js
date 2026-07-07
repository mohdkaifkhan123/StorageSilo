import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userService } from "../services/userService";
import useAuthStore from "./authStore";
const useUserStore = create(
  persist(
    (set) => ({
      logout: async () => {
        const data = await userService.logout();
        console.log("dataaa", data.success);
        if (data.success)
          useAuthStore.setState({
            user: null,
            token: null,
            isAuthenticated: false,
          });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useUserStore;
