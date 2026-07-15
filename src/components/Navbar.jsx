import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] glass h-20 md:h-24 flex items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
            <img src="/logo.png" alt="LAPZONE" className="h-14 md:h-20 object-contain drop-shadow-sm scale-110 origin-left" />
          </Link>
          <div className="hidden md:flex space-x-6 font-medium text-slate-700">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`hover:text-secondary transition-colors ${location.pathname === link.path ? 'text-secondary font-bold' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/shop')} className="text-slate-700 hover:text-secondary active:scale-95 p-1"><Search size={20} /></button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-700 active:scale-95 p-1">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-white pt-24 pb-8 px-6 flex flex-col md:hidden"
          >
            <div className="flex flex-col space-y-6 text-center mt-8">
              {navLinks.map(link => (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.path)}
                  className={`text-2xl font-bold transition-colors ${location.pathname === link.path ? 'text-secondary' : 'text-slate-800'}`}
                >
                  {link.name}
                </button>
              ))}
            </div>
            
            <div className="mt-auto">
              <button 
                onClick={() => handleNav('/shop')}
                className="w-full bg-secondary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors"
              >
                Browse Laptops
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
