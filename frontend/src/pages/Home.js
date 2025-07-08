import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CategoryList from '../components/CategoryList';
import BannerProduct from '../components/BannerProduct';
import HorizontalCardProduct from '../components/HorizontalCardProduct';
import VerticalCardProduct from '../components/VerticalCardProduct';
import { prefetchAllProducts } from '../services/productService';
import '../Home.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
    // Prefetch all products when component mounts
    useEffect(() => {
        prefetchAllProducts();
        // Fetch recently viewed products
        const fetchRecentlyViewed = async () => {
            const ids = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            if (ids.length === 0) return;
            const res = await fetch(`/api/get-product?ids=${ids.join(',')}`);
            const data = await res.json();
            if (data.success) setRecentlyViewed(data.data);
        };
        fetchRecentlyViewed();
        // Fetch top products for fallback
        const fetchTopProducts = async () => {
            const res = await fetch('/api/get-product');
            const data = await res.json();
            if (data.success) {
                setTopProducts({
                    NamePlates: data.data.filter(p => p.category === 'NamePlates').slice(0, 8),
                    NeonLightsSign: data.data.filter(p => p.category === 'NeonLightsSign').slice(0, 8),
                    MetalLetters: data.data.filter(p => p.category === 'MetalLetters').slice(0, 8),
                });
            }
        };
        fetchTopProducts();
    }, []);

    const toggleChatbot = () => {
        alert("Chatbot toggled!");
    };

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1,
    };

    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [topProducts, setTopProducts] = useState({ NamePlates: [], NeonLightsSign: [], MetalLetters: [] });
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();

    // Helper to get products for a section
    const getSectionProducts = (category) => {
        if (recentlyViewed.length >= 8) {
            return recentlyViewed.filter(p => p.category === category).slice(0, 8);
        }
        // Fallback to top products if not enough recently viewed
        return topProducts[category] || [];
    };

    return (
        <div className="home bg-background min-h-screen">
            {/* Existing Features */}
            <CategoryList />
            <BannerProduct />
            <HorizontalCardProduct category={"NamePlates"} heading={"Top's Name Plates"} products={getSectionProducts('NamePlates')} />
            <HorizontalCardProduct category={"NeonLightsSign"} heading={"Popular's Neon Lights"} products={getSectionProducts('NeonLightsSign')} />
            <VerticalCardProduct category={"NamePlates"} heading={"Name Plates"} products={getSectionProducts('NamePlates')} />
            <VerticalCardProduct category={"NeonLightsSign"} heading={"Neon Lights Sign"} products={getSectionProducts('NeonLightsSign')} />
            <VerticalCardProduct category={"MetalLetters"} heading={"Metal Letters"} products={getSectionProducts('MetalLetters')} />

            {/* New Features */}
            <div className="video-background">
                <video autoPlay loop muted>
                    <source src="./videoplayback.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                    <div className="bg-black/50 p-8 rounded-xl   animate-fadeIn">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 text-transparent bg-clip-text animate-slideIn">
                            Customize Your World
                        </h1>
                        <p className="mt-4 text-lg md:text-2xl font-medium tracking-wider animate-fadeUp">
                            Where Creativity Meets Quality
                        </p>
                    </div>
                </div>
            </div>

            {/* Recently Viewed Products */}
            {recentlyViewed.length > 0 && (
                <div className='my-8 w-[90vw] mx-auto relative'>
                    <h2 className='text-2xl font-bold mb-4'>Recently Viewed Products</h2>
                    <div className='relative'>
                        <button className='bg-white shadow-md rounded-full p-1 absolute left-0 top-1/2 -translate-y-1/2 text-lg z-10 hidden md:block' onClick={() => {
                            const el = document.getElementById('recentlyViewedScroll');
                            if (el) el.scrollLeft -= 300;
                        }}>&lt;</button>
                        <button className='bg-white shadow-md rounded-full p-1 absolute right-0 top-1/2 -translate-y-1/2 text-lg z-10 hidden md:block' onClick={() => {
                            const el = document.getElementById('recentlyViewedScroll');
                            if (el) el.scrollLeft += 300;
                        }}>&gt;</button>
                        <div id='recentlyViewedScroll' className='flex gap-6 overflow-x-scroll scrollbar-none transition-all pb-2'>
                            {recentlyViewed.map(product => (
                                <div key={product._id} className='min-w-[220px] max-w-[220px] bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col p-4 cursor-pointer' onClick={() => navigate(`/product/${product._id}`)}>
                                    <img src={product.productImage?.[0]} alt={product.productName} className='w-full h-32 object-contain mb-3' />
                                    <div className='font-semibold text-lg text-center mb-1'>{product.productName}</div>
                                    <div className='text-gray-600 text-sm mb-2 text-center'>{product.category}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <VerticalCardProduct category={"MetalLetters"} heading={"Recommended Just For You"} products={getSectionProducts('MetalLetters')} />

            <div className="loyalty-program">
                <h2>Earn Points, Get Rewards</h2>
                <div className="progress-bar">
                    <div className="progress" style={{ width: '60%' }}></div>
                </div>
                <p>You're 60% closer to your next reward!</p>
            </div>

            <div className="inventory-update">
                <p>🚨 SS Gold Mirror Only 5 left in stock!</p>
            </div>

            <div className="chatbot">
                <button onClick={toggleChatbot}>💬 Need Help?</button>
            </div>

            <div className="members-only">
                <h2>Exclusive Benefits for Members</h2>
                <button>Join Now</button>
            </div>
        </div>
    );
};

export default Home;