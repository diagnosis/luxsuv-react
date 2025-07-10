import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { User, Mail, Phone, Calendar, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Route = createLazyFileRoute('/profile')({
  component: Profile,
});

function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full bg-dark text-light overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-light/80">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || '',
      phone: user?.phone || '',
    });
  };

  const handleSave = () => {
    // In a real app, you would update the user data via API
    console.log('Saving user data:', editData);
    setIsEditing(false);
    // For now, just update local state
    // In production, you'd call an API and update the auth context
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Not available';
    }
  };

  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold md:text-4xl">My Profile</h1>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 bg-yellow hover:bg-yellow/90 text-dark font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-light font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-light font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
            {/* Avatar and Basic Info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-yellow text-dark rounded-full flex items-center justify-center font-bold text-xl">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-light">
                  {user?.name || 'User'}
                </h2>
                <p className="text-gray-400">LUX SUV Customer</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-yellow flex-shrink-0" />
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-light">{user?.name || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow flex-shrink-0" />
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                  <p className="text-light">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow flex-shrink-0" />
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-light">{user?.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-yellow flex-shrink-0" />
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Member Since</label>
                  <p className="text-light">{formatDate(user?.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-light mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 text-light rounded-lg transition-colors">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 text-light rounded-lg transition-colors">
                Download My Data
              </button>
              <button className="w-full text-left px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}