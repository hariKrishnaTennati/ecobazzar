import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';

const AuthContext = createContext<AuthState | undefined>(undefined);

// Helper to simulate SHA-256 hashing using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simulated "Database" using localStorage
const USERS_KEY = 'ecobazaar_users';
const SESSION_KEY = 'ecobazaar_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem(SESSION_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const usersStr = localStorage.getItem(USERS_KEY);
      const users: User[] = usersStr ? JSON.parse(usersStr) : [];
      
      const foundUser = users.find(u => u.email === email);
      if (!foundUser) {
        throw new Error("User not found.");
      }

      const hashedInput = await hashPassword(pass);
      if (foundUser.passwordHash !== hashedInput) {
        throw new Error("Invalid password.");
      }

      setUser(foundUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(foundUser));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const usersStr = localStorage.getItem(USERS_KEY);
      const users: User[] = usersStr ? JSON.parse(usersStr) : [];

      if (users.some(u => u.email === email)) {
        throw new Error("Email already registered.");
      }

      const passwordHash = await hashPassword(pass);
      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        passwordHash
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Auto login after signup
      setUser(newUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name: string, email: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      if (!user) throw new Error("No user logged in.");

      const usersStr = localStorage.getItem(USERS_KEY);
      const users: User[] = usersStr ? JSON.parse(usersStr) : [];

      // Check for email conflict if email changed
      if (email !== user.email && users.some(u => u.email === email && u.id !== user.id)) {
        throw new Error("Email already in use.");
      }

      const updatedUser = { ...user, name, email };
      
      // Update in "Database"
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

      // Update Session
      setUser(updatedUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, updateProfile, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};