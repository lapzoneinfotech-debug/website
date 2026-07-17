import { useState, useEffect } from 'react';
import { MessageCircle, ChevronUp } from 'lucide-react';

const FloatingButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Show scroll-to-top button when scrolling down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check if user is near the bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/919943271204', '_blank');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-between items-end pointer-events-none">
      
      {/* WhatsApp Button (Left) */}
      <div className={`transition-opacity duration-300 ${isAtBottom ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        <button 
          onClick={handleWhatsApp}
          className="bg-[#25D366] hover:bg-[#1ebe5b] text-white px-4 py-2.5 rounded flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <MessageCircle size={24} fill="white" />
          <span className="font-bold">Chat Now</span>
        </button>
      </div>

      {/* Scroll to Top Button (Right) */}
      <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={scrollToTop}
          className="pointer-events-auto bg-secondary hover:bg-red-700 text-white p-3 rounded shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} strokeWidth={3} />
        </button>
      </div>
      
    </div>
  );
};

export default FloatingButtons;
