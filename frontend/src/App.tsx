import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";
import AuthForm from "./auth/AuthForm";

function App() {
  const { user, loading, message, showMessage } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
        <div className="text-lg text-orange-800 font-medium">Chargement...</div>
      </div>
    );
  }

  return (
    <>
      {/* Messages de notification */}
      {showMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm min-w-[280px]">
            <div className="flex items-center space-x-2">
              <div className="flex-1 text-sm font-medium text-gray-800">
                {message}
              </div>
              <div className="flex-shrink-0">
                {message.includes("✅") ? (
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      {!user ? (
        <AuthForm />
      ) : (
        <div className="min-h-screen bg-gray-50">
          <Dashboard />
        </div>
      )}

      {/* Styles pour l'animation */}
      <style>
        {`
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `}
      </style>
    </>
  );
}

export default App;
