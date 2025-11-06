const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthService = {
  login: async (credentials: { username: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      throw new Error("Login failed!");
    }

    return res.json();  
  },
};

