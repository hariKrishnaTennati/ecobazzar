import React from 'react';
import Layout from '../components/Layout';
import { Leaf, Users, Globe, Heart, Sparkles, Target, Zap } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const About: React.FC = () => {
  return (
    <Layout>
      <AnimatedPage>
        <div className="max-w-5xl mx-auto space-y-20 pb-20">
          {/* Hero Section */}
          <div className="text-center py-20 animate-stagger">
            <div className="inline-flex p-4 bg-eco-100 rounded-3xl mb-8 shadow-xl shadow-eco-200/50 group hover:rotate-12 transition-all">
              <Leaf className="w-10 h-10 text-eco-600" />
            </div>
            <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">Shopping for a <span className="text-eco-600 italic">Better Planet</span></h1>
            <p className="text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
              EcoBazaarX isn't just a marketplace; it's a movement towards conscious consumption and a carbon-neutral future.
            </p>
          </div>

          {/* Mission Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-stagger">
            {[
              { icon: Sparkles, label: 'Products Curated', value: '10k+', color: 'text-eco-600', bg: 'bg-eco-50' },
              { icon: Globe, label: 'CO2 Offset', value: '50 Tons', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Target, label: 'Eco-Packaging', value: '100%', color: 'text-yellow-600', bg: 'bg-yellow-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/40 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-xl border border-white/40 text-center group hover:-translate-y-2 transition-all duration-500">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`text-4xl font-black ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Content Sections */}
          <div className="grid md:grid-cols-2 gap-16 items-center animate-stagger">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-eco-100/50 px-4 py-2 rounded-full border border-eco-200">
                <Zap className="h-4 w-4 text-eco-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-eco-700">Digital Revolution</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">
                Our Mission to Restore Earth
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                We started EcoBazaarX with a simple belief: that every purchase is a vote for the kind of world we want to live in.
                Traditional e-commerce often hides the environmental cost of convenience. We're here to make that cost transparent.
              </p>
              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                From utilizing AI to calculate real-time carbon footprints to partnering with local artisans who use recycled materials, every feature of our platform is designed to empower you to make smarter, greener choices.
              </p>
            </div>
            <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[500px] border border-white/20 relative group">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000"
                alt="Nature and sustainability"
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-eco-600 to-eco-800 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden group animate-stagger shadow-2xl shadow-eco-200">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-white/20 transition-all duration-700" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
              <div className="bg-white/20 backdrop-blur-xl p-5 rounded-3xl inline-block group-hover:rotate-12 transition-all">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-5xl font-black tracking-tight leading-tight">Join the Community of Changemakers</h2>
              <p className="text-eco-100 text-xl font-medium leading-relaxed opacity-80">
                We are more than just a store. Every time you choose a product with a high EcoScore, you are sending a signal to the market that sustainability matters.
              </p>
              <div className="pt-6">
                <button className="bg-white text-eco-700 px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-eco-50 transition-all active:scale-95">Explore Products</button>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center animate-stagger border-t border-gray-100/50 pt-20">
            <h3 className="text-2xl font-black text-gray-900 mb-4">Have questions?</h3>
            <p className="text-gray-500 font-medium text-lg mb-8">
              Reach out to our sustainability team at <a href="mailto:hello@ecobazaarx.com" className="text-eco-600 hover:underline underline-offset-8 decoration-2 decoration-eco-200 hover:decoration-eco-500 font-bold">hello@ecobazaarx.com</a>
            </p>
          </div>
        </div>
      </AnimatedPage>
    </Layout>
  );
};

export default About;