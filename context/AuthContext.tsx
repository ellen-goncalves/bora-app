import React, {createContext, useContext, useState} from 'react';

type AuthState = {isAuthenticated: boolean; signIn: () => void; signOut: () => void};
const AuthContext = createContext<AuthState | null>(null);

// Autenticação demonstrativa em memória. Substituir por sessão validada pelo backend.
export function AuthProvider({children}: {children: React.ReactNode}) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  return <AuthContext.Provider value={{isAuthenticated, signIn: () => setAuthenticated(true), signOut: () => setAuthenticated(false)}}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider ausente');
  return value;
}
