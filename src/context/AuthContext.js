import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error("Login error", error.response?.data?.message || error.message);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post(`${API}/api/auth/register`, { name, email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error("Register error", error.response?.data?.message || error.message);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
