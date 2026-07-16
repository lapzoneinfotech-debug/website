import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20 md:pt-24">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default MainLayout;
