import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, TokenResponse } from '../types/auth';
import { readAuthSnapshot, writeAuthSnapshot, clearAuthSnapshot, tokenResponseToAuthState } from '../lib/storage';

type AuthAction = { type: 'SET_AUTH'; payload: AuthState } | { type: 'CLEAR_AUTH' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_AUTH':
      return action.payload;
    case 'CLEAR_AUTH':
      return clearAuthSnapshot();
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  login: (tokenResponse: TokenResponse) => void;
  register: (tokenResponse: TokenResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, dispatch] = useReducer(authReducer, undefined, readAuthSnapshot);

  const setAuth = (tokenResponse: TokenResponse) => {
    const nextState = tokenResponseToAuthState(tokenResponse);
    writeAuthSnapshot(nextState);
    dispatch({ type: 'SET_AUTH', payload: nextState });
  };

  const logout = () => {
    dispatch({ type: 'CLEAR_AUTH' });
  };

  const value: AuthContextValue = {
    ...auth,
    login: setAuth,
    register: setAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook must live alongside its provider/context
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
