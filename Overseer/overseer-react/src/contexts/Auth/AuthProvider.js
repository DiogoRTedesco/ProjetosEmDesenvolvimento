/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const api = useApi();

    const storageData = sessionStorage.getItem('authToken')
    useEffect(() => {
        validateToken(storageData);
    }, [])


    const validateToken = async (token) => {

        if (token) {
           
                const [_, payloadEncoded] = token.split('.');
                const payload = JSON.parse(atob(payloadEncoded));
                setUser(payload.user)
           

        }
    }

    const signin = async (user, senha) => {
        const data = await api.signin(user, senha)
        if (data.user && data.token) {
            setUser(data.user)
            setToken(data.token)
            return true
        }

        return false;

    }

    const signout = async () => {
        setUser(null);
        setToken('')
        await api.logout();
    }

    const setToken = (token) => {
        sessionStorage.setItem('authToken', token);
    }
    return (
        <AuthContext.Provider value={{ user, signin, signout, validateToken }}>
            {children}
        </AuthContext.Provider>
    )
}