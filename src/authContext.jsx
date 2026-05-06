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
    // Synchronously initialize from localStorage to avoid the "logged out" flicker on refresh
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });
    const [staffId, setStaffId] = useState(() => localStorage.getItem('staffId') || null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        try {
            // Optional: Call backend to clear server-side cookies
            await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                method: 'GET', // or POST if changed in backend
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error("Backend logout failed:", error);
        }

        // "Nuclear Wipe" of all frontend credentials
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('staffId');
        localStorage.clear();
        sessionStorage.clear();

        // Clear any auth cookies
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Reset state
        setToken(null);
        setUser(null);
        setStaffId(null);

        // Immediate redirect to login
        window.location.href = '/';
    }, []);

    const login = useCallback((jwtToken, userData = null) => {
        const decoded = jwtDecode(jwtToken);
        
        // Merge decoded token with extra user data (like dailyWorkHrs)
        const combinedUser = userData ? { ...decoded, ...userData } : decoded;

        setToken(jwtToken);
        setUser(combinedUser);
        setStaffId(combinedUser.staffId || null);

        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(combinedUser));
        localStorage.setItem('staffId', combinedUser.staffId || '');
    }, []);

    useEffect(() => {
        const checkExpiration = () => {
            try {
                if (token) {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp < currentTime) {
                        console.warn("Token expired, logging out...");
                        logout();
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkExpiration();
    }, [token, logout]);

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
