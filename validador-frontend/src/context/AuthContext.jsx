import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        username: '',
        accessToken: '',
        refreshToken: '',
        licencia: false,
        oauth: false,
        vencimientoLicencia: '',
    });

    useEffect(() => {
        const stored = {
            username: sessionStorage.getItem('username') || '',
            accessToken: sessionStorage.getItem('accessToken') || '',
            refreshToken: sessionStorage.getItem('refreshToken') || '',
            licencia: true,//sessionStorage.getItem('licencia') === 'true',
            oauth: true,//sessionStorage.getItem('oauth') === 'true',
            vencimientoLicencia: sessionStorage.getItem('vencimientoLicencia') || '',
        };
        setAuth(stored);
    }, []);

    useEffect(() => {
        const sync = () => {
            const updated = {
                username: sessionStorage.getItem('username') || '',
                accessToken: sessionStorage.getItem('accessToken') || '',
                refreshToken: sessionStorage.getItem('refreshToken') || '',
                licencia: true,//sessionStorage.getItem('licencia') === 'true',
                oauth: true,//sessionStorage.getItem('oauth') === 'true',
                vencimientoLicencia: sessionStorage.getItem('vencimientoLicencia') || '',
            };
            setAuth(updated);
        };
        window.addEventListener('authChange', sync);
        return () => window.removeEventListener('authChange', sync);
    }, []);

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}