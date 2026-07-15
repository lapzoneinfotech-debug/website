import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Star, Wallet, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch up to 4 featured products, if none, just fetch 4 recent ones
        const q = query(collection(db, 'products'), where('featured', '==', true), limit(4));
        const querySnapshot = await getDocs(q);
        let products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (products.length === 0) {
          const recentQ = query(collection(db, 'products'), limit(4));
          const recentSnapshot = await getDocs(recentQ);
          products = recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-24 pb-32 lg:pt-32 lg:pb-40 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Premium Refurbished <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Laptops</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Get the performance of a new laptop at a fraction of the price. Rigorously tested, quality guaranteed, and ready for work or play.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/shop" className="bg-secondary hover:bg-blue-600 text-white px-8 py-4 rounded-full font-medium text-lg transition-colors flex items-center gap-2">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-medium text-lg transition-colors border border-white/20">
                Learn More
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop" alt="Premium Laptops" className="w-full h-auto rounded-3xl shadow-2xl border border-white/10" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center"
            >
              <div className="w-16 h-16 bg-blue-100 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Quality Checked</h3>
              <p className="text-slate-600">Every laptop undergoes a rigorous 50-point diagnostic test to ensure perfect performance.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Warranty Included</h3>
              <p className="text-slate-600">Purchase with peace of mind knowing your device is covered by our comprehensive warranty.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center"
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Fast Delivery</h3>
              <p className="text-slate-600">Secure and fast shipping straight to your doorstep with tracking every step of the way.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center"
            >
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Cash on Delivery</h3>
              <p className="text-slate-600">Pay only when the product reaches your hands. 100% safe and secure payment method available.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Latest Deals</h2>
              <p className="text-slate-600 text-lg">Top tier laptops at unbeatable refurbished prices.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-secondary font-medium hover:text-blue-700 transition-colors">
              View All <ArrowRight size={18} />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-secondary" size={40} />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500">Products are currently being updated. Check back soon!</p>
            </div>
          )}
          
          <div className="mt-10 text-center md:hidden">
            <Link to="/shop" className="inline-flex items-center gap-2 text-secondary font-medium hover:text-blue-700 transition-colors">
              View All Laptops <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto max-w-3xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Ready to upgrade your tech?</h2>
          <p className="text-xl text-slate-300 mb-10">
            Browse our huge selection of premium refurbished laptops. Have questions? Our support team is ready to help via WhatsApp.
          </p>
          <a href="https://wa.me/919943271204" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-accent hover:bg-emerald-600 text-white px-10 py-5 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-accent/20">
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
