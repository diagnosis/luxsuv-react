import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Bell, Shield, Globe, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Route = createLazyFileRoute('/settings')({
  component: Settings,
});

function Settings() {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      shareData: false,
    },
    appearance: {
      theme: 'dark', // 'light', 'dark', 'system'
    },
    language: 'en',
  });

  if (!isAuthenticated) {
    return (
      <div className="w-full h-full bg-dark text-light overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-light/80">Please sign in to access settings.</p>
        </div>
      </div>
    );
  }

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSelect = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 md:text-4xl">Settings</h1>

          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="w-5 h-5 text-yellow" />
                <h2 className="text-lg font-semibold text-light">Notifications</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-light font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive booking confirmations and updates</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'email')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.email ? 'bg-yellow' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-light font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-400">Get text messages for urgent updates</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'sms')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.sms ? 'bg-yellow' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-light font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-400">Browser notifications for real-time updates</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'push')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.push ? 'bg-yellow' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-light font-medium">Marketing Communications</p>
                    <p className="text-sm text-gray-400">Promotional offers and news</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'marketing')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.marketing ? 'bg-yellow' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-5 h-5 text-yellow" />
                <h2 className="text-lg font-semibold text-light">Privacy</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-light font-medium">Profile Visibility</p>
                    <p className="text-sm text-gray-400">Allow others to see your profile information</p>
                  </div>
                  <button
                    onClick={() => handleToggle('privacy', 'profileVisible')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.privacy.profileVisible ? 'bg-yellow' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.privacy.profileVisible ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-light font-medium">Data Sharing</p>
                    <p className="text-sm text-gray-400">Share anonymized data to improve our services</p>
                  </div>
                  <button
                    onClick={() => handleToggle('privacy', 'shareData')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.privacy.shareData ? 'bg-yellow' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.privacy.shareData ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-4">
                <Monitor className="w-5 h-5 text-yellow" />
                <h2 className="text-lg font-semibold text-light">Appearance</h2>
              </div>
              
              <div>
                <p className="text-light font-medium mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleSelect('appearance', 'theme', value)}
                      className={`flex flex-col items-center space-y-2 p-3 rounded-lg border transition-colors ${
                        settings.appearance.theme === value
                          ? 'border-yellow bg-yellow/10 text-yellow'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-5 h-5 text-yellow" />
                <h2 className="text-lg font-semibold text-light">Language & Region</h2>
              </div>
              
              <div>
                <label className="block text-light font-medium mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSelect('language', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="bg-yellow hover:bg-yellow/90 text-dark font-semibold px-6 py-2 rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}