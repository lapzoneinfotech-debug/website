import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowRight, MessageCircle, ChevronRight, Check, Loader2, Tag } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate('/not-found');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-secondary" size={48} />
      </div>
    );
  }

  if (!product) return null;

  const discountPercentage = Math.round(((product.realPrice - product.discountPrice) / product.realPrice) * 100);

  const handleWhatsAppBuy = () => {
    const message = `Hello LAPZONE INFOTECH,\n\nI am interested in purchasing this laptop.\n\nLaptop: ${product.name}\nModel: ${product.model || 'N/A'}\nPrice: ₹${product.discountPrice?.toLocaleString('en-IN')}\n\nPlease let me know its availability.\n\nThank you.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919943271204?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-4">
      <SEO 
        title={`${product.name} | ${product.brand}`}
        description={`Buy ${product.condition} ${product.name} at a discounted price of ₹${product.discountPrice}. ${product.description ? product.description.substring(0, 100) + '...' : ''}`}
        keywords={`${product.brand} laptop, refurbished ${product.model}, used ${product.name}, buy laptop Theni`}
        image={product.images && product.images.length > 0 ? product.images[0] : null}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.images || [],
            "description": product.description || `Refurbished ${product.name}`,
            "brand": {
              "@type": "Brand",
              "name": product.brand
            },
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "INR",
              "price": product.discountPrice,
              "itemCondition": "https://schema.org/RefurbishedCondition",
              "availability": product.stockStatus === 'In Stock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 md:mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-secondary">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-secondary">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="bg-slate-50 rounded-3xl p-4 md:p-8 border border-slate-100 flex items-center justify-center relative overflow-hidden h-[400px] md:h-[600px]">
            {discountPercentage > 0 && (
              <div className="absolute top-6 left-6 bg-accent text-white font-bold px-4 py-1.5 rounded-full z-10 shadow-lg shadow-accent/30">
                {discountPercentage}% OFF
              </div>
            )}
            {product.images && product.images.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="w-full h-full product-swiper"
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx} className="flex items-center justify-center h-full">
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-slate-400">No image available</div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="text-sm font-bold text-secondary uppercase tracking-widest mb-2">{product.brand}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className={`text-sm font-medium px-3 py-1 rounded-md flex items-center gap-1 ${product.stockStatus === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                <div className={`w-2 h-2 rounded-full ${product.stockStatus === 'In Stock' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                {product.stockStatus}
              </span>
              <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-md">
                Condition: {product.condition}
              </span>
            </div>

            <div className="mb-8">
              <div className="flex items-end gap-4 mb-1">
                <span className="text-4xl font-extrabold text-slate-900">₹{product.discountPrice?.toLocaleString('en-IN')}</span>
                {product.realPrice > 0 && (
                  <span className="text-xl text-slate-400 line-through mb-1 font-medium">₹{product.realPrice.toLocaleString('en-IN')}</span>
                )}
              </div>
              <p className="text-slate-500 text-sm">Prices are inclusive of all taxes.</p>
            </div>

            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              {product.description || "Premium refurbished device brought to you by LAPZONE INFOTECH."}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 mb-1">Processor</div>
                <div className="font-semibold text-slate-900">{product.processor || 'N/A'}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 mb-1">Memory (RAM)</div>
                <div className="font-semibold text-slate-900">{product.ram || 'N/A'}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 mb-1">Storage</div>
                <div className="font-semibold text-slate-900">{product.storage || 'N/A'}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 mb-1">Display</div>
                <div className="font-semibold text-slate-900 line-clamp-1" title={product.display}>{product.display || 'N/A'}</div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 z-40 bg-white">
              <button 
                onClick={handleWhatsAppBuy}
                disabled={product.stockStatus !== 'In Stock'}
                className={`flex-1 text-white py-3 px-8 rounded-md font-bold text-lg flex items-center justify-center gap-3 transition-colors ${product.stockStatus === 'In Stock' ? 'bg-secondary hover:bg-red-700' : 'bg-slate-400 cursor-not-allowed'}`}
              >
                Add To Cart
              </button>
              <button 
                onClick={handleWhatsAppBuy}
                disabled={product.stockStatus !== 'In Stock'}
                className={`flex-1 text-white py-3 px-8 rounded-md font-bold text-lg flex items-center justify-center gap-3 transition-colors ${product.stockStatus === 'In Stock' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-400 cursor-not-allowed'}`}
              >
                Buy It Now
              </button>
            </div>

            {/* Delivery & Shipping Info */}
            <div className="mt-10 border-t border-slate-200 pt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Delivery & Shipping Info:</h3>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <Tag size={20} className="text-accent shrink-0 mt-0.5 fill-accent/20" />
                  <div>
                    <span className="font-bold text-slate-800 text-sm">Fast Shipping:</span>
                    <span className="text-slate-600 text-sm ml-1">Enjoy quick and reliable delivery on all orders, with processing times of 1-2 business days.</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Tag size={20} className="text-accent shrink-0 mt-0.5 fill-accent/20" />
                  <div>
                    <span className="font-bold text-slate-800 text-sm">Secure Packaging:</span>
                    <span className="text-slate-600 text-sm ml-1">All laptops and desktops are carefully packaged to ensure they arrive in perfect condition.</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-600 justify-center sm:justify-start">
              <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-secondary" /> {product.warranty || 'Included'}</span>
              <span className="flex items-center gap-2"><Truck size={18} className="text-secondary" /> Fast Delivery</span>
            </div>
          </div>
        </div>

        {/* Detailed Specs Section */}
        <div className="mt-12 border-t border-slate-200 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-900 mb-6">About the Product</h2>
              
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-10 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {[
                      { label: 'Brand', value: product.brand },
                      { label: 'Model', value: product.model },
                      { label: 'Processor', value: product.processor },
                      { label: 'Graphics', value: product.graphics },
                      { label: 'RAM', value: product.ram },
                      { label: 'Storage', value: product.storage },
                      { label: 'Display', value: product.display },
                      { label: 'Operating System', value: product.os },
                      { label: 'Battery Health', value: product.batteryHealth },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                        <th className="py-4 px-6 text-slate-500 font-medium w-1/3 border-b border-slate-100">{row.label}</th>
                        <td className="py-4 px-6 text-slate-900 font-medium border-b border-slate-100">{row.value || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {product.specs && product.specs.length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {product.specs.map((spec, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-blue-50 text-secondary flex items-center justify-center shrink-0">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-slate-700">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">What's in the box?</h3>
                <div className="flex items-center gap-3 text-slate-700 mb-2">
                  <Check size={16} className="text-accent" /> Laptop
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Check size={16} className="text-accent" /> {product.accessories || 'Charger'}
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <ShieldCheck size={32} className="text-secondary mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Quality Assurance</h3>
                <p className="text-slate-700 text-sm">Every laptop sold by LAPZONE INFOTECH has passed a stringent 50-point quality check to ensure it meets our premium standards.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
