// Authentication state
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (userData, authToken) => {
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Session expired");
                }

                return res.json();
            })
            .then((data) => {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
            })
            .catch(() => {
                logout();
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                token: localStorage.getItem("token"),
                isAuthenticated: !!user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}