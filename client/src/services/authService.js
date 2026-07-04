const API_URL = "http://localhost:3000/api/auth";

export const authService = {
  register: async (userData) => {
    console.log("regggg",userData)
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    console.log("datat", data);

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },

  login: async (userData) => {
    console.log("service",userData)
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      withCredentials:true
    });
    const data = await response.json();
    console.log(data);
    
    return data;
  },

};
