import { useState, useEffect } from "react";
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

  const checkAuth = async () => {
    setLoading(true);
    const response = await axios
      .get("http://localhost:3000/auth/user", {
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
  };

  const logout = async () => {
    await axios.post(
      "http://localhost:3000/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    loading,
    logout,
    checkAuth,
  };
};
