export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Stored securely
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  carbonFootprint: number; // kg CO2e
  ecoScore: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface HistoryItem {
  id: string;
  date: string;
  productName: string;
  price: number;
  co2Saved: number;
  quantity: number;
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}