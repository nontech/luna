import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface User {
  email: string;
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  date_joined: string;
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

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      console.log("Checking authentication...");
      const response = await fetch(
        "http://localhost:8000/api/user/",
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Auth check response status:", response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log("User data received:", userData);
        setUser(userData);
        return true;
      } else {
        const errorData = await response.text();
        console.log("Auth check failed:", errorData);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
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
      const response = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      await checkAuth();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:8000/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
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
