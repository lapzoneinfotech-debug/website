import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { uploadImageToCloudinary } from '../../lib/cloudinary';
import { Loader2, Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

const BRANDS = ['Apple', 'Dell', 'Lenovo', 'HP', 'Asus', 'Acer', 'MSI', 'Others'];
const CONDITIONS = ['New', 'Excellent', 'Good'];

const AddEditProduct = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  
  const [images, setImages] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      category: 'Laptops',
      brand: 'HP',
      model: '',
      realPrice: '',
      discountPrice: '',
      processor: '',
      ram: '',
      storage: '',
      graphics: '',
      display: '',
      batteryHealth: '',
      os: 'Windows 11',
      warranty: '12 Months',
      accessories: 'Charger',
      condition: 'Excellent',
      stockStatus: 'In Stock',
      featured: false,
      description: '',
      specs: [{ point: '' }]
    }
  });

  const selectedCategory = watch('category');

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control,
    name: "specs"
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (isEditing) {
        try {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Transform specs back to object array for field array
            if (data.specs && data.specs.length > 0) {
              data.specs = data.specs.map(s => ({ point: s }));
            } else {
              data.specs = [{ point: '' }];
            }
            reset(data);
            if (data.images) setImages(data.images);
          } else {
            toast.error("Product not found");
            navigate('/admin/products');
          }
        } catch (error) {
          toast.error("Failed to load product");
        }
      }
    };
    fetchProduct();
  }, [id, reset, navigate, isEditing]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploadingImage(true);
    try {
      const uploadPromises = files.map(file => uploadImageToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSaving(true);
    try {
      // Flatten specs array of objects to array of strings
      const cleanedSpecs = data.specs.map(s => s.point).filter(s => s.trim() !== '');
      
      const productData = {
        ...data,
        realPrice: Number(data.realPrice),
        discountPrice: Number(data.discountPrice),
        specs: cleanedSpecs,
        images: images,
        updatedAt: serverTimestamp(),
      };

      if (isEditing) {
        await updateDoc(doc(db, 'products', id), productData);
        toast.success("Product updated successfully");
      } else {
        productData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), productData);
        toast.success("Product added successfully");
      }
      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-slate-500">Fill in the details to list a product.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Full Name *</label>
              <input {...register('name', { required: true })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="e.g. Apple MacBook Pro 16 / Dell Optiplex" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
              <select {...register('brand')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50">
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select {...register('category')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50">
                <option value="Laptops">Laptops</option>
                <option value="Desktops">Desktops</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model Number</label>
              <input {...register('model')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="e.g. MK183HN/A" />
            </div>
          </div>
        </div>

        {/* Pricing & Status */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Pricing & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Real Price (MRP) *</label>
              <input type="number" {...register('realPrice', { required: true })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="₹" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discount Price (Selling Price) *</label>
              <input type="number" {...register('discountPrice', { required: true })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="₹" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Status</label>
              <select {...register('stockStatus')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50">
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
              <select {...register('condition')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50">
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 mt-2">
              <input type="checkbox" id="featured" {...register('featured')} className="w-5 h-5 text-secondary rounded" />
              <label htmlFor="featured" className="text-slate-700 font-medium cursor-pointer">Feature this product on the Home Page</label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Product Images *</h2>
          
          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((url, idx) => (
              <div key={idx} className="relative w-32 h-32 border border-slate-200 rounded-xl overflow-hidden group">
                <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            <label className="w-32 h-32 border-2 border-dashed border-slate-300 hover:border-secondary rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-500 hover:text-secondary bg-slate-50">
              {isUploadingImage ? <Loader2 className="animate-spin mb-2" /> : <ImageIcon className="mb-2" />}
              <span className="text-xs font-medium text-center px-2">{isUploadingImage ? 'Uploading...' : 'Add Image'}</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingImage} />
            </label>
          </div>
          <p className="text-xs text-slate-500">First image will be used as the thumbnail. Cloudinary will automatically optimize images.</p>
        </div>

        {/* Specifications */}
        {selectedCategory !== 'Accessories' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Hardware Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Processor</label>
              <input {...register('processor')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="e.g. Intel Core i5 11th Gen" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">RAM</label>
              <input {...register('ram')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="e.g. 8GB DDR4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Storage</label>
              <input {...register('storage')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="e.g. 512GB NVMe SSD" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Graphics</label>
              <input {...register('graphics')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="e.g. Intel Iris Xe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display</label>
              <input {...register('display')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="e.g. 14 inch FHD IPS" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Battery Health</label>
              <input {...register('batteryHealth')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="e.g. Excellent / 90%" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Operating System</label>
              <input {...register('os')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warranty Details</label>
              <input {...register('warranty')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" />
            </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Accessories Included</label>
                <input {...register('accessories')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50" placeholder="e.g. Original Charger, Bag" />
              </div>
            </div>
          </div>
        )}

        {/* Description & Detailed Specs */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Detailed Description & Points</h2>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-1">Main Description</label>
            <textarea {...register('description')} rows="4" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none" placeholder="Provide a compelling overview of the laptop..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Specification Bullet Points</label>
            <div className="space-y-3">
              {specFields.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <input
                    {...register(`specs.${index}.point`)}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    placeholder="e.g. ✓ Backlit Keyboard"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeSpec(index)}
                    className="w-12 h-12 flex-shrink-0 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button 
              type="button"
              onClick={() => appendSpec({ point: '' })}
              className="mt-4 flex items-center gap-2 text-secondary font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} /> Add Bullet Point
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 sticky bottom-4 z-40 bg-white/80 backdrop-blur-md p-4 border border-slate-200 rounded-2xl shadow-xl">
          <button 
            type="button" 
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-secondary hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Save Product'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddEditProduct;
