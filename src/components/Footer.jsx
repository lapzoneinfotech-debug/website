const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="bg-white/90 inline-block p-2 rounded-xl mb-4">
            <img src="/logo.png" alt="LAPZONE INFOTECH" className="h-16 md:h-20 object-contain" />
          </div>
          <p className="text-slate-300">Premium refurbished laptops at affordable prices. Quality checked and guaranteed.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Contact</h3>
          <p className="text-slate-300">📞 +91 9943271204</p>
          <p className="text-slate-300">📞 +91 8825996743</p>
          <p className="text-slate-300">📧 lapzoneinfotechtheni@gmail.com</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Location</h3>
          <p className="text-slate-300">65B Veerappayanar Kovil Street, Keraikal Market, Allinagaram, Theni - 625531</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
