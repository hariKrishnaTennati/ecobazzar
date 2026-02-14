import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { HistoryItem } from '../types';
import { INITIAL_HISTORY } from '../services/mockData';
import { Clock, CheckCircle, Truck, Package, XCircle, Leaf } from 'lucide-react';

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load local orders from storage. If empty, seed with INITIAL_HISTORY
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Shipped': return <Truck className="h-5 w-5 text-blue-500" />;
      case 'Processing': return <Clock className="h-5 w-5 text-orange-500" />;
      case 'Cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-eco-100 p-2 rounded-lg">
              <Clock className="h-6 w-6 text-eco-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
              <p className="text-gray-600 text-sm">Track your past eco-friendly contributions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Footprint</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Impact</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historyItems.map((item) => {
                  // Default to 1 if quantity is missing (for backwards compatibility with old data)
                  const qty = item.quantity || 1;
                  const unitFootprint = item.co2Saved / qty;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{qty}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className={item.status === 'Cancelled' ? 'text-red-500 line-through' : ''}>{item.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        <div className="flex items-center justify-end gap-1">
                          <Leaf className="w-3 h-3 text-eco-400" />
                          {unitFootprint.toFixed(1)} kg/item
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-eco-600 font-medium">{item.co2Saved.toFixed(1)} kg</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {item.status === 'Processing' && (
                          <button 
                            onClick={() => cancelOrder(item.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-xs border border-red-200 bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default History;