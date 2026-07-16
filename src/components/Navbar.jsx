import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/shop', { state: { search: searchQuery } });
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white shadow-sm flex flex-col">
        {/* Top Header Row */}
        <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center relative">
          
          {/* Left: Hamburger Menu */}
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-slate-800 p-1 active:scale-95 transition-transform"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Center: Logo */}
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <img src="/logo.png" alt="LAPZONE" className="h-10 md:h-14 object-contain" />
          </Link>

          {/* Right: User & Cart */}
          <div className="flex items-center space-x-4">
            <button className="text-slate-800 hover:text-secondary p-1">
              <User size={24} />
            </button>
            <button className="text-slate-800 hover:text-secondary p-1 relative" onClick={() => navigate('/shop')}>
              <ShoppingBag size={24} />
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>

        </div>

        {/* Bottom Search Row (Always visible, similar to JP screenshot) */}
        <div className="container mx-auto px-4 pb-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search For Products..." 
                className="w-full pl-4 pr-4 py-2 bg-white border border-slate-300 focus:outline-none focus:border-secondary text-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="bg-secondary text-white px-4 py-2 hover:bg-red-700 transition-colors flex items-center justify-center shrink-0"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </nav>

      {/* spacer to prevent content from going under the fixed navbar */}
      <div className="h-28 md:h-32"></div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-[80%] max-w-sm z-50 bg-white shadow-2xl flex flex-col pt-32 pb-8"
          >
            <div className="flex flex-col text-left">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
                  <User size={20} />
                </div>
                <div className="text-sm font-bold text-slate-800">Welcome to LAPZONE</div>
              </div>
              
              <div className="flex flex-col mt-4">
                {navLinks.map(link => (
                  <button
                    key={link.name}
                    onClick={() => handleNav(link.path)}
                    className={`text-lg font-semibold py-4 px-6 text-left border-b border-slate-50 transition-colors ${location.pathname === link.path ? 'text-secondary bg-red-50/50' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
