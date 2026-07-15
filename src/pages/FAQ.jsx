import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'Are refurbished laptops good?',
    answer: 'Yes! Our refurbished laptops undergo a rigorous 50-point diagnostic test to ensure they perform just like new. We check everything from battery health and display quality to keyboard responsiveness and thermal performance. You get premium hardware at a fraction of the cost.'
  },
  {
    question: 'Do you provide a warranty?',
    answer: 'Absolutely. Every laptop purchased from LAPZONE INFOTECH comes with a standard 12-month comprehensive warranty covering all hardware defects. We also provide dedicated post-sales support via WhatsApp.'
  },
  {
    question: 'How do I purchase a laptop?',
    answer: 'We keep the buying process simple and personalized. Once you find a laptop you like, click the "Buy on WhatsApp" button. This will redirect you to our official WhatsApp number with a pre-filled message. Our sales representative will confirm availability and guide you through the payment and shipping process.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 7-day replacement guarantee if the device has any functional defects upon arrival. Physical damage or issues caused by user mishandling are not covered under the return policy.'
  },
  {
    question: 'Do you ship across India?',
    answer: 'Yes, we provide safe and secure shipping across India using premium courier partners. All shipments are fully insured and heavily packaged to prevent transit damage.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about purchasing a premium refurbished laptop from LAPZONE INFOTECH.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-slate-200 rounded-2xl overflow-hidden transition-colors ${openIndex === index ? 'bg-slate-50 border-secondary/30 shadow-sm' : 'bg-white hover:border-slate-300'}`}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`font-bold text-lg ${openIndex === index ? 'text-secondary' : 'text-slate-900'}`}>
                  {faq.question}
                </span>
                <span className={`p-2 rounded-full flex-shrink-0 ml-4 ${openIndex === index ? 'bg-secondary/10 text-secondary' : 'bg-slate-100 text-slate-500'}`}>
                  {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
          <h3 className="text-xl font-bold text-slate-900 mb-3">Still have questions?</h3>
          <p className="text-slate-600 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <a href="https://wa.me/919943271204" target="_blank" rel="noreferrer" className="inline-flex bg-secondary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
