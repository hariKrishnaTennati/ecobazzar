import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../services/cartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Leaf, ShieldCheck } from 'lucide-react';
import { HistoryItem } from '../types';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice, totalCO2, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Convert Cart Items to History Items
    const newOrders: HistoryItem[] = items.map(item => ({
      id: `ORD-2024-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toISOString().split('T')[0],
      productName: item.name,
      price: item.price * item.quantity,
      co2Saved: item.carbonFootprint * item.quantity,
      quantity: item.quantity,
      status: 'Processing'
    }));

    // Update Local Storage History
    const existingHistory = JSON.parse(localStorage.getItem('ecobazaar_orders') || '[]');
    localStorage.setItem('ecobazaar_orders', JSON.stringify([...newOrders, ...existingHistory]));

    // Clear Cart
    clearCart();
    setCheckoutComplete(true);
    setIsCheckingOut(false);
  };

  if (checkoutComplete) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-eco-100 p-12 text-center mt-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for your sustainable purchase. You've just saved <strong className="text-eco-600">{totalCO2.toFixed(1)}kg</strong> of CO2!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/history')}
              className="px-6 py-3 bg-eco-600 text-white rounded-lg hover:bg-eco-700 transition-colors font-medium"
            >
              Track Orders
            </button>
            <button
              onClick={() => { setCheckoutComplete(false); navigate('/dashboard'); }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't added any sustainable goodies yet.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-eco-600 text-white rounded-lg hover:bg-eco-700 transition-colors font-medium"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-50" />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                    <div className="flex items-center gap-2 text-sm text-eco-600 font-medium bg-eco-50 w-fit px-2 py-1 rounded">
                      <Leaf className="w-3 h-3" />
                      Footprint: {item.carbonFootprint}kg / item
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <span className="font-bold text-lg text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping (Carbon Neutral)</span>
                    <span className="text-eco-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-eco-700 bg-eco-50 p-3 rounded-lg text-sm">
                    <span className="flex items-center gap-2"><Leaf className="w-4 h-4" /> Total CO2 Saved</span>
                    <span className="font-bold">{totalCO2.toFixed(1)} kg</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">Total</span>
                    <span className="font-bold text-gray-900 text-xl">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3 bg-eco-600 text-white rounded-xl font-bold hover:bg-eco-700 transition-colors shadow-lg shadow-eco-200 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isCheckingOut ? 'Processing...' : (
                    <>
                      Checkout
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-gray-400 mt-4">Secure Checkout powered by EcoPay</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;