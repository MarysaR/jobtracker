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
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Afficher un message temporaire
  const showTemporaryMessage = (msg: string, duration = 3000) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setMessage("");
    }, duration);
  };

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

    // 1. Vérifier s'il y a un token dans l'URL
    let token = checkUrlToken();

    // 2. Sinon, récupérer depuis localStorage
    if (!token) {
      token = getToken();
    }

    // 3. Si pas de token, pas connecté
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // 4. Vérifier le token avec le backend
    try {
      const response = await axios.get(`${API_URL}/auth/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.user) {
        setUser(response.data.user);
        // Message de bienvenue seulement si on vient de se connecter
        if (window.location.search.includes("token=")) {
          showTemporaryMessage(`Bienvenue ${response.data.user.name} !`);
        }
      } else {
        setUser(null);
        removeToken();
      }
    } catch (error) {
      console.log("Token invalid:", error);
      setUser(null);
      removeToken();

      // Si le token était invalide, afficher un message
      if (token) {
        showTemporaryMessage("Session expirée, veuillez vous reconnecter");
      }
    }

    setLoading(false);
  }, [API_URL, checkUrlToken]);

  const logout = async () => {
    const wasLoggedIn = !!user;

    // Supprimer le token local et l'utilisateur immédiatement
    removeToken();
    setUser(null);

    // Afficher message de déconnexion
    if (wasLoggedIn) {
      showTemporaryMessage("Déconnexion réussie ! À bientôt !");
    }

    // Optionnel : appeler le backend pour invalider le token (en arrière-plan)
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
      // Pas besoin d'afficher l'erreur à l'utilisateur, il est déjà déconnecté côté frontend
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
    message,
    showMessage,
  };
};
