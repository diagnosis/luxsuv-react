import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PasswordChangeModal } from '../components/PasswordChangeModal';

function Profile() {
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate({ to: '/' });
  };

  if (isLoading) {
    return (
        <div className="h-[65vh] mx-auto bg-dark flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow"></div>
        </div>
    );
  }

  if (!user) {
    navigate({ to: '/signin' });
    return null;
  }
  // <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
  //   <div className="max-w-2xl mx-auto text-center">

  return (
      <div className="h-full bg-dark text-light overflow-y-auto flex items-center justify-center">
        <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-light">Profile</h1>
                <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Out
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-light/80">
                    Name
                  </label>
                  <div className="mt-1 text-sm text-light bg-gray-700 px-3 py-2 rounded-lg border border-gray-600">
                    {user.name || 'Not provided'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light/80">
                    Email
                  </label>
                  <div className="mt-1 text-sm text-light bg-gray-700 px-3 py-2 rounded-lg border border-gray-600">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light/80">
                    Phone
                  </label>
                  <div className="mt-1 text-sm text-light bg-gray-700 px-3 py-2 rounded-lg border border-gray-600">
                    {user.phone || 'Not provided'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-light/80">
                    Member Since
                  </label>
                  <div className="mt-1 text-sm text-light bg-gray-700 px-3 py-2 rounded-lg border border-gray-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-medium text-light mb-4">Security</h2>
                <button
                    onClick={() => setShowPasswordModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-light bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow"
                >
                  Change Password
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-medium text-light mb-4">Quick Actions</h2>
                <div className="space-y-3 sm:space-y-0 sm:flex sm:space-x-3">
                  <button
                      onClick={() => navigate({ to: '/book' })}
                      className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-dark bg-yellow hover:bg-yellow/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow"
                  >
                    Book a Ride
                  </button>
                  <button
                      onClick={() => navigate({ to: '/manage-bookings' })}
                      className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-light bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow"
                  >
                    Manage Bookings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPasswordModal && (
            <PasswordChangeModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />
        )}
      </div>
  );
}

export const Route = createLazyFileRoute('/profile')({
  component: Profile,
});