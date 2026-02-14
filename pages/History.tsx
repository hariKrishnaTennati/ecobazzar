import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { HistoryItem } from '../types';
import { INITIAL_HISTORY } from '../services/mockData';
import { Clock, CheckCircle, Truck, Package, XCircle, Leaf, Calendar } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const storedOrdersStr = localStorage.getItem('ecobazaar_orders');
    if (!storedOrdersStr) {
      localStorage.setItem('ecobazaar_orders', JSON.stringify(INITIAL_HISTORY));
      setHistoryItems(INITIAL_HISTORY);
    } else {
      setHistoryItems(JSON.parse(storedOrdersStr));
    }
  }, []);

  const cancelOrder = (orderId: string) => {
    const updatedHistory = historyItems.map(item =>
      item.id === orderId ? { ...item, status: 'Cancelled' as const } : item
    );
    setHistoryItems(updatedHistory);
    localStorage.setItem('ecobazaar_orders', JSON.stringify(updatedHistory));
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100/50 text-emerald-800 border-emerald-200/50';
      case 'Shipped': return 'bg-blue-100/50 text-blue-800 border-blue-200/50';
      case 'Processing': return 'bg-orange-100/50 text-orange-800 border-orange-200/50';
      case 'Cancelled': return 'bg-red-100/50 text-red-800 border-red-200/50';
      default: return 'bg-gray-100/50 text-gray-800 border-gray-200/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      case 'Shipped': return <Truck className="h-4 w-4" />;
      case 'Processing': return <Clock className="h-4 w-4" />;
      case 'Cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <AnimatedPage>
        <div className="space-y-10 animate-stagger">
          <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-white/40 group hover:border-eco-300 transition-all duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-eco-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="flex flex-col md:flex-row items-center gap-6 mb-12 relative z-10">
              <div className="bg-gradient-to-br from-eco-500 to-eco-700 p-5 rounded-3xl shadow-xl shadow-eco-200/50 group-hover:rotate-12 transition-all">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Purchase History</h1>
                <p className="text-gray-500 font-medium mt-1 uppercase text-xs tracking-widest">Track your past eco-friendly contributions</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/30 bg-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/20">
                  <thead className="bg-white/30 backdrop-blur-md">
                    <tr>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                      <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Impact</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                      <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {historyItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/20 transition-all group/row">
                        <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-gray-900">#{item.id}</td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{item.productName}</div>
                          <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 mt-1">
                            <Calendar size={12} /> {item.date}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-center">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black border tracking-wider transition-all group-hover/row:scale-105 ${getStatusStyle(item.status)}`}>
                            {getStatusIcon(item.status)}
                            {item.status.toUpperCase()}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2 text-eco-600 font-black">
                            <Leaf className="w-4 h-4" />
                            {item.co2Saved.toFixed(1)} <span className="text-[10px] opacity-70">KG</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-black text-gray-900">${item.price.toFixed(2)}</td>
                        <td className="px-8 py-6 whitespace-nowrap text-center">
                          {item.status === 'Processing' ? (
                            <button
                              onClick={() => cancelOrder(item.id)}
                              className="text-red-500 hover:text-white hover:bg-red-500 transition-all font-black text-[10px] uppercase border-2 border-red-500/20 px-4 py-2 rounded-xl active:scale-95"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    </Layout>
  );
};

export default History;


export default History;