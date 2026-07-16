import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown, SlidersHorizontal, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const BRANDS = ['All', 'Apple', 'Dell', 'Lenovo', 'HP', 'Asus', 'Acer', 'MSI', 'Others'];

const CATEGORIES = ['All', 'Laptops', 'Desktops', 'Accessories'];

const FilterSidebar = ({
  prefix,
  searchQuery, setSearchQuery,
  selectedCategory, setSelectedCategory,
  selectedBrand, setSelectedBrand,
  selectedCondition, setSelectedCondition
}) => (
  <div className="space-y-8">
    <div>
      <h3 className="font-bold text-slate-900 mb-3 text-lg">Category</h3>
      <div className="flex flex-col gap-1">
        {CATEGORIES.map(cat => (
          <div 
            key={cat} 
            className="flex items-center gap-3 cursor-pointer group py-2"
            onClick={() => setSelectedCategory(cat)}
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedCategory === cat ? 'border-secondary bg-secondary' : 'border-slate-300 group-hover:border-slate-400'}`}>
              {selectedCategory === cat && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
            <span className={`text-sm font-medium transition-colors ${selectedCategory === cat ? 'text-secondary' : 'text-slate-600 group-hover:text-slate-900'}`}>
              {cat}
            </span>
          </div>
        ))}
      </div>
    </div>
    <div>
      <h3 className="font-bold text-slate-900 mb-3 text-lg">Brand</h3>
      <div className="flex flex-col gap-1">
        {BRANDS.map(brand => (
          <div 
            key={brand} 
            className="flex items-center gap-3 cursor-pointer group py-2"
            onClick={() => setSelectedBrand(brand)}
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedBrand === brand ? 'border-secondary bg-secondary' : 'border-slate-300 group-hover:border-slate-400'}`}>
              {selectedBrand === brand && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
            <span className={`text-sm font-medium transition-colors ${selectedBrand === brand ? 'text-secondary' : 'text-slate-600 group-hover:text-slate-900'}`}>
              {brand}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-bold text-slate-900 mb-3 text-lg">Condition</h3>
      <div className="flex flex-col gap-1">
        {['All', 'Like New', 'Excellent', 'Good'].map(cond => (
          <div 
            key={cond} 
            className="flex items-center gap-3 cursor-pointer group py-2"
            onClick={() => setSelectedCondition(cond)}
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedCondition === cond ? 'border-secondary bg-secondary' : 'border-slate-300 group-hover:border-slate-400'}`}>
              {selectedCondition === cond && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
            <span className={`text-sm font-medium transition-colors ${selectedCondition === cond ? 'text-secondary' : 'text-slate-600 group-hover:text-slate-900'}`}>
              {cond}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  // Capitalize the first letter if it came from the URL as lowercase (e.g. 'laptops' -> 'Laptops')
  const formattedInitialCategory = initialCategory !== 'All' 
    ? initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1) 
    : 'All';

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(formattedInitialCategory);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.brand?.toLowerCase().includes(q) ||
        p.processor?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p => (p.category || 'Laptops') === selectedCategory);
    }
    if (selectedBrand !== 'All') result = result.filter(p => p.brand === selectedBrand);
    if (selectedCondition !== 'All') result = result.filter(p => p.condition === selectedCondition);

    switch (sortOption) {
      case 'price-low':
        result = [...result].sort((a, b) => (a.discountPrice || 0) - (b.discountPrice || 0));
        break;
      case 'price-high':
        result = [...result].sort((a, b) => (b.discountPrice || 0) - (a.discountPrice || 0));
        break;
      case 'discount-high':
        result = [...result].sort((a, b) => {
          const discountA = ((a.realPrice || 1) - (a.discountPrice || 0)) / (a.realPrice || 1);
          const discountB = ((b.realPrice || 1) - (b.discountPrice || 0)) / (b.realPrice || 1);
          return discountB - discountA;
        });
        break;
      default:
        // newest based on createdAt
        result = [...result].sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB - dateA;
        });
        break;
    }

    return result;
  }, [allProducts, searchQuery, selectedCategory, selectedBrand, selectedCondition, sortOption]);



  return (
    <div className="bg-white min-h-screen pt-8 pb-20">
      <SEO 
        title="Shop Laptops & Desktops"
        description="Browse our wide selection of premium refurbished laptops and desktops. Filter by brand, condition, and price to find your perfect match."
        keywords="shop refurbished laptops, buy used desktops, LAPZONE INFOTECH shop, affordable computers"
        url="https://www.lapzoneinfotech.in/shop"
      />
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
          <div className="w-full md:w-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Shop Laptops</h1>
            <p className="text-slate-500 mb-4 md:mb-0">Showing {filteredProducts.length} results</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64 md:w-72 shrink-0">
              <input 
                type="text" 
                placeholder="Search laptops..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl font-medium transition-colors flex-1 justify-center"
              >
                <Filter size={18} /> Filters
              </button>
              
              <div className="relative flex-1 sm:flex-none">
                <select 
                  className="w-full sm:w-48 md:w-48 appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-medium cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount-high">Highest Discount</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="hidden md:block w-72 shrink-0">
            <div className="sticky top-28 pr-4">
              <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-xl">
                <SlidersHorizontal size={20} /> Filters
              </div>
              <FilterSidebar 
                prefix="desktop" 
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
                selectedCondition={selectedCondition} setSelectedCondition={setSelectedCondition}
              />
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-secondary" size={40} />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-slate-100">
                <div className="w-20 h-20 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-6">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">No laptops found</h3>
                <p className="text-slate-500 max-w-md">Try adjusting your filters or search query to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSearchQuery(''); setSelectedCategory('All'); setSelectedBrand('All'); setSelectedCondition('All');
                  }}
                  className="mt-6 text-secondary font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl flex flex-col md:hidden overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal size={20} /> Filters
                </h2>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <FilterSidebar 
                  prefix="mobile" 
                  searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                  selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
                  selectedCondition={selectedCondition} setSelectedCondition={setSelectedCondition}
                />
              </div>
              <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-secondary hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-colors"
                >
                  Show Results ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
