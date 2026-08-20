// Protect authenticated routes
// Protect authenticated routes
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;