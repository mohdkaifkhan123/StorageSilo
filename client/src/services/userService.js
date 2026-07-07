const API_URL = "http://localhost:3000/api/user";

export const userService = {
  logout: async () => {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.status === 204)
    {
      return { success: true, message: "Logged out (No Content)" };
    }
    const data = await response.json();

    return data;
  },
};
