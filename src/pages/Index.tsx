
import { Navigate } from "react-router-dom";

// Página índice agora simplesmente redireciona para o dashboard (ou landing, se preferir)
const Index = () => <Navigate to="/dashboard" replace />;

export default Index;
