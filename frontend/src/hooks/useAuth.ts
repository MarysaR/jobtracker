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

  // Récupérer le token depuis localStorage
  const getToken = () => {
    return localStorage.getItem("jobtracker_token");
  };

  // Stocker le token
  const setToken = (token: string) => {
    localStorage.setItem("jobtracker_token", token);
  };

  // Supprimer le token
  const removeToken = () => {
    localStorage.removeItem("jobtracker_token");
  };

  // Vérifier s'il y a un token dans l'URL (après connexion Google)
  const checkUrlToken = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setToken(token);
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return token;
    }

    return null;
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading(true);

    console.log("🚀 Starting checkAuth...");
    setLoading(true);

    // 1. Vérifier s'il y a un token dans l'URL
    let token = checkUrlToken();
    console.log("🔍 Token from URL:", token);

    // 2. Sinon, récupérer depuis localStorage
    if (!token) {
      token = getToken();
      console.log("💾 Token from localStorage:", token);
    }

    // 3. Si pas de token, pas connecté
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // 3. Si pas de token, pas connecté
    if (!token) {
      console.log("❌ No token found");
      setUser(null);
      setLoading(false);
      return;
    }

    // 4. Vérifier le token avec le backend
    console.log("📡 Calling verify-token...");
    try {
      const response = await axios.get(`${API_URL}/auth/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Response:", response.data);

      if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
        removeToken();
      }
    } catch (error) {
      console.log("❌ Token invalid:", error);
      setUser(null);
      removeToken();
    }

    setLoading(false);
  }, [API_URL, checkUrlToken]);

  const logout = async () => {
    // Supprimer le token local
    removeToken();
    setUser(null);

    // Optionnel : appeler le backend pour invalider le token
    try {
      const token = getToken();
      if (token) {
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.log("Logout error:", error);
    }
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
