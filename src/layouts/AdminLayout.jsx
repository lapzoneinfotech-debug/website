import { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LayoutDashboard, Package, PlusCircle, LogOut, Loader2, Menu, X, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-secondary" size={40} /></div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Add Product', path: '/admin/products/new', icon: <PlusCircle size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <Link to="/" className="flex items-center bg-white/95 px-3 py-1.5 rounded-lg w-full">
            <img src="/logo.png" alt="LAPZONE" className="h-10 w-full object-contain" />
          </Link>
          <button className="md:hidden text-slate-400 hover:text-white ml-2" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="px-4 py-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
          <nav className="space-y-1">
            <Link to="/admin" onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin') ? 'bg-secondary text-white' : 'hover:bg-slate-800'}`}>
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link to="/admin/products" onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/products') && !isActive('/admin/products/new') ? 'bg-secondary text-white' : 'hover:bg-slate-800'}`}>
              <Package size={20} /> Products
            </Link>
            <Link to="/admin/products/new" onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/products/new') ? 'bg-secondary text-white' : 'hover:bg-slate-800'}`}>
              <PlusCircle size={20} /> Add Product
            </Link>
            <Link to="/admin/enquiries" onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/enquiries') ? 'bg-secondary text-white' : 'hover:bg-slate-800'}`}>
              <MessageSquare size={20} /> Enquiries
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors font-medium"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <button 
            className="md:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin</span>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
