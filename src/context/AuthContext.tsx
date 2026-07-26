import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { loginUser, logoutUser, registerUser, resetPassword, subscribeToAuthChanges } from '../firebase/auth';

interface AuthContextValue {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    await loginUser(email, password);
  }

  async function register(name: string, email: string, password: string) {
    await registerUser(name, email, password);
  }

  async function logout() {
    await logoutUser();
  }

  async function sendResetEmail(email: string) {
    await resetPassword(email);
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout, sendResetEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within an AuthProvider');
  return ctx;
}
