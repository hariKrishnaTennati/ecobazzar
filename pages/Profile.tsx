import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../services/authContext';
import { User, Mail, Save, User as UserIcon, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile, error: authError } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setIsSubmitting(true);
    
    try {
      await updateProfile(name, email);
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      // Error is handled by context/displayed via authError
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-eco-600 p-6 text-white flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-eco-100">Level 1 Eco-Shopper</p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
               {!isEditing && (
                 <button 
                   onClick={() => setIsEditing(true)}
                   className="text-eco-600 hover:text-eco-700 text-sm font-medium"
                 >
                   Edit Details
                 </button>
               )}
            </div>

            {(authError) && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                {authError}
              </div>
            )}
            
            {(successMsg) && (
              <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-eco-500 focus:border-eco-500 disabled:bg-gray-50 disabled:text-gray-500 py-3 border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-eco-500 focus:border-eco-500 disabled:bg-gray-50 disabled:text-gray-500 py-3 border"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setName(user.name); setEmail(user.email); setSuccessMsg(''); }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-eco-600 rounded-lg hover:bg-eco-700 disabled:opacity-70"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
             <Shield className="h-5 w-5 text-eco-600" />
             Account Security
           </h2>
           <p className="text-gray-600 text-sm mb-4">
             Your password is securely hashed using SHA-256. We do not store plain-text passwords.
           </p>
           <button className="text-gray-400 text-sm cursor-not-allowed" disabled>
             Change Password (Coming Soon)
           </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;