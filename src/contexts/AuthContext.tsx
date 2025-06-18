import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "provider" | "admin";
  avatar?: string;
  phone?: string;
  location?: string;
  verified?: boolean;
  rating?: number;
  totalEarnings?: number;
  completedJobs?: number;
  joinedDate?: string;
  serviceCategory?: string;
  hourlyRate?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "customer@example.com",
    password: "password123",
    name: "John Customer",
    role: "customer",
    avatar:
      "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150",
    phone: "+91 9876543210",
    location: "Chennai, India",
    verified: true,
    joinedDate: "2023-01-15",
  },
  {
    id: "2",
    email: "provider@example.com",
    password: "password123",
    name: "Sarah Provider",
    role: "provider",
    avatar:
      "https://images.pexels.com/photos/5025639/pexels-photo-5025639.jpeg?auto=compress&cs=tinysrgb&w=150",
    phone: "+91 9876543211",
    location: "Chennai, India",
    verified: true,
    rating: 4.8,
    totalEarnings: 45230,
    completedJobs: 89,
    joinedDate: "2023-02-20",
    serviceCategory: "Home Cleaning",
    hourlyRate: "₹500",
    description: "Professional cleaning services with 5+ years experience",
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    avatar:
      "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=150",
    phone: "+91 9876543212",
    location: "Chennai, India",
    verified: true,
    joinedDate: "2022-12-01",
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem("go_local_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("go_local_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(
        "go_local_user",
        JSON.stringify(userWithoutPassword),
      );
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const register = async (
    userData: Partial<User>,
    password: string,
  ): Promise<boolean> => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === userData.email);
    if (existingUser) {
      setLoading(false);
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email || "",
      name: userData.name || "",
      role: userData.role || "customer",
      avatar: userData.avatar,
      phone: userData.phone,
      location: userData.location,
      verified: false,
      joinedDate: new Date().toISOString().split("T")[0],
      serviceCategory: userData.serviceCategory,
      hourlyRate: userData.hourlyRate,
      description: userData.description,
    };

    // Add to mock users (in real app, this would be an API call)
    mockUsers.push({ ...newUser, password });

    setUser(newUser);
    localStorage.setItem("go_local_user", JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("go_local_user");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
