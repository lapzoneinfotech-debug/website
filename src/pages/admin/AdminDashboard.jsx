import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Package, Eye, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    totalViews: 12450, // Placeholder as requested
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort by created date if it exists
        const sortedProducts = products.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB - dateA;
        });

        setStats({
          totalProducts: products.length,
          featuredProducts: products.filter(p => p.featured).length,
          totalViews: 12450,
          recentProducts: sortedProducts.slice(0, 5)
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, bgClass, textClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${bgClass} ${textClass}`}>
        {icon}
      </div>
      <div>
        <div className="text-slate-500 text-sm font-medium mb-1">{title}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="animate-pulse flex gap-6"><div className="w-64 h-32 bg-slate-200 rounded-2xl"></div><div className="w-64 h-32 bg-slate-200 rounded-2xl"></div></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<Package size={24} />} 
          bgClass="bg-blue-50" 
          textClass="text-blue-600"
        />
        <StatCard 
          title="Featured Items" 
          value={stats.featuredProducts} 
          icon={<Star size={24} />} 
          bgClass="bg-amber-50" 
          textClass="text-amber-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Recently Added Laptops</h2>
          <Link to="/admin/products" className="text-secondary font-medium hover:underline text-sm">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-500 text-sm border-b border-slate-100">
                <th className="py-4 px-6 font-medium">Product</th>
                <th className="py-4 px-6 font-medium">Price</th>
                <th className="py-4 px-6 font-medium">Stock</th>
                <th className="py-4 px-6 font-medium">Condition</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProducts.length > 0 ? (
                stats.recentProducts.map((product) => (
                  <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm line-clamp-1">{product.name}</div>
                          <div className="text-xs text-slate-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900">₹{product.discountPrice?.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${product.stockStatus === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {product.stockStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">{product.condition}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">No products found. Add your first laptop!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
