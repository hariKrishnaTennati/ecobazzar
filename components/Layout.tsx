import React from 'react';
import { useAuth } from '../services/authContext';
import { useCart } from '../services/cartContext';
import { useWishlist } from '../services/wishlistContext';
import { LogOut, Leaf, ShoppingCart, Heart, User as UserIcon, Clock, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-eco-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-eco-100 p-2 rounded-full">
                  <Leaf className="h-6 w-6 text-eco-600" />
                </div>
                <span className="font-bold text-xl tracking-tight text-eco-900">
                  EcoBazaar<span className="text-eco-600">X</span>
                </span>
              </Link>
              
              {user && (
                <div className="hidden md:flex ml-10 items-baseline space-x-4">
                  <Link 
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-eco-50 text-eco-700' : 'text-gray-600 hover:text-eco-600'}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/history"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/history') ? 'bg-eco-50 text-eco-700' : 'text-gray-600 hover:text-eco-600'}`}
                  >
                    History
                  </Link>
                  <Link 
                    to="/about"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about') ? 'bg-eco-50 text-eco-700' : 'text-gray-600 hover:text-eco-600'}`}
                  >
                    About
                  </Link>
                </div>
              )}
            </div>
            
            {user && (
              <div className="flex items-center gap-2 md:gap-4">
                <Link to="/wishlist" className="relative p-2 rounded-full hover:bg-pink-50 text-gray-500 hover:text-pink-600 transition-colors" title="Wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-pink-500 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link to="/cart" className="relative p-2 rounded-full hover:bg-eco-50 text-gray-500 hover:text-eco-600 transition-colors" title="Cart">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-eco-600 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>

                <Link to="/profile" className="hidden md:flex flex-col items-end mr-2 group cursor-pointer">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-eco-700 transition-colors">{user.name}</span>
                  <span className="text-xs text-eco-600 font-medium">Eco-Shopper</span>
                </Link>
                
                <button 
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; 2024 EcoBazaarX. Reducing carbon footprints one purchase at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;