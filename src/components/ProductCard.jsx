import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const discountPercentage = Math.round(((product.realPrice - product.discountPrice) / product.realPrice) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full group"
    >
      {/* Image Container */}
      <Link to={`/shop/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-slate-50 flex items-center justify-center p-6">
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            {discountPercentage}% OFF
          </div>
        )}
        <div className="absolute top-4 right-4 bg-slate-900/10 backdrop-blur-md text-slate-800 text-xs font-medium px-2 py-1 rounded-md z-10">
          {product.condition}
        </div>
        <img 
          src={product.images?.[0] || 'https://placehold.co/600x400/png'} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">{product.brand}</div>
        <Link to={`/shop/${product.id}`}>
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Key Specs snippet */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{product.processor}</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{product.ram}</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{product.storage}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className="text-xs text-slate-400 line-through mb-1">₹{product.realPrice.toLocaleString('en-IN')}</div>
            <div className="text-xl font-bold text-slate-900">₹{product.discountPrice.toLocaleString('en-IN')}</div>
          </div>
          <Link 
            to={`/shop/${product.id}`}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-colors"
          >
            <ShoppingBag size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
