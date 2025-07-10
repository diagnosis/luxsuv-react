import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Calendar, ChevronDown } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-light hover:text-yellow transition-colors p-2 rounded-lg hover:bg-gray-700/50"
        aria-label="User menu"
      >
        <div className="w-8 h-8 bg-yellow text-dark rounded-full flex items-center justify-center font-semibold text-sm">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="hidden md:block text-sm font-medium truncate max-w-24">
          {user.name || 'User'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
          {/* User Info */}
          <div className="p-4 border-b border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow text-dark rounded-full flex items-center justify-center font-semibold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-light font-medium truncate">{user.name || 'User'}</p>
                <p className="text-gray-400 text-sm truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/profile"
              onClick={closeMenu}
              className="flex items-center space-x-3 px-4 py-2 text-light hover:bg-gray-700 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            
            <Link
              to="/manage-bookings"
              onClick={closeMenu}
              className="flex items-center space-x-3 px-4 py-2 text-light hover:bg-gray-700 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>My Bookings</span>
            </Link>
            
            <Link
              to="/settings"
              onClick={closeMenu}
              className="flex items-center space-x-3 px-4 py-2 text-light hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-600 py-2">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;