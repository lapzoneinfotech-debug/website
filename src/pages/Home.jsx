import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Star, Loader2, Globe, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const galleryImages = Array.from({ length: 12 }, (_, i) => `/gallery/img-${i + 1}.jpg`);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
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
    <div className="overflow-hidden bg-white">
      <SEO 
        title="Home"
        description="Your one-stop shop for premium refurbished laptops, desktops, and accessories. Experience top quality with our LAPZONE INFOTECH warranty."
        keywords="LAPZONE INFOTECH home, refurbished computers, buy laptops online India"
        url="https://www.lapzoneinfotech.in/"
      />
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-slate-50 pt-10 pb-0">
        {/* Background Arc */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[800px] border-[2px] border-emerald-400 rounded-[100%] opacity-20 pointer-events-none"></div>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[140%] h-[780px] border-[4px] border-emerald-400 rounded-[100%] opacity-10 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          
          {/* Logo (Optional, if they want logo in hero like JP computers) */}
          <div className="mb-6 flex justify-center">
            <img src="/logo.png" alt="LAPZONE" className="h-20 md:h-24 object-contain" />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Your One-Stop Shop for</h2>
          <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-6 tracking-tight">
            Laptops, Desktops & Accessories!
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="h-[1px] w-12 bg-slate-400"></div>
            <div className="h-[1px] w-12 bg-slate-400 border-t border-dashed border-slate-600"></div>
            <div className="h-[1px] w-12 bg-slate-400"></div>
          </div>

          <p className="text-sm md:text-base text-slate-600 mb-8 max-w-lg mx-auto font-medium">
            Explore a wide range of tech products with <span className="text-secondary">Premium Warranties</span> and expert support after payment. Easy, convenient, and reliable.
          </p>
          
          <Link to="/shop" className="bg-secondary hover:bg-red-700 text-white px-10 py-3 rounded-md font-bold text-lg transition-colors shadow-lg">
            Order Now
          </Link>

          {/* Hero Image Collage */}
          <div className="mt-12 mb-8 w-full max-w-4xl mx-auto flex justify-center items-end px-4">
            <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200&auto=format&fit=crop" alt="Premium Laptops and Desktops" className="w-full h-auto object-cover max-h-[400px] rounded-3xl shadow-2xl mix-blend-multiply" />
          </div>
        </div>

        {/* Red Footer Bar of Hero */}
        <div className="bg-secondary text-white py-3 px-4 w-full flex flex-col sm:flex-row justify-between items-center text-sm md:text-base font-medium z-20 relative">
          <div className="flex items-center gap-2">
            <Globe size={18} /> www.lapzoneinfotech.in
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Phone size={18} /> (+91) 9943271204
          </div>
        </div>
      </section>

      {/* Trending Collections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-10 border-b border-slate-200 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Our Trending Collections</h2>
            <Link to="/shop" className="bg-secondary text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition-colors hidden sm:block">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:flex md:justify-center md:gap-16 text-center">
            <Link to="/shop?category=laptops" className="group flex flex-col items-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-56 md:h-56 rounded-full overflow-hidden bg-orange-50 mb-3 md:mb-4 border-2 md:border-4 border-white shadow-md group-hover:shadow-xl transition-shadow mx-auto">
                <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&auto=format&fit=crop" alt="Laptops" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-sm sm:text-base md:text-xl font-semibold text-slate-800">Laptops</h3>
            </Link>
            
            <Link to="/shop?category=desktops" className="group flex flex-col items-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-56 md:h-56 rounded-full overflow-hidden bg-orange-50 mb-3 md:mb-4 border-2 md:border-4 border-white shadow-md group-hover:shadow-xl transition-shadow mx-auto">
                <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=400&auto=format&fit=crop" alt="Desktops" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-sm sm:text-base md:text-xl font-semibold text-slate-800">Desktops</h3>
            </Link>

            <Link to="/shop?category=accessories" className="group flex flex-col items-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-56 md:h-56 rounded-full overflow-hidden bg-orange-50 mb-3 md:mb-4 border-2 md:border-4 border-white shadow-md group-hover:shadow-xl transition-shadow mx-auto">
                <img src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?q=80&w=400&auto=format&fit=crop" alt="Accessories" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-sm sm:text-base md:text-xl font-semibold text-slate-800 break-words w-full px-1">Accessories</h3>
            </Link>
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop" className="bg-secondary text-white px-8 py-3 rounded-md font-medium hover:bg-red-700 transition-colors inline-block w-full">
              View All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Laptops</h2>
            <div className="flex gap-2">
              <button className="bg-red-400 text-white p-2 rounded hover:bg-secondary transition-colors"><ArrowRight size={20} className="rotate-180" /></button>
              <button className="bg-secondary text-white p-2 rounded hover:bg-red-700 transition-colors"><ArrowRight size={20} /></button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-secondary" size={40} />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-md border border-slate-200">
              <p className="text-slate-500">Products are currently being updated. Check back soon!</p>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Link to="/shop" className="inline-flex items-center justify-center bg-white border-2 border-slate-800 text-slate-800 px-6 py-2 rounded-md font-bold hover:bg-slate-800 hover:text-white transition-colors">
              See All Product
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-md border border-slate-200 flex flex-col items-center text-center">
              <ShieldCheck size={40} className="text-secondary mb-4" />
              <h3 className="text-lg font-bold mb-2 text-slate-900">Quality Checked</h3>
              <p className="text-slate-600 text-sm">Every laptop undergoes a rigorous 50-point diagnostic test to ensure perfect performance.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-md border border-slate-200 flex flex-col items-center text-center">
              <Star size={40} className="text-secondary mb-4" />
              <h3 className="text-lg font-bold mb-2 text-slate-900">Warranty Included</h3>
              <p className="text-slate-600 text-sm">Purchase with peace of mind knowing your device is covered by our comprehensive warranty.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-md border border-slate-200 flex flex-col items-center text-center">
              <Truck size={40} className="text-secondary mb-4" />
              <h3 className="text-lg font-bold mb-2 text-slate-900">Fast Delivery</h3>
              <p className="text-slate-600 text-sm">Secure and fast shipping straight to your doorstep with tracking every step of the way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Happy Customers / Gallery Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10 border-b border-slate-200 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Our Happy Customers</h2>
          </div>

          <div className="relative group max-w-[100vw] overflow-hidden -mx-4 px-4 md:mx-0 md:px-0">
            {/* Left Button */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-6 md:left-2 top-1/2 -translate-y-1/2 z-10 bg-slate-800/60 hover:bg-slate-900 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-0 md:opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-sm"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Scroll Container */}
            <div 
              ref={scrollRef}
              className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {galleryImages.map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4 }}
                  className="w-[80vw] h-[60vw] sm:w-[50vw] sm:h-[37vw] md:w-[320px] md:h-[240px] lg:w-[360px] lg:h-[270px] bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex-shrink-0 snap-center"
                >
                  <img 
                    src={src} 
                    alt={`Happy Customer ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>

            {/* Right Button */}
            <button 
              onClick={() => scroll('right')}
              className="absolute right-6 md:right-2 top-1/2 -translate-y-1/2 z-10 bg-slate-800/60 hover:bg-slate-900 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all md:opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/gallery" className="inline-flex items-center justify-center bg-secondary text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
