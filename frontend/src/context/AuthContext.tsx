import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';
import type { User, Profile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, full_name: string, college_id: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Profile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedProfile = localStorage.getItem('profile');

      if (token && storedUser && storedProfile) {
        try {
          setUser(JSON.parse(storedUser));
          setProfile(JSON.parse(storedProfile));
        } catch (error) {
          console.error('Failed to parse stored auth data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('profile');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      const { user, profile, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('profile', JSON.stringify(profile));
      setUser(user);
      setProfile(profile);
    } else {
      throw new Error(response.error || 'Login failed');
    }
  };

  const signup = async (email: string, password: string, full_name: string, college_id: string) => {
    const response = await authService.signup({ email, password, full_name, college_id });
    if (response.success && response.data) {
      const { user, profile, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('profile', JSON.stringify(profile));
      setUser(user);
      setProfile(profile);
    } else {
      throw new Error(response.error || 'Signup failed');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    localStorage.setItem('profile', JSON.stringify(updatedProfile));
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
