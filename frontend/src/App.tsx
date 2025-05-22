import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";
import AuthForm from "./auth/AuthForm";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
        <div className="text-lg text-orange-800 font-medium">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
}

export default App;
