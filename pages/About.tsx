import React from 'react';
import Layout from '../components/Layout';
import { Leaf, Users, Globe, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12 pb-12">
        {/* Hero Section */}
        <div className="text-center py-12">
          <div className="inline-flex p-3 bg-eco-100 rounded-full mb-6">
             <Leaf className="w-8 h-8 text-eco-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Shopping for a Better Planet</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            EcoBazaarX isn't just a marketplace; it's a movement towards conscious consumption and a carbon-neutral future.
          </p>
        </div>

        {/* Mission Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-eco-600 mb-2">10k+</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Products Curated</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50 Tons</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">CO2 Offset</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">100%</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Plastic-Free Packaging</div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Globe className="text-eco-500" />
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We started EcoBazaarX with a simple belief: that every purchase is a vote for the kind of world we want to live in. 
              Traditional e-commerce often hides the environmental cost of convenience. We're here to make that cost transparent and to offer alternatives that regenerate rather than deplete our planet.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From utilizing AI to calculate real-time carbon footprints to partnering with local artisans who use recycled materials, every feature of our platform is designed to empower you to make smarter, greener choices.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg h-64 md:h-full">
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" 
              alt="Nature and sustainability" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="bg-eco-50 rounded-3xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <Heart className="w-12 h-12 text-eco-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Join the Community</h2>
            <p className="text-gray-700">
              We are more than just a store. We are a community of changemakers. Every time you choose a product with a high EcoScore, you are sending a signal to the market that sustainability matters.
            </p>
          </div>
        </div>

        {/* Team / Contact placeholder */}
        <div className="text-center border-t border-gray-100 pt-12">
           <h3 className="text-lg font-semibold text-gray-900 mb-2">Have questions?</h3>
           <p className="text-gray-500">
             Reach out to our sustainability team at <a href="mailto:hello@ecobazaarx.com" className="text-eco-600 hover:underline">hello@ecobazaarx.com</a>
           </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;