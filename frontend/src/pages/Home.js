import React, { useEffect } from 'react';
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

const Home = () => {
    // Prefetch all products when component mounts
    useEffect(() => {
        prefetchAllProducts();
    }, []);

    const toggleChatbot = () => {
        alert("Chatbot toggled!");
    };

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1,
    };

    return (
        <div className="home">
            {/* Existing Features */}
            <CategoryList />
            <BannerProduct />
            <HorizontalCardProduct category={"NamePlates"} heading={"Top's Name Plates"} />
            <HorizontalCardProduct category={"NeonLightsSign"} heading={"Popular's Neon Lights"} />
            <VerticalCardProduct category={"NamePlates"} heading={"Name Plates"} />
            <VerticalCardProduct category={"NeonLightsSign"} heading={"Neon Lights Sign"} />
            <VerticalCardProduct category={"MetalLetters"} heading={"Metal Letters"} />

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

            <VerticalCardProduct category={"MetalLetters"} heading={"Recommended Just For You"} />

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