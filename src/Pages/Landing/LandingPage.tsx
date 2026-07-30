import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import TopNav from '../../Components/TopNav';
import Footer from '../../Components/Footer';
import Categories from './Categories';
import FeaturedProduct from './FeaturedProduct';

import heroVideoDesktop from '../../Asset/Video/lv_0_20260622220339.mp4';
import heroVideoMobile from '../../Asset/video/lv_0_20260622220203.mp4';
import AllProducts from './AllProducts';

function LandingPage() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const handleChange = () => setIsMobile(mql.matches);

    handleChange();
    mql.addEventListener ? mql.addEventListener('change', handleChange) : mql.addListener(handleChange);

    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', handleChange) : mql.removeListener(handleChange);
    };
  }, []);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div>
      <TopNav/>
      <div className="sticky top-0 z-50 w-full">
        <Navbar/>
      </div>

      <div className="relative h-screen w-full overflow-hidden">
        {/* Background video */}
        {!prefersReducedMotion && (
          <video
            key={isMobile ? 'mobile' : 'desktop'}
            src={isMobile ? heroVideoMobile : heroVideoDesktop}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}

        {/* Overlay to keep text/button readable over the video */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative z-10 w-full h-full">
          {/* Button positioned at bottom right on mobile, centered on large screens */}
          <div className="absolute bottom-8 right-4 lg:bottom-1/3 lg:right-1/2 lg:translate-x-1/2 lg:translate-y-1/2">
            <button className="bg-white text-[#f2592b] font-semibold shadow-lg flex justify-center items-center gap-4 w-37.5 py-3 rounded-full hover:scale-105 transition-all duration-700 ease-in-out cursor-pointer">
              Shop now
            </button>
          </div>
        </div>
      </div>

      <Categories/>

      {/* Featured product */}
      <FeaturedProduct />
      
      {/* All products */}
      <AllProducts/>

      <Footer/>
    </div>
  )
}

export default LandingPage