import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const checkAuth = useCallback(async () => {
    setLoading(true);
    const response = await axios
      .get(`${API_URL}/auth/user`, {
        withCredentials: true,
      })
      .catch((error) => {
        console.log("Not authenticated:", error.response?.status);
        return { data: { user: null } };
      });

    if (response.data.user) {
      setUser(response.data.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [API_URL]);

  const logout = async () => {
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    logout,
    checkAuth,
  };
};
