'use client'

import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import Auth from '../config/firebase';
import { enqueueSnackbar } from 'notistack';

interface AuthContextInterface {
    user: any,
    login: () => void,
    logout: () => void,
    loading?: boolean
}

export const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     // if (context === undefined) {
//     //     throw new Error("useAuth must be used within an AuthProvider");
//     // }
//     return context;
// }

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(true);
        const unsubscribe = Auth.onAuthStateChanged(user => {
            console.log(user)
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        setLoading(false);
        return unsubscribe;
    }, []);

    const login = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const user = await signInWithPopup(Auth, provider);
            setUser(user);
        } catch (err) {
            console.log(err)
            enqueueSnackbar(err.message, { variant: 'error' });
        }
        setLoading(false);
    }

    const logout = () => {
        signOut(Auth);
        setUser(null);
    }

    const contextValue: AuthContextInterface = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
