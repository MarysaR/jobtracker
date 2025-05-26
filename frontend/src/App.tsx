import { AuthProvider } from "./hooks/useAuth";
import AppContent from "./AppContent";

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
