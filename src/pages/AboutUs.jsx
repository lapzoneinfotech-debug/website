import { ShieldCheck, Target, Award, Users, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

const AboutUs = () => {
  return (
    <div className="bg-white pb-20">
      <SEO 
        title="About Us"
        description="Learn about LAPZONE INFOTECH. We are dedicated to providing high-quality, affordable refurbished electronics across India."
        keywords="about LAPZONE INFOTECH, our mission, refurbished electronics India"
        url="https://www.lapzoneinfotech.in/about"
      />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About LAPZONE INFOTECH</h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            We are on a mission to make premium technology accessible to everyone by providing top-tier refurbished laptops that look, feel, and perform like new.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Story</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Founded with a vision to bridge the digital divide, LAPZONE INFOTECH started in Theni as a small electronics repair shop. We noticed a massive gap in the market: people needed high-performance laptops for education, work, and business, but brand new devices were often prohibitively expensive.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                We began sourcing gently used corporate lease laptops, putting them through rigorous testing, replacing worn components, and offering them at incredible prices. Today, we are a trusted name in refurbished electronics, serving thousands of satisfied customers.
              </p>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                <div className="bg-white p-2 rounded-xl shadow-sm shrink-0">
                  <img src="/group.jpeg" alt="JMA Group of Companies" className="w-24 h-24 object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">A Proud Part of JMA Group</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">LAPZONE INFOTECH proudly operates under the umbrella of the <strong>JMA Group of Companies</strong>, ensuring enterprise-grade reliability, business ethics, and unmatched customer trust.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80" alt="Team working" className="w-full h-auto" />
            </div>
          </div>

          {/* Core Values */}
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck size={28} />, title: 'Quality First', desc: 'We never compromise on the quality of our refurbished devices.' },
              { icon: <Target size={28} />, title: 'Transparency', desc: 'Honest pricing and clear communication about device condition.' },
              { icon: <Award size={28} />, title: 'Customer Trust', desc: 'Building long-term relationships through exceptional service.' },
              { icon: <Users size={28} />, title: 'Accessibility', desc: 'Making premium tech affordable for students and professionals.' }
            ].map((value, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <div className="w-14 h-14 mx-auto bg-blue-100 text-secondary rounded-full flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
