import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { Leaf, User, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { signup, error: authError } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!name || !email || !password) {
      setLocalError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-[90vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-stagger">
          <div className="bg-white/40 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/40 relative overflow-hidden group hover:border-eco-300 transition-all duration-700">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />

            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-200 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Join EcoBazaar<span className="text-eco-600">X</span></h2>
                <p className="mt-3 text-gray-500 font-medium">Start your sustainable journey today.</p>
              </div>

              {(localError || authError) && (
                <div className="mb-6 rounded-2xl bg-red-50/50 backdrop-blur-md p-4 border border-red-200/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm font-bold text-red-800">{localError || authError}</p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-emerald-600">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border border-transparent group-hover/input:border-white/40 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-900"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-emerald-600">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border border-transparent group-hover/input:border-white/40 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-900"
                      placeholder="Email address"
                    />
                  </div>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-emerald-600">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border border-transparent group-hover/input:border-white/40 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-900"
                      placeholder="Create Password"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gray-900 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-gray-200 hover:shadow-emerald-200 transition-all duration-300 transform active:scale-95 disabled:opacity-50 group/btn"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Get Started Early
                        <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500 font-medium">
                    Already have an account? {' '}
                    <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-bold underline decoration-2 underline-offset-4 decoration-emerald-200 hover:decoration-emerald-500 transition-all">
                      Log in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Signup;