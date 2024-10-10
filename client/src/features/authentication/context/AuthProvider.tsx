import { createContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoutDialog } from '../components/LogoutDialog';
import { User } from '../constants/types';
import { getLoggedInUser, login as loginService, logout as logoutService, signup as signupService } from '../services/authentication';
type AuthContextType = {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isLoadingUser: boolean;
  user: User | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoadingUser(true);
    getLoggedInUser().then(user => {
      setUser(user);
    }).finally(() => {
      setIsLoadingUser(false);
    });
  }, []);

  const signup = async (email: string, password: string) => {
    await signupService(email, password).then(user => {
      setUser(user);
      navigate(location.state?.location ?? '/');
    });
  };

  const login = async (email: string, password: string) => {
    await loginService(email, password).then(user => {
      setUser(user);
      navigate(location.state?.location ?? '/');
    });
  };

  const logout = async () => {
    setIsLogoutModalOpen(true);
    await logoutService()
      .then(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLogoutModalOpen(false);
      });
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoadingUser, signup, login, logout, isLoggedIn }}>
      {children}
      <LogoutDialog isOpen={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen} />
    </AuthContext.Provider>
  );
};
