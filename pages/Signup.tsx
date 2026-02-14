import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { Leaf, Lock, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { signup, error: authError } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setLocalError("All fields are required.");
      return false;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      // Simulating a success message briefly before redirect, though context usually handles redirect logic or state
      navigate('/dashboard');
    } catch (err) {
      // Error caught by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-eco-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-eco-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-eco-100 rounded-full flex items-center justify-center mb-4">
            <Leaf className="h-8 w-8 text-eco-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Join EcoBazaarX</h2>
          <p className="mt-2 text-sm text-gray-600">
            Start tracking your footprint and shopping smarter
          </p>
        </div>

        {(localError || authError) && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {localError || authError}
                </h3>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-eco-500 focus:border-eco-500 sm:text-sm transition-all"
                placeholder="Full Name"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-eco-500 focus:border-eco-500 sm:text-sm transition-all"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-eco-500 focus:border-eco-500 sm:text-sm transition-all"
                placeholder="Password (min 6 chars)"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckCircle className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-eco-500 focus:border-eco-500 sm:text-sm transition-all"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-eco-600 hover:bg-eco-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eco-500 transition-colors disabled:opacity-70"
            >
               {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-eco-600 hover:text-eco-500 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;