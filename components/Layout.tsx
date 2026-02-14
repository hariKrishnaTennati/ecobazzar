import React, { useEffect, useRef } from 'react';
import { useAuth } from '../services/authContext';
import { useCart } from '../services/cartContext';
import { useWishlist } from '../services/wishlistContext';
import { LogOut, Leaf, ShoppingCart, Heart, User as UserIcon, Clock, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThreeBackground from './ThreeBackground';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (navRef.current) {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    // Interactive Button/Link Hover Sound/Scale Logic
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });

    // Simple smooth scroll reveal for sections
    const sections = document.querySelectorAll('section, h2, .animate-stagger');
    sections.forEach(sec => {
      gsap.from(sec, {
        opacity: 0,
        y: 20,
        duration: 1,
        scrollTrigger: {
          trigger: sec,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen font-sans text-gray-900 overflow-x-hidden selection:bg-eco-200 selection:text-eco-900">
      {/* Dynamic 3D Environment */}
      <ThreeBackground />

      {/* Glassmorphic Navigation */}
      <nav
        ref={navRef}
        className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-3 group">
                <div className="bg-gradient-to-br from-eco-400 to-eco-600 p-2.5 rounded-2xl shadow-lg shadow-eco-200 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-gray-900">
                  EcoBazaar<span className="text-eco-600">X</span>
                </span>
              </Link>

              {user && (
                <div className="hidden md:flex ml-12 items-center space-x-6">
                  {['Dashboard', 'History', 'About'].map((item) => {
                    const path = `/${item.toLowerCase()}`;
                    return (
                      <Link
                        key={item}
                        to={path}
                        className={`relative px-1 py-2 text-sm font-semibold transition-all duration-300 group ${isActive(path) ? 'text-eco-700' : 'text-gray-500 hover:text-eco-600'
                          }`}
                      >
                        {item}
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-eco-500 transform origin-left transition-transform duration-300 ${isActive(path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`} />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {user && (
              <div className="flex items-center gap-3 md:gap-5">
                <Link
                  to="/wishlist"
                  className="relative p-2.5 rounded-xl hover:bg-pink-50/50 text-gray-500 hover:text-pink-600 transition-all duration-300 group"
                  title="Wishlist"
                >
                  <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="relative p-2.5 rounded-xl hover:bg-eco-50/50 text-gray-500 hover:text-eco-600 transition-all duration-300 group"
                  title="Cart"
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-eco-600 text-[10px] font-bold text-white ring-2 ring-white">
                      {totalItems}
                    </span>
                  )}
                </Link>

                <div className="h-8 w-px bg-gray-200 hidden md:block mx-2" />

                <Link to="/profile" className="hidden md:flex items-center gap-3 group cursor-pointer">
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900 group-hover:text-eco-700 transition-colors uppercase tracking-wider">{user.name}</div>
                    <div className="text-[10px] text-eco-600 font-bold uppercase tracking-widest bg-eco-50 px-1.5 py-0.5 rounded leading-none mt-1">Eco-Shopper</div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center border border-white group-hover:shadow-md transition-all">
                    <UserIcon className="h-5 w-5 text-gray-400 group-hover:text-eco-600" />
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl hover:bg-red-50/50 text-gray-500 hover:text-red-600 transition-all duration-300 group"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>

      <footer className="relative z-10 bg-white/30 backdrop-blur-md border-t border-white/20 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-5 w-5 text-eco-600" />
            <span className="font-bold text-lg text-gray-900 tracking-tight">EcoBazaarX</span>
          </div>
          <div className="text-center text-gray-500 text-sm max-w-md">
            <p>&copy; 2024 EcoBazaarX. Reducing carbon footprints one purchase at a time with sustainable tech and ethical commerce.</p>
          </div>
          <div className="flex gap-6 mt-4">
            {['Privacy', 'Terms', 'Environment'].map(link => (
              <a key={link} href="#" className="text-xs text-gray-400 hover:text-eco-600 transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;