import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Trash2, Mail, Phone, Calendar, User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const EnquiriesList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'enquiries'));
      const fetchedEnquiries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort by newest first
      const sortedEnquiries = fetchedEnquiries.sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date(0);
        const dateB = b.createdAt?.toDate() || new Date(0);
        return dateB - dateA;
      });
      
      setEnquiries(sortedEnquiries);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      try {
        await deleteDoc(doc(db, 'enquiries', id));
        toast.success("Enquiry deleted successfully");
        setEnquiries(enquiries.filter(e => e.id !== id));
      } catch (error) {
        toast.error("Failed to delete enquiry");
      }
    }
  };

  const markAsRead = async (id, currentStatus) => {
    if (currentStatus === 'read') return;
    try {
      await updateDoc(doc(db, 'enquiries', id), { status: 'read' });
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: 'read' } : e));
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Customer Enquiries</h1>
        <p className="text-slate-500">View and manage messages sent from the Contact form.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading enquiries...</div>
        ) : enquiries.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {enquiries.map((enquiry) => (
              <div 
                key={enquiry.id} 
                className={`p-6 transition-colors ${enquiry.status === 'new' ? 'bg-blue-50/30' : 'bg-white hover:bg-slate-50'}`}
                onMouseEnter={() => markAsRead(enquiry.id, enquiry.status)}
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <User size={18} className="text-slate-400" />
                        {enquiry.name}
                        {enquiry.status === 'new' && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold ml-2">NEW</span>
                        )}
                      </h3>
                      <span className="text-sm text-slate-500 flex items-center gap-1 ml-auto md:ml-4">
                        <Calendar size={14} /> 
                        {enquiry.createdAt?.toDate().toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) || 'Unknown Date'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <Phone size={14} className="text-secondary" /> 
                        <a href={`tel:${enquiry.phone}`} className="hover:text-secondary hover:underline">{enquiry.phone}</a>
                      </div>
                      {enquiry.email && (
                        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                          <Mail size={14} className="text-secondary" /> 
                          <a href={`mailto:${enquiry.email}`} className="hover:text-secondary hover:underline">{enquiry.email}</a>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm whitespace-pre-wrap border border-slate-100">
                      {enquiry.message}
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col justify-end md:justify-start gap-2 shrink-0">
                    <a 
                      href={`https://wa.me/91${enquiry.phone.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(enquiry.name)}, we received your inquiry regarding Lapzone Infotech...`}
                      target="_blank" rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors shadow-sm"
                      title="Reply via WhatsApp"
                    >
                      <Phone size={18} />
                    </a>
                    <button 
                      onClick={() => handleDelete(enquiry.id)}
                      className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                      title="Delete Enquiry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Mail size={48} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Enquiries Yet</h3>
            <p className="text-slate-500 max-w-sm">When customers contact you through the website, their messages will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiriesList;
