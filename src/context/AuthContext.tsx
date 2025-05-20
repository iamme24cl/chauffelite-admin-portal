import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { user, access_token, refresh_token } = await loginUser(email, password);
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const register = async ({ name, email, password, phone }: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    const { user, access_token, refresh_token } = await registerUser({ name, email, password, phone });
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (refresh_token) {
      await logoutUser(refresh_token);
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
