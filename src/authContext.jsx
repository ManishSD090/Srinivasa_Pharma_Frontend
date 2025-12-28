import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [staffId, setStaffId] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setStaffId(null);
    }, []);

    const login = useCallback((jwtToken) => {
        const decoded = jwtDecode(jwtToken);

        setToken(jwtToken);
        setUser(decoded);
        setStaffId(decoded.staffId || null);

        localStorage.setItem('token', jwtToken);
    }, []);

    useEffect(() => {
        const initAuth = () => {
            try {
                const storedToken = localStorage.getItem('token');

                if (storedToken) {
                    const decoded = jwtDecode(storedToken);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp < currentTime) {
                        logout();
                    } else {
                        setToken(storedToken);
                        setUser(JSON.parse(localStorage.getItem('user')));
                        setStaffId(localStorage.getItem('staffId') || null);
                    }
                }
            } catch (error) {
                console.error('Auth init error:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [logout]);

    const value = {
        user,
        staffId,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
