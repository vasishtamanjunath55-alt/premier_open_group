import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, userRole, signOut } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Awards', path: '/awards' },
    { name: 'News', path: '/news' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
    { name: 'Register', path: '/register' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#556B2F] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Premier Open Group Logo" className="h-16 w-16 rounded-full" />
            <div className="flex flex-col">
              <span className="text-xs text-green-100">THE BHARAT SCOUTS AND GUIDES KARNATAKA</span>
              <span className="text-lg font-bold">PREMIER OPEN GROUP</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-white text-[#556B2F]'
                    : 'hover:bg-[#6B8E23]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  to={userRole === 'admin' ? '/admin' : '/member'}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-[#6B8E23] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{userRole === 'admin' ? 'Admin' : 'Dashboard'}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-white hover:bg-[#6B8E23] hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-white text-[#556B2F] hover:bg-green-50 font-semibold" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-[#6B8E23] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-[#6B8E23]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'bg-white text-[#556B2F]'
                    : 'hover:bg-[#6B8E23]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link
                  to={userRole === 'admin' ? '/admin' : '/member'}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm font-medium hover:bg-[#6B8E23] rounded-md transition-colors"
                >
                  {userRole === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-[#6B8E23] rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3"
              >
                <Button className="w-full bg-white text-[#556B2F] hover:bg-green-50 font-semibold" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
