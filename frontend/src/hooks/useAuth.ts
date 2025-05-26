import { useState, useEffect, useCallback, useRef } from "react";
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

  // Ref pour éviter les timers multiples
  const messageTimerRef = useRef<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Debug logs
  console.log("DEBUG useAuth state:", {
    showMessage,
    message,
    hasUser: !!user,
  });

  // Afficher un message temporaire
  const showTemporaryMessage = useCallback((msg: string, duration = 3000) => {
    console.log("DEBUG showTemporaryMessage called with:", msg);

    // Nettoyer le timer précédent si existe
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    // Afficher le message
    setMessage(msg);
    setShowMessage(true);

    // Programmer la disparition
    messageTimerRef.current = setTimeout(() => {
      console.log("DEBUG Message timeout - hiding message");
      setShowMessage(false);
      setMessage("");
      messageTimerRef.current = null;
    }, duration);
  }, []);

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
      console.log("DEBUG Token found in URL");
      setToken(token);
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return token;
    }
    return null;
  }, []);

  const checkAuth = useCallback(async () => {
    console.log("DEBUG checkAuth started");
    setLoading(true);

    // 1. Vérifier s'il y a un token dans l'URL
    let token = checkUrlToken();
    const isFromUrlToken = !!token;

    // 2. Sinon, récupérer depuis localStorage
    if (!token) {
      token = getToken();
    }

    // 3. Si pas de token, pas connecté
    if (!token) {
      console.log("DEBUG No token found");
      setUser(null);
      setLoading(false);
      return;
    }

    // 4. Vérifier le token avec le backend
    try {
      console.log("DEBUG Verifying token with backend");
      const response = await axios.get(`${API_URL}/auth/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.user) {
        console.log(
          "DEBUG Token valid, user authenticated:",
          response.data.user.name
        );
        setUser(response.data.user);

        // Message de bienvenue seulement si on vient de se connecter via URL
        if (isFromUrlToken) {
          console.log("DEBUG Showing welcome message for new login");
          showTemporaryMessage(`Bienvenue ${response.data.user.name} !`);
        }
      } else {
        console.log("DEBUG Invalid response from backend");
        setUser(null);
        removeToken();
      }
    } catch (error) {
      console.log("DEBUG Token verification failed:", error);
      setUser(null);
      removeToken();

      // Si le token était invalide, afficher un message
      if (token) {
        showTemporaryMessage("Session expirée, veuillez vous reconnecter");
      }
    }

    setLoading(false);
  }, [API_URL, checkUrlToken, showTemporaryMessage]);

  const logout = useCallback(async () => {
    console.log("DEBUG Logout initiated");
    const wasLoggedIn = !!user;
    const currentToken = getToken();

    removeToken();
    setUser(null);

    // Afficher message de déconnexion
    if (wasLoggedIn) {
      showTemporaryMessage("Déconnexion réussie ! À bientôt !");
    }

    try {
      if (currentToken) {
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.log("Logout error:", error);
    }
  }, [API_URL, user, showTemporaryMessage]);

  // Nettoyage du timer au démontage
  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

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
    showTemporaryMessage, // Exposer pour utilisation externe si besoin
  };
};
