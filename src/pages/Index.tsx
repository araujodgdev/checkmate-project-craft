import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store";

// Redirect to Dashboard or Auth page based on authentication status
const Index = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  // In a real app with Supabase, we would check the actual authentication status
  // For now, we'll always redirect to the dashboard since we're not implementing full auth yet
  return <Navigate to="/" replace />;
};

export default Index;
