import React, { useState } from "react";

type AuthMode = "login" | "register" | "forgot";
type AuthMethod = "google" | "email";

interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

const AuthForm: React.FC = () => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>("google");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const callApi = async (
    endpoint: string,
    body: unknown
  ): Promise<ApiResponse> => {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return { success: false, error: data.error || "Une erreur est survenue" };
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validation mot de passe pour inscription
    if (
      authMode === "register" &&
      formData.password !== formData.confirmPassword
    ) {
      setMessage("❌ Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    // Préparation des données selon le mode
    let endpoint = "";
    let body: unknown = {};

    if (authMode === "register") {
      endpoint = "/auth/register";
      body = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
    } else if (authMode === "login") {
      endpoint = "/auth/login";
      body = {
        email: formData.email,
        password: formData.password,
      };
    } else if (authMode === "forgot") {
      endpoint = "/auth/forgot-password";
      body = {
        email: formData.email,
      };
    }

    // Appel API
    const result = await callApi(endpoint, body);

    if (result.success) {
      if (authMode === "forgot") {
        setMessage("Email de réinitialisation envoyé !");
      } else {
        // Redirection après login/register réussi
        window.location.reload();
      }
    } else {
      setMessage(`❌ ${result.error}`);
    }

    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-orange-200">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full mx-4 border border-orange-200/50">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
              JobTracker
            </h1>
            <p className="text-orange-700">Gérez vos candidatures simplement</p>
          </div>

          {/* Onglets méthodes d'auth */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => {
                setAuthMethod("google");
                resetForm();
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                authMethod === "google"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              Google
            </button>
            <button
              onClick={() => {
                setAuthMethod("email");
                setAuthMode("login");
                resetForm();
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                authMethod === "email"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              Email
            </button>
          </div>

          {/* Méthode Google */}
          {authMethod === "google" && (
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Se connecter avec Google</span>
            </button>
          )}

          {/* Méthode Email */}
          {authMethod === "email" && (
            <div>
              {/* Sous-onglets pour email */}
              {authMode !== "forgot" && (
                <div className="flex bg-gray-50 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      resetForm();
                    }}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                      authMode === "login"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("register");
                      resetForm();
                    }}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                      authMode === "register"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Inscription
                  </button>
                </div>
              )}

              {/* Formulaire */}
              <div className="space-y-4">
                {authMode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {authMode !== "forgot" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                {authMode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Message */}
                {message && (
                  <div
                    className={`text-sm p-3 rounded-lg ${
                      message.includes("✅")
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Bouton submit */}
                <button
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Chargement...
                    </span>
                  ) : authMode === "login" ? (
                    "Se connecter"
                  ) : authMode === "register" ? (
                    "S'inscrire"
                  ) : (
                    "Envoyer l'email"
                  )}
                </button>

                {/* Liens */}
                <div className="text-center space-y-2">
                  {authMode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("forgot");
                        resetForm();
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  )}

                  {authMode === "forgot" && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        resetForm();
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      ← Retour à la connexion
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
