import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";
import AuthForm from "./auth/AuthForm";

function AppContent() {
  const authState = useAuth();
  console.log("DEBUG AppContent useAuth:", authState);

  const { user, loading, message, showMessage } = authState;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
        <div className="text-lg text-orange-800 font-medium">Chargement...</div>
      </div>
    );
  }

  console.log(
    "DEBUG App render - showMessage:",
    showMessage,
    "message:",
    message
  );

  return (
    <>
      {/* Messages de notification */}
      {showMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm min-w-[280px]">
            <div className="text-sm font-medium text-gray-800">{message}</div>
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

export default AppContent;
