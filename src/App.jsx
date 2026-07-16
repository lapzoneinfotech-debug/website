import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollToTop'
// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
// Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Gallery from './pages/Gallery'
import NotFound from './pages/NotFound'
// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductsList from './pages/admin/ProductsList'
import AddEditProduct from './pages/admin/AddEditProduct'
import EnquiriesList from './pages/admin/EnquiriesList'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:id" element={<ProductDetails />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Auth Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/new" element={<AddEditProduct />} />
          <Route path="products/edit/:id" element={<AddEditProduct />} />
          <Route path="enquiries" element={<EnquiriesList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
