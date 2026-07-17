import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

const Gallery = () => {
  // We copied 12 images named img-1.jpg to img-12.jpg
  const images = Array.from({ length: 12 }, (_, i) => `/gallery/img-${i + 1}.jpg`);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-12 pb-24">
      <SEO 
        title="Store Gallery"
        description="Take a look inside LAPZONE INFOTECH. See our wide range of premium refurbished laptops, desktops, and accessories."
        keywords="LAPZONE INFOTECH gallery, computer store photos, Theni computer shop"
        url="https://www.lapzoneinfotech.in/gallery"
      />
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Store Gallery</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Take a look inside LAPZONE INFOTECH. We pride ourselves on offering a wide range of premium refurbished laptops, desktops, and accessories.
          </p>
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
            {images.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
                className="min-w-[85vw] sm:min-w-[60vw] md:min-w-[40vw] lg:min-w-[30vw] aspect-[4/3] bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex-shrink-0 snap-center"
              >
                <img 
                  src={src} 
                  alt={`Store Gallery Image ${index + 1}`} 
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
      </div>
    </div>
  );
};

export default Gallery;
