import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Search, Home, ArrowLeft } from 'lucide-react';
import SEO from '../../components/common/SEO';

const NotFound = () => {
    return (
        <Layout>
            <SEO 
                title="Page Not Found"
                description="The page you are looking for does not exist. Please go back to the catalog or home page."
            />
            <div className="bg-[#F6F1EB] min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-24 text-[#330020]">
                <div className="w-24 h-24 bg-white/55 rounded-3xl border border-[#330020]/10 flex items-center justify-center text-[#8A8F68] mb-8 shadow-soft">
                    <Search size={40} />
                </div>
                <h1 className="text-6xl md:text-8xl font-serif text-[#330020] mb-4 tracking-tighter italic">404</h1>
                <h2 className="text-2xl md:text-3xl font-serif text-[#330020] mb-8 tracking-tight italic">Furniture Piece Missing</h2>
                <p className="text-[#330020]/72 text-base md:text-lg max-w-md mb-12 font-light leading-relaxed">
                    It seems the page you're looking for has been moved or doesn't exist in our current mart curation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                        to="/home" 
                        className="px-10 py-5 bg-[#330020] text-[#F6F1EB] rounded-full font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-[#4A012E] hover:shadow-lg hover:shadow-[#4A012E]/20 transition-all active:scale-95 cursor-pointer"
                    >
                        <Home size={16} />
                        Back To Home
                    </Link>
                    <Link 
                        to="/products" 
                        className="px-10 py-5 bg-white/80 text-[#330020] border border-[#330020]/10 rounded-full font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-white hover:border-[#330020]/30 transition-all active:scale-95 cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Browse Catalog
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default NotFound;
