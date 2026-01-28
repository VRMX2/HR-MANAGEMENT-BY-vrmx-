import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadToCloudinary } from '../services/cloudinary';
import { User, Lock, Bell, Globe, Moon, Loader2, Camera, CheckCircle, Save } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Settings() {
  const { currentUser, userData, updateUserProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Security State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preferences State
  const [preferences, setPreferences] = useState({
      language: 'en',
      region: 'US',
      notifications: {
          email: true,
          push: true,
          updates: false
      },
      theme: 'dark'
  });

  useEffect(() => {
    if (currentUser) {
      const names = (currentUser.displayName || '').split(' ');
      setFirstName(names[0] || '');
      setLastName(names.slice(1).join(' ') || '');
      setAvatarPreview(currentUser.photoURL);
    }
    if (userData) {
      setBio(userData.bio || '');
      // Merge saved preferences if they exist
      if (userData.preferences) {
          setPreferences(prev => ({ ...prev, ...userData.preferences }));
      }
    }
  }, [currentUser, userData]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setIsLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      await updateUserProfile({ photoURL: url });
      setMessage({ type: 'success', text: 'Avatar updated successfully!' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to upload image.' });
    }
    setIsLoading(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const displayName = `${firstName} ${lastName}`.trim();
      await updateUserProfile({ displayName, bio });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
       setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
    setIsLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match.' });
        return;
    }
    if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
        return;
    }

    setIsLoading(true);
    try {
        await changePassword(newPassword);
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setNewPassword('');
        setConfirmPassword('');
    } catch (error) {
        setMessage({ type: 'error', text: 'Failed to change password. Recent login required.' });
    }
    setIsLoading(false);
  };

  const handlePreferenceSave = async () => {
      setIsLoading(true);
      try {
          // Save specific preference to Firestore user doc
          // We can use updateUserProfile wrapper OR direct firestore update
          const userRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userRef, {
              preferences: preferences
          });
          setMessage({ type: 'success', text: 'Preferences saved!' });
      } catch (error) {
          console.error(error);
          setMessage({ type: 'error', text: 'Failed to save preferences.' });
      }
      setIsLoading(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'region', label: 'Language & Region', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Moon },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
            <nav className="flex flex-col">
              {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMessage(null); }}
                    className={`flex items-center gap-3 px-4 py-3 font-medium text-sm transition-colors ${
                        activeTab === tab.id 
                            ? 'bg-primary-500/10 text-primary-500 border-l-2 border-primary-500' 
                            : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                    }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
                {message.type === 'success' ? <CheckCircle size={20} /> : <Lock size={20} />}
                {message.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                <h2 className="text-lg font-bold text-white mb-6">Profile Information</h2>
                
                <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-dark-900 border-2 border-primary-500/30">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-primary-500 to-purple-600">
                                {firstName?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                        <Camera className="text-white" size={24} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                    {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full"><Loader2 className="animate-spin text-white" /></div>}
                </div>
                <div>
                    <h3 className="text-white font-medium">Profile Photo</h3>
                    <p className="text-xs text-gray-500 mt-1">Click the photo to upload. JPG, PNG or GIF.</p>
                </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                    <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" 
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                    <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" 
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <input type="email" value={currentUser?.email || ''} disabled className="w-full bg-dark-900/50 border border-dark-700 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                    <textarea 
                        rows="4" 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" 
                        placeholder="Tell us about yourself..."
                    ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && <Loader2 size={18} className="animate-spin" />}
                        Save Changes
                    </button>
                </div>
                </form>
            </div>
          )}

          {activeTab === 'security' && (
             <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                <h2 className="text-lg font-bold text-white mb-6">Security Settings</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                        <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onFocus={() => setMessage(null)}
                            className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" 
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" 
                            placeholder="Confirm new password"
                        />
                    </div>
                     <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                            Update Password
                        </button>
                    </div>
                </form>
             </div>
          )}

          {activeTab === 'notifications' && (
              <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                <h2 className="text-lg font-bold text-white mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-medium">Email Notifications</h3>
                            <p className="text-sm text-gray-400">Receive daily summaries and alerts via email.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={preferences.notifications.email} 
                                onChange={(e) => setPreferences(prev => ({ ...prev, notifications: { ...prev.notifications, email: e.target.checked } }))} 
                            />
                            <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                    </div>
                    {/* More toggles... */}
                    <div className="pt-4 flex justify-end">
                        <button 
                             onClick={handlePreferenceSave}
                             className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/20 flex items-center gap-2"
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                            <Save size={18} />
                            Save Preferences
                        </button>
                    </div>
                </div>
              </div>
          )}

          {activeTab === 'region' && (
              <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                <h2 className="text-lg font-bold text-white mb-6">Language & Region</h2>
                <div className="space-y-4 max-w-md">
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Language</label>
                        <select 
                            value={preferences.language} 
                            onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                            className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                        >
                            <option value="en">English (US)</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Region Format</label>
                         <select 
                            value={preferences.region} 
                            onChange={(e) => setPreferences(prev => ({ ...prev, region: e.target.value }))}
                             className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                         >
                            <option value="US">United States (MM/DD/YYYY)</option>
                            <option value="UK">United Kingdom (DD/MM/YYYY)</option>
                        </select>
                     </div>
                     <div className="pt-4">
                        <button 
                             onClick={handlePreferenceSave}
                             className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/20 flex items-center gap-2"
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                             <Save size={18} />
                            Save
                        </button>
                    </div>
                </div>
              </div>
          )}

          {activeTab === 'appearance' && (
              <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                <h2 className="text-lg font-bold text-white mb-6">Appearance</h2>
                <div className="grid grid-cols-2 gap-4 max-w-lg">
                    <button 
                         onClick={() => setPreferences(prev => ({ ...prev, theme: 'dark' }))}
                         className={`p-4 rounded-xl border text-left ${preferences.theme === 'dark' ? 'border-primary-500 bg-primary-500/10' : 'border-dark-700 hover:bg-dark-700'}`}
                    >
                        <div className="w-full h-24 bg-dark-900 rounded-lg mb-3 border border-dark-700"></div>
                        <span className="font-medium text-white block">Dark Mode</span>
                        <span className="text-xs text-gray-500">Default for high contrast</span>
                    </button>
                    <button 
                         onClick={() => setPreferences(prev => ({ ...prev, theme: 'light' }))}
                         className={`p-4 rounded-xl border text-left ${preferences.theme === 'light' ? 'border-primary-500 bg-primary-500/10' : 'border-dark-700 hover:bg-dark-700'}`}
                    >
                        <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 border border-gray-200"></div>
                         <span className="font-medium text-white block">Light Mode</span>
                        <span className="text-xs text-gray-500">Clean and bright (coming soon)</span>
                    </button>
                </div>
                 <div className="pt-6">
                    <button 
                         onClick={handlePreferenceSave}
                         className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/20 flex items-center gap-2"
                    >
                        {isLoading && <Loader2 size={18} className="animate-spin" />}
                         <Save size={18} />
                        Save Setting
                    </button>
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
