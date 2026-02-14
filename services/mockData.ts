import { Product, HistoryItem } from '../types';

export const PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: "Bamboo Toothbrush Set", 
    price: 12.99, 
    category: "Personal Care", 
    image: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=800&auto=format&fit=crop", 
    carbonFootprint: 0.5, 
    ecoScore: 'A' 
  },
  { 
    id: 2, 
    name: "Recycled Denim Jacket", 
    price: 89.50, 
    category: "Fashion", 
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=800&auto=format&fit=crop", 
    carbonFootprint: 8.2, 
    ecoScore: 'B' 
  },
  { 
    id: 3, 
    name: "Organic Cotton T-Shirt", 
    price: 25.00, 
    category: "Fashion", 
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop", 
    carbonFootprint: 2.1, 
    ecoScore: 'A' 
  },
  { 
    id: 4, 
    name: "Solar Power Bank", 
    price: 45.00, 
    category: "Electronics", 
    image: "https://images.unsplash.com/photo-1635334544747-25e407844093?q=80&w=800&auto=format&fit=crop", 
    carbonFootprint: 12.5, 
    ecoScore: 'C' 
  },
  { 
    id: 5, 
    name: "Glass Water Bottle", 
    price: 18.00, 
    category: "Lifestyle", 
    image: "https://images.unsplash.com/photo-1602143407151-a111efd40bac?q=80&w=800&auto=format&fit=crop", 
    carbonFootprint: 1.2, 
    ecoScore: 'A' 
  },
  { 
    id: 6, 
    name: "Eco-Friendly Sneakers", 
    price: 110.00, 
    category: "Fashion", 
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop", 
    carbonFootprint: 9.8, 
    ecoScore: 'B' 
  },
  { 
    id: 7, 
    name: "Biodegradable Phone Case", 
    price: 35.00, 
    category: "Electronics", 
    image: "https://images.unsplash.com/photo-1603965005886-5387b32c6681?q=80&w=800&auto=format&fit=crop", 
    carbonFootprint: 1.5, 
    ecoScore: 'A' 
  },
  { 
    id: 8, 
    name: "Hemp Backpack", 
    price: 65.00, 
    category: "Fashion", 
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop", 
    carbonFootprint: 3.4, 
    ecoScore: 'A' 
  },
];

export const INITIAL_HISTORY: HistoryItem[] = [
  { id: 'ORD-2024-001', date: '2024-03-10', productName: 'Bamboo Toothbrush Set', price: 12.99, co2Saved: 0.5, quantity: 1, status: 'Delivered' },
  { id: 'ORD-2024-002', date: '2024-03-05', productName: 'Organic Cotton T-Shirt', price: 25.00, co2Saved: 2.1, quantity: 1, status: 'Delivered' },
  { id: 'ORD-2024-003', date: '2024-02-28', productName: 'Solar Power Bank', price: 45.00, co2Saved: 12.5, quantity: 1, status: 'Delivered' },
  { id: 'ORD-2024-004', date: '2024-02-15', productName: 'Glass Water Bottle', price: 18.00, co2Saved: 1.2, quantity: 1, status: 'Shipped' },
];