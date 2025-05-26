import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import type { ReactNode } from "react";
interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  message: string;
  showMessage: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  showTemporaryMessage: (msg: string, duration?: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // Ref pour éviter les timers multiples
  const messageTimerRef = useRef<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Afficher un message temporaire
  const showTemporaryMessage = useCallback((msg: string, duration = 3000) => {
    // Nettoyer le timer précédent si existe
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    // Afficher le message
    setMessage(msg);
    setShowMessage(true);

    // Programmer la disparition
    messageTimerRef.current = setTimeout(() => {
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
      setToken(token);
      // Nettoyer l'URL
      window.history.replaceState({}, "", window.location.pathname);
      return token;
    }
    return null;
  }, []);

  const checkAuth = useCallback(async () => {
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

        // Message de bienvenue seulement si on vient de se connecter via URL
        if (isFromUrlToken) {
          showTemporaryMessage(`Bienvenue ${response.data.user.name} !`);
        }
      } else {
        setUser(null);
        removeToken();
      }
    } catch (error) {
      console.log(error);
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
      console.log(error);
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

  const value: AuthContextType = {
    user,
    loading,
    logout,
    checkAuth,
    message,
    showMessage,
    showTemporaryMessage,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
