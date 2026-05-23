import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                if (parsedUser?.token) {
                    const { data } = await api.get('/auth/me');
                    const userData = { ...parsedUser, ...data };
                    setUser(userData);
                    localStorage.setItem('userInfo', JSON.stringify(userData));
                } else {
                    throw new Error('No token found');
                }
            } catch (error) {
                // Silent failure for auth checks to avoid console spam
                // Only log if it's not a standard 401/404
                if (error.response?.status !== 401 && error.response?.status !== 404) {
                    console.error('Session verification failed:', error);
                }
                localStorage.removeItem('userInfo');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateUser = (updatedData) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            const userData = { ...parsedUser, ...updatedData };
            setUser(userData);
            localStorage.setItem('userInfo', JSON.stringify(userData));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
