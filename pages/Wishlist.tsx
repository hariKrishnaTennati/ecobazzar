import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useWishlist } from '../services/wishlistContext';
import { useCart } from '../services/cartContext';
import { Heart, ShoppingCart, Filter, Plus, TrendingUp, ArrowRight, Leaf, Trash2 } from 'lucide-react';

const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(wishlist.map(p => p.category)))];

  const filteredWishlist = useMemo(() => {
    if (categoryFilter === 'All') return wishlist;
    return wishlist.filter(p => p.category === categoryFilter);
  }, [wishlist, categoryFilter]);

  const totalPotentialSaved = wishlist.reduce((acc, p) => acc + p.carbonFootprint, 0);

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-lime-100 text-lime-800 border-lime-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="text-pink-500 fill-current h-8 w-8" />
              Your Eco-Wishlist
            </h1>
            <p className="text-gray-600 mt-1">Saved sustainable products for future shopping.</p>
          </div>
          
          {wishlist.length > 0 && (
            <div className="bg-pink-50 border border-pink-100 px-6 py-4 rounded-xl flex items-center gap-4">
              <div className="bg-white p-2 rounded-full shadow-sm text-pink-600">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-pink-800">Potential CO2 Impact</div>
                <div className="text-lg font-bold text-pink-900">{totalPotentialSaved.toFixed(1)}kg Saved</div>
              </div>
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-pink-200" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Browse our catalog and save eco-friendly products you're interested in for later!
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-eco-600 text-white rounded-xl hover:bg-eco-700 transition-all shadow-lg shadow-eco-200 font-bold"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm w-fit">
              <span className="text-sm font-medium text-gray-500 ml-2">Filter by Category:</span>
              <div className="flex gap-2">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      categoryFilter === c 
                        ? 'bg-eco-600 text-white shadow-md' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWishlist.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group relative flex flex-col"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all z-10"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold border border-gray-100">
                      Score {product.ecoScore}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-4">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{product.category}</span>
                      <h3 className="font-bold text-gray-900 group-hover:text-eco-600 transition-colors line-clamp-1">{product.name}</h3>
                      <div className="text-lg font-bold text-gray-900 mt-1">${product.price.toFixed(2)}</div>
                    </div>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Impact:</span>
                        <span className="text-eco-600">{product.carbonFootprint}kg CO2e</span>
                      </div>

                      <div className="flex gap-2">
                         <button 
                          onClick={() => navigate(`/order/${product.id}`)}
                          className="flex-1 py-2 bg-eco-50 text-eco-700 rounded-lg text-sm font-bold hover:bg-eco-100 transition-colors flex items-center justify-center gap-2"
                        >
                          View
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => addToCart(product)}
                          className="p-2 bg-eco-600 text-white rounded-lg hover:bg-eco-700 transition-colors shadow-sm"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;