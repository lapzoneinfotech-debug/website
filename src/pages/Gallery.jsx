import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Gallery = () => {
  // We copied 12 images named img-1.jpg to img-12.jpg
  const images = Array.from({ length: 12 }, (_, i) => `/gallery/img-${i + 1}.jpg`);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer aspect-square"
            >
              <img 
                src={src} 
                alt={`Store Gallery Image ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
