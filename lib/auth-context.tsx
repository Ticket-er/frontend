"use client";

import Axios from "@/services/axios";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";


interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ORGANIZER" | "ADMIN" | "SUPERADMIN";
  profileImage?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("ticketer-user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem("ticketer-user");
          }
        }

        const response = await Axios.get("/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ticketer-token")}`,
          },
        });
        const fetchedUser = response.data.user;
        setUser(fetchedUser);
        localStorage.setItem("ticketer-user", JSON.stringify(fetchedUser));
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
        localStorage.removeItem("ticketer-user");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ticketer-user");
    localStorage.removeItem("ticketer-token");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-t-transparent border-blue-600 rounded-full animate-spin" />
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}