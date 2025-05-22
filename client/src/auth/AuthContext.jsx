import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const expiry = localStorage.getItem("tokenExpiry");

        if (token && expiry) {
            const now = new Date().getTime();
            if (now < parseInt(expiry, 10)) {
                setIsAuthenticated(true);

                const remainingTime = parseInt(expiry, 10) - now;
                setTimeout(() => logout(), remainingTime);
            } else {
                logout();
            }
        }
    }, []);

    const login = (token) => {
        const expiryTime = new Date().getTime() + 60 * 60 * 1000;
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiry", expiryTime.toString());
        setIsAuthenticated(true);
        setTimeout(() => logout(), 60 * 60 * 1000);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);