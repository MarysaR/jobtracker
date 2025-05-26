import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";
import AuthForm from "./auth/AuthForm";

function AppContent() {
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
          <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-300 rounded-lg shadow-lg p-4 max-w-sm min-w-[280px]">
            <div className="text-sm font-medium text-orange-800">{message}</div>
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
