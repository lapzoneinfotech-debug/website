import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'new' // Can be new, read, replied
      });
      toast.success("Message sent successfully! We will get back to you soon.");
      reset();
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast.error("Failed to send message. Please try again or contact via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-12 pb-24">
      <SEO 
        title="Contact Us"
        description="Get in touch with LAPZONE INFOTECH. Reach out for sales, support, and business inquiries."
        keywords="contact LAPZONE INFOTECH, customer support, laptop repair Theni"
        url="https://www.lapzoneinfotech.in/contact"
      />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have a question about a laptop or need support? Our team is here to help you find the perfect device.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-secondary shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Our Store</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  65B Veerappayanar Kovil Street,<br />
                  Keraikal Market, Allinagaram,<br />
                  Theni - 625531
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="bg-emerald-50 p-3 rounded-full text-accent shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Phone / WhatsApp</h3>
                <p className="text-slate-600 text-sm mb-1">+91 9943271204</p>
                <p className="text-slate-600 text-sm">+91 8825996743</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="bg-purple-50 p-3 rounded-full text-purple-600 shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Email Us</h3>
                <p className="text-slate-600 text-sm">lapzoneinfotechtheni@gmail.com</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="bg-orange-50 p-3 rounded-full text-orange-600 shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Working Hours</h3>
                <p className="text-slate-600 text-sm">Mon - Sat: 10:00 AM - 8:00 PM</p>
                <p className="text-slate-600 text-sm">Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    {...register("name", { required: true })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all" 
                    placeholder="John Doe" 
                  />
                  {errors.name && <span className="text-red-500 text-xs mt-1">Name is required</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    {...register("phone", { required: true })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all" 
                    placeholder="+91 XXXXX XXXXX" 
                  />
                  {errors.phone && <span className="text-red-500 text-xs mt-1">Phone is required</span>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  {...register("email")}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all" 
                  placeholder="john@example.com" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
                <textarea 
                  rows="5" 
                  {...register("message", { required: true })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none" 
                  placeholder="How can we help you?"
                ></textarea>
                {errors.message && <span className="text-red-500 text-xs mt-1">Message is required</span>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-secondary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} 
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
