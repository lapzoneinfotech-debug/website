import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow border border-slate-200 overflow-hidden flex flex-col h-full group"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white p-4 border-b border-slate-100 flex items-center justify-center">
        <Link 
          to={`/shop/${product.id}`} 
          className="absolute top-2 right-2 w-10 h-10 border border-slate-200 rounded flex items-center justify-center text-slate-500 hover:text-white hover:bg-secondary hover:border-secondary transition-colors z-10 bg-white"
        >
          <Eye size={20} />
        </Link>
        <Link to={`/shop/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img 
            src={product.images?.[0] || 'https://placehold.co/600x400/png'} 
            alt={product.name} 
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow text-left">
        <div className="text-xs text-slate-500 mb-1">{product.brand || 'lapzone infotech'}</div>
        <Link to={`/shop/${product.id}`}>
          <h3 className="text-sm md:text-base font-bold text-slate-900 mb-3 line-clamp-2 hover:text-secondary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex flex-col">
          <div className="text-lg font-bold text-slate-900 mb-4">Rs. {product.discountPrice?.toLocaleString('en-IN')}.00</div>
          <Link 
            to={`/shop/${product.id}`}
            className="w-full py-2.5 bg-secondary hover:bg-red-700 text-white font-medium text-center transition-colors text-sm rounded-md"
          >
            Add To Cart
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
