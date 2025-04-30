import React, { createContext, useContext, useState, useEffect } from 'react';

const api = import.meta.env.VITE_API_URL;

type AuthUser = {
  email: string;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
};

// context type
type AuthContextType = {
  user: AuthUser | null;
  generateOtp: (email: string) => Promise<void>;
  verifyOtp: (enteredOtp: string) => Promise<boolean>;
  resetOtp: () => void;
  logout: () => void;
  isOtpValid: () => boolean;
  getRemainingTime: () => number;
  verifyEmail: (email: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  generateOtp: async () => {},
  verifyOtp: async () => false,
  resetOtp: () => {},
  logout: () => {},
  isOtpValid: () => false,
  getRemainingTime: () => 0,
  verifyEmail: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  
    const storedExpiry = localStorage.getItem('otp_expiry');
    if (storedExpiry) {
      setOtpExpiry(new Date(storedExpiry));
    }
  
    setLoading(false);
  }, []);
  
  if (loading) return null;
  

  const verifyEmail = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (isValid) {
      const verifiedUser = { email, isAuthenticated: false, isEmailVerified: true };
      setUser(verifiedUser);
      localStorage.setItem('authUser', JSON.stringify(verifiedUser));
      return true;
    }
    return false;
  };

  const generateOtp = async (email: string) => {
    try {
      const res = await fetch(`${api}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      if (!res.ok) throw new Error('Failed to send OTP');
  
      const expiry = new Date(Date.now() + 30 * 1000);
      setOtpExpiry(expiry);
      localStorage.setItem('otp_expiry', expiry.toISOString());
      localStorage.setItem('otp_email', email);
    } catch (err) {
      console.error('Error sending OTP:', err);
    }
  };
  
  const verifyOtp = async (enteredOtp: string): Promise<boolean> => {
    const email = localStorage.getItem('otp_email');
    if (!email) return false;
  
    try {
      const res = await fetch(`${api}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });
  
      if (res.ok) {
        const authenticatedUser = { email, isAuthenticated: true, isEmailVerified: true };
        setUser(authenticatedUser);
        localStorage.setItem('authUser', JSON.stringify(authenticatedUser));
        return true;
      }
  
      return false;
    } catch (err) {
      console.error('OTP verification error:', err);
      return false;
    }
  };

  const resetOtp = () => {
    setOtpExpiry(null);
    localStorage.removeItem('otp_expiry');
    localStorage.removeItem('otp_email');
  };

  const logout = () => {
    setUser(null);
    resetOtp();
    localStorage.removeItem('authUser');
  };

  const isOtpValid = () => {
    return otpExpiry ? new Date() < otpExpiry : false;
  };

  const getRemainingTime = () => {
    if (!otpExpiry) return 0;
    const now = new Date();
    const diff = otpExpiry.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / 1000));
  };

  const value: AuthContextType = {
    user,
    generateOtp,
    verifyOtp,
    resetOtp,
    logout,
    isOtpValid,
    getRemainingTime,
    verifyEmail,
  };

  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
