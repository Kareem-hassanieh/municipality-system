import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';
import { Home, FileText, ClipboardList, CreditCard, User, LogOut, Menu, X, Calendar, Building2 } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/citizen', icon: Home },
  { name: 'My Requests', href: '/citizen/requests', icon: FileText },
  { name: 'My Permits', href: '/citizen/permits', icon: ClipboardList },
  { name: 'My Payments', href: '/citizen/payments', icon: CreditCard },
  { name: 'Events', href: '/citizen/events', icon: Calendar },
  { name: 'Projects', href: '/citizen/projects', icon: Building2 },
  { name: 'Profile', href: '/citizen/profile', icon: User },
];

export default function CitizenLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/citizen" className="font-semibold text-slate-900">
              Municipality Portal
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition ${
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <NotificationBell />
              <span className="text-sm text-slate-600">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <NotificationBell />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="border-t border-slate-200 pt-3 mt-3">
                <div className="px-3 py-2 text-sm text-slate-500">{user?.name}</div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}