import { useEffect, useState } from 'react';
import Categories from './Categories';
import FeaturedProduct from './FeaturedProduct';
import AllProducts from './AllProducts';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
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

      <div className="relative h-screen w-full overflow-hidden">
        {/* Background video */}
        {!prefersReducedMotion && (
          <video
            key={isMobile ? 'mobile' : 'desktop'}
            src={isMobile ? 'https://res.cloudinary.com/dx99hljwc/video/upload/v1785855401/wxyz_mobile_video_cehwqv.mp4' : 'https://res.cloudinary.com/dx99hljwc/video/upload/v1785855400/wxyz_web_video_pgugxn.mp4'}
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
            <button onClick={() => navigate('/products')} className="bg-white text-[#f2592b] font-semibold shadow-lg flex justify-center items-center gap-4 w-37.5 py-3 rounded-full hover:scale-105 transition-all duration-700 ease-in-out cursor-pointer">
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
    </div>
  )
}

export default LandingPage