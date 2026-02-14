import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { PRODUCTS } from '../services/mockData';
import { useCart } from '../services/cartContext';
import { useWishlist } from '../services/wishlistContext';
import { ShoppingCart, Leaf, TrendingUp, AlertTriangle, Search, Sparkles, X, Filter, Plus, Heart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";
import AnimatedPage from '../components/AnimatedPage';
import gsap from 'gsap';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [ecoScoreFilter, setEcoScoreFilter] = useState('All');
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{ text: string, productIds: number[] } | null>(null);

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  const ecoScores = ['All', 'A', 'B', 'C', 'D', 'E'];

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'A': return 'bg-emerald-100/50 text-emerald-800 border-emerald-200/50';
      case 'B': return 'bg-lime-100/50 text-lime-800 border-lime-200/50';
      case 'C': return 'bg-yellow-100/50 text-yellow-800 border-yellow-200/50';
      case 'D': return 'bg-orange-100/50 text-orange-800 border-orange-200/50';
      default: return 'bg-red-100/50 text-red-800 border-red-200/50';
    }
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiRecommendation(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are an eco-friendly assistant for "EcoBazaarX"... ${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, category: p.category, ecoScore: p.ecoScore })))}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendationText: { type: Type.STRING },
              recommendedProductIds: { type: Type.ARRAY, items: { type: Type.INTEGER } }
            },
            required: ["recommendationText", "recommendedProductIds"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      if (result.recommendedProductIds && result.recommendedProductIds.length > 0) {
        setAiRecommendation({ text: result.recommendationText, productIds: result.recommendedProductIds });
        setCategoryFilter('All');
        setEcoScoreFilter('All');
        setSearchTerm('');
      } else {
        setAiRecommendation({ text: "I couldn't find matches, but here are top picks.", productIds: [] });
      }
    } catch (error) {
      setAiRecommendation({ text: "Error connecting to AI.", productIds: [] });
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (aiRecommendation && aiRecommendation.productIds.length > 0) {
      result = result.filter(p => aiRecommendation.productIds.includes(p.id));
    }
    if (categoryFilter !== 'All') result = result.filter(p => p.category === categoryFilter);
    if (ecoScoreFilter !== 'All') result = result.filter(p => p.ecoScore === ecoScoreFilter);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower));
    }
    return result;
  }, [searchTerm, categoryFilter, ecoScoreFilter, aiRecommendation]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Layout>
      <AnimatedPage>
        <div className="space-y-10">
          {/* Welcome Section */}
          <div className="animate-stagger bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/40 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-eco-300 transition-all duration-500">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Eco-Impact</h1>
              <p className="text-gray-500 font-medium mt-2">Sustainable choices for a greener future.</p>
            </div>
            <div className="flex gap-6">
              <div className="bg-gradient-to-br from-eco-500 to-eco-700 p-6 rounded-2xl text-center min-w-[150px] shadow-xl shadow-eco-200/50 transform group-hover:scale-105 transition-transform duration-500">
                <div className="text-3xl font-black text-white">12.5kg</div>
                <div className="text-[10px] text-eco-100 font-bold uppercase tracking-widest mt-1">CO2 Saved</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-center min-w-[150px] shadow-xl shadow-blue-200/50 transform group-hover:scale-105 transition-transform duration-500 delay-75">
                <div className="text-3xl font-black text-white">340</div>
                <div className="text-[10px] text-blue-100 font-bold uppercase tracking-widest mt-1">Green Points</div>
              </div>
            </div>
          </div>

          {/* AI Advisor Card */}
          <div className="animate-stagger relative overflow-hidden bg-gradient-to-br from-gray-900 to-eco-900 rounded-3xl shadow-2xl p-10 text-white border border-white/10 group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-eco-500/20 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:bg-eco-500/30 transition-all duration-700" />

            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-6">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs font-bold uppercase tracking-widest">Eco-AI Advisor</span>
                </div>
                <h2 className="text-4xl font-black mb-4 leading-tight">Find exactly what the Earth needs.</h2>
                <p className="text-eco-100/70 text-lg mb-8 max-w-md leading-relaxed font-medium">Ask our AI for personalized recommendations based on your unique lifestyle and sustainability goals.</p>

                <form onSubmit={handleAiSearch} className="relative group/form">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ex: Sustainable hiking gear..."
                    className="w-full bg-white/10 border border-white/20 pl-6 pr-32 py-5 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-4 focus:ring-eco-500/30 focus:bg-white/15 transition-all text-lg"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading}
                    className="absolute right-2 top-2 bottom-2 bg-eco-500 hover:bg-eco-400 text-white px-6 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {isAiLoading ? 'Analysis...' : 'Consult'}
                  </button>
                </form>
              </div>

              {aiRecommendation ? (
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 space-y-4 animate-in fade-in slide-in-from-right-10 duration-500">
                  <div className="bg-eco-500/20 p-4 rounded-2xl inline-block">
                    <Sparkles className="text-eco-400" />
                  </div>
                  <p className="text-xl font-medium leading-relaxed italic">"{aiRecommendation.text}"</p>
                  <button onClick={() => setAiRecommendation(null)} className="text-xs font-bold uppercase tracking-widest text-eco-400 hover:text-white transition-colors">Dismiss</button>
                </div>
              ) : (
                <div className="hidden md:flex flex-wrap gap-4 justify-center items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                  <Leaf size={100} className="rotate-12" />
                  <ShoppingCart size={80} className="-rotate-12" />
                  <Heart size={120} />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Products Side */}
            <div className="lg:col-span-3 space-y-8">
              <div className="animate-stagger flex flex-col md:flex-row gap-6 p-4 items-center justify-between sticky top-24 z-30 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-xl">
                <div className="relative w-full md:w-96 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-eco-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-white/20 focus:bg-white transition-all outline-none font-medium"
                  />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="flex-1 bg-white/50 border border-white/20 px-4 py-3 rounded-xl outline-none font-bold text-sm cursor-pointer hover:bg-white transition-colors"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={ecoScoreFilter}
                    onChange={(e) => setEcoScoreFilter(e.target.value)}
                    className="flex-1 bg-white/50 border border-white/20 px-4 py-3 rounded-xl outline-none font-bold text-sm cursor-pointer hover:bg-white transition-colors"
                  >
                    <option value="All">All Scores</option>
                    {ecoScores.filter(s => s !== 'All').map(s => <option key={s} value={s}>Score {s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/order/${p.id}`)}
                    className="animate-stagger group relative bg-white/40 backdrop-blur-xl rounded-3xl border border-white/40 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                  >
                    <div className="h-60 overflow-hidden relative">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full font-black text-xs shadow-lg">${p.price}</div>
                      <div className={`absolute top-4 left-4 border px-3 py-1.5 rounded-full font-black text-[10px] uppercase shadow-lg ${getScoreColor(p.ecoScore)}`}>Score {p.ecoScore}</div>
                    </div>
                    <div className="p-6">
                      <div className="text-[10px] text-eco-600 font-black uppercase tracking-widest mb-1">{p.category}</div>
                      <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-eco-600 transition-colors">{p.name}</h3>
                      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                          <TrendingUp size={14} className="text-eco-600" />
                          {p.carbonFootprint} kg CO2e
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, p)}
                          className="bg-eco-600 text-white p-3 rounded-2xl hover:bg-gray-900 transition-colors shadow-lg active:scale-90"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Side */}
            <div className="space-y-8 lg:sticky lg:top-24 h-fit">
              <div className="animate-stagger bg-white/60 backdrop-blur-2xl rounded-3xl p-8 border border-white/40 shadow-xl">
                <h3 className="text-xl font-black mb-8">Weekly Flow</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA}>
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontWeight: 'bold' }} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="footprint" radius={[10, 10, 10, 10]} barSize={12}>
                        {CHART_DATA.map((entry, i) => (
                          <Cell key={i} fill={entry.footprint > 15 ? '#f87171' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Safe</div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400"><div className="w-2 h-2 rounded-full bg-red-400" /> Warning</div>
                </div>
              </div>

              <div className="animate-stagger bg-eco-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <h4 className="text-xl font-black mb-2">Eco-Elite</h4>
                <p className="text-eco-100/70 text-sm font-medium mb-6">Complete 3 local orders this week to unlock the badge.</p>
                <div className="h-2.5 w-full bg-eco-900 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-1000" style={{ width: '33%' }} />
                </div>
                <div className="mt-3 text-xs font-bold tracking-widest uppercase opacity-60">1/3 Steps</div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    </Layout>
  );
};

export default Dashboard;