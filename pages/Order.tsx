import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { PRODUCTS } from '../services/mockData';
import { useCart } from '../services/cartContext';
import { useWishlist } from '../services/wishlistContext';
import { 
  ArrowLeft, Leaf, Truck, ShieldCheck, CreditCard, 
  ShoppingBag, Award, Heart, ShoppingCart, Info, 
  MapPin, CheckCircle, ArrowRight, Wallet
} from 'lucide-react';
import { HistoryItem } from '../types';

type CheckoutStep = 'DETAILS' | 'SHIPPING' | 'PAYMENT' | 'CONFIRM';

const Order: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Workflow States
  const [step, setStep] = useState<CheckoutStep>('DETAILS');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Form States
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const product = PRODUCTS.find(p => p.id === Number(id));

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-eco-600 hover:text-eco-700 font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const handleFinalOrder = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newOrder: HistoryItem = {
      id: `ORD-2024-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split('T')[0],
      productName: product.name,
      price: product.price,
      co2Saved: product.carbonFootprint,
      quantity: 1,
      status: 'Processing'
    };

    const existingHistory = JSON.parse(localStorage.getItem('ecobazaar_orders') || '[]');
    localStorage.setItem('ecobazaar_orders', JSON.stringify([newOrder, ...existingHistory]));

    setOrderComplete(true);
    setIsProcessing(false);
  };

  const renderProgressBar = () => {
    const steps: { label: string; key: CheckoutStep }[] = [
      { label: 'Details', key: 'DETAILS' },
      { label: 'Shipping', key: 'SHIPPING' },
      { label: 'Payment', key: 'PAYMENT' }
    ];

    return (
      <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((s, idx) => {
          const isCompleted = steps.findIndex(x => x.key === step) > idx;
          const isActive = step === s.key;
          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted ? 'bg-eco-600 border-eco-600 text-white' : 
                  isActive ? 'border-eco-600 text-eco-600 ring-4 ring-eco-50' : 
                  'border-gray-300 text-gray-300'
                }`}>
                  {isCompleted ? <CheckCircle size={20} /> : <span>{idx + 1}</span>}
                </div>
                <span className={`text-xs mt-2 font-bold uppercase tracking-tight ${isActive ? 'text-eco-700' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                  steps.findIndex(x => x.key === step) > idx ? 'bg-eco-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  if (orderComplete) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-eco-100 p-8 text-center mt-10 animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-8">
            Your sustainable delivery for <strong>{product.name}</strong> is on its way to:<br/>
            <span className="text-sm italic text-gray-500">{address.street}, {address.city}</span>
          </p>
          <div className="bg-eco-50 p-4 rounded-xl mb-8 flex items-center justify-center gap-3 border border-eco-100">
             <Leaf className="text-eco-600" />
             <span className="text-eco-800 font-bold">Total Environmental Impact: {product.carbonFootprint}kg CO2e Saved</span>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/history')}
              className="px-6 py-3 bg-eco-600 text-white rounded-lg hover:bg-eco-700 transition-all font-bold shadow-md shadow-eco-100"
            >
              Order History
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-bold"
            >
              Shop More
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => step === 'DETAILS' ? navigate('/dashboard') : setStep('DETAILS')}
          className="flex items-center text-gray-500 hover:text-eco-600 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {step === 'DETAILS' ? 'Back to Dashboard' : 'Previous Step'}
        </button>

        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Fixed Product Summary */}
          <div className="relative bg-gray-50 flex flex-col h-full border-r border-gray-100">
             <div className="h-72 overflow-hidden">
               <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
             </div>
             <div className="p-8">
               <div className="flex justify-between items-start mb-4">
                 <div>
                    <span className="text-xs font-black text-eco-600 uppercase tracking-widest">{product.category}</span>
                    <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
                 </div>
                 <button 
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded-lg shadow-sm transition-all ${
                      isInWishlist(product.id) ? 'bg-pink-500 text-white' : 'bg-white text-gray-300 hover:text-pink-500'
                    }`}
                 >
                   <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                 </button>
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium text-sm">Unit Price</span>
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-eco-700 font-medium text-sm flex items-center gap-1">
                      <Leaf size={14} /> Carbon Footprint
                    </span>
                    <span className="font-bold text-eco-700">{product.carbonFootprint} kg CO2e</span>
                 </div>
                 <div className="flex justify-between items-center py-2">
                    <span className="text-gray-900 font-bold text-lg">Total</span>
                    <span className="font-black text-2xl text-eco-600">${product.price.toFixed(2)}</span>
                 </div>
               </div>

               <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200 flex items-start gap-3">
                 <Truck className="text-gray-400 mt-1" size={18} />
                 <p className="text-xs text-gray-500">Free carbon-neutral shipping included with this purchase.</p>
               </div>
             </div>
          </div>

          {/* Right Column: Dynamic Steps */}
          <div className="p-8 md:p-12">
            {renderProgressBar()}

            {step === 'DETAILS' && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Info className="text-eco-600" size={20} />
                  Product Insights
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  This product has earned an <strong>EcoScore {product.ecoScore}</strong>. It utilizes high-efficiency production methods that reduce its lifecycle carbon emissions significantly compared to standard alternatives.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-eco-50 rounded-xl border border-eco-100">
                    <Award className="text-eco-600 mb-2" size={24} />
                    <h4 className="font-bold text-sm text-eco-900">Certified Green</h4>
                    <p className="text-[10px] text-eco-700">100% Sustainable sourcing verified.</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <ShieldCheck className="text-blue-600 mb-2" size={24} />
                    <h4 className="font-bold text-sm text-blue-900">Buyer Protected</h4>
                    <p className="text-[10px] text-blue-700">Eco-refund guarantee active.</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setStep('SHIPPING')}
                  className="w-full mt-8 py-4 bg-eco-600 hover:bg-eco-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  Proceed to Shipping
                  <ArrowRight size={20} />
                </button>
              </div>
            )}

            {step === 'SHIPPING' && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="text-eco-600" size={20} />
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Street Address</label>
                    <input 
                      type="text" 
                      placeholder="123 Eco Lane"
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-eco-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                      <input 
                        type="text" 
                        placeholder="Greenwood"
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-eco-500 outline-none text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">ZIP Code</label>
                      <input 
                        type="text" 
                        placeholder="10001"
                        value={address.zip}
                        onChange={(e) => setAddress({...address, zip: e.target.value})}
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-eco-500 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={!address.street || !address.city}
                  onClick={() => setStep('PAYMENT')}
                  className="w-full mt-8 py-4 bg-eco-600 hover:bg-eco-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                  <ArrowRight size={20} />
                </button>
              </div>
            )}

            {step === 'PAYMENT' && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Wallet className="text-eco-600" size={20} />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {['Credit Card', 'EcoPay Points', 'Carbon Offset Credits'].map((method) => (
                    <div 
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        paymentMethod === method ? 'border-eco-600 bg-eco-50' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${paymentMethod === method ? 'bg-eco-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <CreditCard size={18} />
                        </div>
                        <span className={`font-bold text-sm ${paymentMethod === method ? 'text-eco-900' : 'text-gray-500'}`}>
                          {method}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === method ? 'border-eco-600 bg-eco-600' : 'border-gray-300'
                      }`}>
                        {paymentMethod === method && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleFinalOrder}
                  disabled={isProcessing}
                  className="w-full mt-8 py-4 bg-eco-600 hover:bg-eco-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                >
                  {isProcessing ? 'Validating...' : 'Complete Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Order;