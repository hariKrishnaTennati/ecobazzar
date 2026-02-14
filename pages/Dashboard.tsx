import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { PRODUCTS } from '../services/mockData';
import { useCart } from '../services/cartContext';
import { useWishlist } from '../services/wishlistContext';
import { ShoppingCart, Leaf, TrendingUp, AlertTriangle, Search, Sparkles, X, Filter, Plus, Heart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";

const CHART_DATA = [
  { name: 'Mon', footprint: 12 },
  { name: 'Tue', footprint: 8 },
  { name: 'Wed', footprint: 15 },
  { name: 'Thu', footprint: 5 },
  { name: 'Fri', footprint: 10 },
  { name: 'Sat', footprint: 22 },
  { name: 'Sun', footprint: 7 },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [ecoScoreFilter, setEcoScoreFilter] = useState('All');

  // AI States
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{text: string, productIds: number[]} | null>(null);

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  const ecoScores = ['All', 'A', 'B', 'C', 'D', 'E'];

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-lime-100 text-lime-800 border-lime-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    setAiRecommendation(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are an eco-friendly personal shopping assistant for "EcoBazaarX".
        I have the following list of products:
        ${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, category: p.category, ecoScore: p.ecoScore, description: p.name })))}
        
        The user is asking: "${aiQuery}"
        
        Please analyze the user's request and the available products. 
        Return a JSON object with:
        1. "recommendationText": A brief, helpful, and eco-conscious message explaining your choices (max 2 sentences).
        2. "recommendedProductIds": An array of product IDs that best match the user's needs.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendationText: { type: Type.STRING },
              recommendedProductIds: { 
                type: Type.ARRAY,
                items: { type: Type.INTEGER }
              }
            },
            required: ["recommendationText", "recommendedProductIds"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      if (result.recommendedProductIds && result.recommendedProductIds.length > 0) {
        setAiRecommendation({
          text: result.recommendationText,
          productIds: result.recommendedProductIds
        });
        // Clear manual filters when AI is used to show relevant results clearly
        setCategoryFilter('All');
        setEcoScoreFilter('All');
        setSearchTerm('');
      } else {
         setAiRecommendation({
          text: "I couldn't find any specific products matching that description, but here are some of our top eco-friendly picks.",
          productIds: []
        });
      }

    } catch (error) {
      console.error("AI Error:", error);
      setAiRecommendation({
        text: "Sorry, I'm having trouble connecting to the eco-brain right now. Please try again later.",
        productIds: []
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const clearAi = () => {
    setAiRecommendation(null);
    setAiQuery('');
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    // Apply AI Filter if exists
    if (aiRecommendation && aiRecommendation.productIds.length > 0) {
      result = result.filter(p => aiRecommendation.productIds.includes(p.id));
    }

    // Apply Manual Filters
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (ecoScoreFilter !== 'All') {
      result = result.filter(p => p.ecoScore === ecoScoreFilter);
    }
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerTerm) || p.category.toLowerCase().includes(lowerTerm));
    }

    return result;
  }, [searchTerm, categoryFilter, ecoScoreFilter, aiRecommendation]);

  const handleProductClick = (id: number) => {
    navigate(`/order/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Eco-Impact Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your carbon footprint and discover sustainable choices.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-eco-50 p-4 rounded-lg text-center min-w-[120px]">
              <div className="text-2xl font-bold text-eco-700">12.5kg</div>
              <div className="text-xs text-eco-600 font-medium uppercase tracking-wide">CO2 Saved</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center min-w-[120px]">
              <div className="text-2xl font-bold text-blue-700">340</div>
              <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">Green Points</div>
            </div>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="bg-gradient-to-r from-eco-600 to-eco-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              Smart Eco-Assistant
            </h2>
            <p className="text-eco-100 mb-4 text-sm">
              Not sure what to buy? Ask our AI for personalized, sustainable recommendations based on your needs.
            </p>
            
            <form onSubmit={handleAiSearch} className="relative">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ex: I need a sustainable gift for a hiker..."
                className="w-full pl-4 pr-32 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-lg"
              />
              <button 
                type="submit" 
                disabled={isAiLoading}
                className="absolute right-1 top-1 bottom-1 bg-eco-800 hover:bg-eco-900 text-white px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-70"
              >
                {isAiLoading ? 'Thinking...' : 'Ask AI'}
              </button>
            </form>
            
            {aiRecommendation && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 animate-fade-in flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm font-medium text-white">💡 Recommendation:</p>
                  <p className="text-sm text-eco-50 mt-1">{aiRecommendation.text}</p>
                </div>
                <button onClick={clearAi} className="text-eco-200 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Products */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search & Filters Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-10">
              <div className="relative w-full md:w-auto md:flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-eco-500 focus:ring-1 focus:ring-eco-500 outline-none text-sm"
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-32">
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm focus:border-eco-500 focus:ring-1 focus:ring-eco-500 outline-none bg-white cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 pointer-events-none" />
                </div>
                
                <div className="relative flex-1 md:w-32">
                   <select 
                    value={ecoScoreFilter}
                    onChange={(e) => setEcoScoreFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-sm focus:border-eco-500 focus:ring-1 focus:ring-eco-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="All">Score: All</option>
                    {ecoScores.filter(s => s !== 'All').map(s => <option key={s} value={s}>Score {s}</option>)}
                  </select>
                  <Leaf className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-eco-600" />
                {aiRecommendation ? 'Recommended for You' : 'All Products'}
                <span className="text-sm font-normal text-gray-500 ml-2">({filteredProducts.length} items)</span>
              </h2>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                <p className="text-gray-500">No products found matching your criteria.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setCategoryFilter('All'); setEcoScoreFilter('All'); clearAi();}}
                  className="mt-2 text-eco-600 hover:text-eco-700 font-medium text-sm"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    onClick={() => handleProductClick(product.id)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-eco-200 transition-all cursor-pointer group flex flex-col h-full relative"
                  >
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                        ${product.price.toFixed(2)}
                      </div>
                      
                      <button 
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm z-10 ${
                          isInWishlist(product.id) 
                            ? 'bg-pink-500 text-white' 
                            : 'bg-white/90 text-gray-400 hover:text-pink-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-eco-700 px-4 py-2 rounded-full font-medium text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">{product.category}</span>
                          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-eco-600 transition-colors">{product.name}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-bold border ${getScoreColor(product.ecoScore)}`}>
                          Score {product.ecoScore}
                        </span>
                      </div>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {product.carbonFootprint} kg CO2e
                        </div>
                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="p-2 bg-eco-50 text-eco-600 rounded-full hover:bg-eco-600 hover:text-white transition-colors shadow-sm z-10 relative"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Stats & Insights */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Footprint</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA}>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{fill: '#f0fdf4'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="footprint" radius={[4, 4, 0, 0]}>
                      {CHART_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.footprint > 15 ? '#fca5a5' : '#4ade80'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">kg CO2e per day</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-orange-900">Impact Alert</h4>
                  <p className="text-sm text-orange-800 mt-1">
                    Your footprint was higher on Saturday. Consider grouping deliveries to reduce emissions.
                  </p>
                </div>
              </div>
            </div>

             <div className="bg-eco-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
               <div className="relative z-10">
                  <h4 className="font-bold text-lg">Eco-Challenge</h4>
                  <p className="text-eco-100 text-sm mt-2 mb-4">Purchase 3 locally sourced items this week to earn a badge.</p>
                  <div className="w-full bg-eco-800 rounded-full h-2 mb-1">
                    <div className="bg-white h-2 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                  <span className="text-xs text-eco-200">1/3 Completed</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;