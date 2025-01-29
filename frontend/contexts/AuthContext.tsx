"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { fetchFromDjangoClient } from "@/utils/clientApi";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  date_joined: string;
  user_role: "teacher" | "student" | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      console.log("[Auth] Checking authentication status");

      const response = await fetchFromDjangoClient("api/user/");

      if (response.ok) {
        const userData = await response.json();
        console.log("[Auth] Successfully authenticated");
        setUser(userData);
        return true;
      } else {
        console.log(
          "[Auth] Not authenticated - Status:",
          response.status
        );
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("[Auth] Error checking authentication:", error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      void checkAuth();
    };

    const initializeAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      void checkAuth();
    };

    void initializeAuth();

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [checkAuth]);

  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetchFromDjangoClient(
        "accounts/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.success) {
        await checkAuth();
        router.push(data.redirect_url);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const response = await fetchFromDjangoClient("logout/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      setUser(null);

      if (!response.ok) {
        console.warn(
          "Logout response wasn't OK, but user was logged out locally"
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
    }
  };

  const contextValue = {
    user,
    login,
    logout,
    isLoading,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
