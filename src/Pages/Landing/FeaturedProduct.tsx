import { useState, useEffect } from 'react';
import cat7 from "../../Asset/ProductImages/Sweat_Shirt.png";
import cat8 from "../../Asset/ProductImages/Fasshion.png";
import cat9 from "../../Asset/ProductImages/Suite.png";
import '../../Styles/animation.css'
import { useNavigate } from 'react-router-dom';

const FeaturedProduct = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sample product data
  const products = [
    {
      image: cat7,
      icon: '👗',
      title: 'Premium Fabrics',
      subtitle: 'Limited Edition',
      timer: { days: 15, hours: 10, mins: 56, secs: 64 },
      buttonText: 'Shop Now',
      description: 'Luxury fashion collection'
    },
    {
      image: cat9,
      icon: '👔',
      title: 'Classic Collection',
      subtitle: 'Timeless Elegance',
      timer: { days: 10, hours: 5, mins: 30, secs: 45 },
      buttonText: 'View Deal',
      description: 'Premium quality essentials'
    },
    {
      image: cat8,
      icon: '👕',
      title: 'Designer Trends',
      subtitle: 'New Arrivals',
      timer: { days: 20, hours: 8, mins: 15, secs: 30 },
      buttonText: 'Explore',
      description: 'Latest fashion trends'
    },
  ];

  // Auto-rotate every 5 seconds
  useEffect(() => {
    let interval: any;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        changeSlide('next');
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length]);

  const changeSlide = (direction: any) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    setCurrentIndex((prevIndex) => {
      if (direction === 'next') {
        return prevIndex === products.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? products.length - 1 : prevIndex - 1;
      }
    });

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const nextSlide = () => {
    changeSlide('next');
  };

  const prevSlide = () => {
    changeSlide('prev');
  };

  // Pause/resume auto-play
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const currentProduct = products[currentIndex];

  return (
    <div 
      className="bg-white lg:pt-10 flex justify-center overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-linear-to-br from-primary to-[orange] justify-center items-center container max-w-275 h-[400px] flex relative overflow-hidden">
        <div className="mx-auto container py-10 px-10 md:px-20 flex flex-col lg:flex-row gap-12 lg:items-center">
          {/* Left Content with smooth animations */}
          <div className="flex flex-col space-y-10 w-full lg:w-1/2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-white text-2xl animate-slide-in-left" style={{ animationDuration: '0.6s' }}>
                  {currentProduct.icon}
                </span>
                <h1 
                  key={`title-${currentIndex}`}
                  className="text-black text-3xl lg:text-4xl font-500 animate-slide-in-left"
                  style={{ animationDuration: '0.6s', animationDelay: '0.1s' }}
                >
                  {currentProduct.title}
                </h1>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-white text-2xl animate-slide-in-left" style={{ animationDuration: '0.6s', animationDelay: '0.15s' }}>
                  ✨
                </span>
                <h1 
                  key={`subtitle-${currentIndex}`}
                  className="text-black text-3xl lg:text-4xl font-500 animate-slide-in-left"
                  style={{ animationDuration: '0.6s', animationDelay: '0.2s' }}
                >
                  {currentProduct.subtitle}
                </h1>
              </div>
              <p 
                key={`description-${currentIndex}`}
                className="text-gray-700 text-lg mt-2 animate-slide-in-left"
                style={{ animationDuration: '0.6s', animationDelay: '0.25s' }}
              >
                {currentProduct.description}
              </p>
            </div>
            
            {/* Timer with animation */}
            <div 
              key={`timer-${currentIndex}`}
              className="flex gap-2 animate-fade-in"
              style={{ animationDuration: '0.7s', animationDelay: '0.3s' }}
            >
              <div className="flex flex-col items-center rounded-full bg-white w-12.5 h-12.5 text-center justify-center hover:scale-110 transition-transform duration-300">
                <p className="font-semibold text-sm">{currentProduct.timer.days}</p>
                <p className="text-sm opacity-70">days</p>
              </div>
              <div className="flex flex-col items-center rounded-full bg-white w-12.5 h-12.5 text-center justify-center hover:scale-110 transition-transform duration-300">
                <p className="font-semibold text-sm">{currentProduct.timer.hours}</p>
                <p className="text-sm opacity-70">hrs</p>
              </div>
              <div className="flex flex-col items-center rounded-full bg-white w-12.5 h-12.5 text-center justify-center hover:scale-110 transition-transform duration-300">
                <p className="font-semibold text-sm">{currentProduct.timer.mins}</p>
                <p className="text-sm opacity-70">min</p>
              </div>
              <div className="flex flex-col items-center rounded-full bg-white w-12.5 h-12.5 text-center justify-center hover:scale-110 transition-transform duration-300">
                <p className="font-semibold text-sm">{currentProduct.timer.secs}</p>
                <p className="text-sm opacity-70">sec</p>
              </div>
            </div>
            
            <button 
              onClick={()=> navigate('/products')}
              key={`button-${currentIndex}`}
              className="bg-primary shadow-lg border text-white w-37.5 py-2 cursor-pointer rounded-xl hover:scale-105 transition-all duration-700 ease-in-out animate-fade-in"
              style={{ animationDuration: '0.7s', animationDelay: '0.4s' }}
            >
              {currentProduct.buttonText}
            </button>
          </div>
          
          {/* Image with smooth slide and scale animation */}
          <div className="w-full lg:w-1/3 relative overflow-hidden">
            <div 
              className="relative"
              style={{
                perspective: '1000px'
              }}
            >
              <img
                key={`image-${currentIndex}`}
                src={currentProduct.image}
                alt={currentProduct.title}
                className="object-cover w-full animate-image-transition hover:scale-105 transition-transform duration-500 ease-in-out"
                style={{
                  animationDuration: '0.8s',
                  animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Controls with hover animations */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-gray-500/10 hover:bg-gray-500/20 cursor-pointer hover:scale-110 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-gray-500/10 hover:bg-gray-500/20 cursor-pointer  hover:scale-110 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot Indicators with animation */}
        <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 3000);
              }}
              className={`transition-all duration-500 rounded-full ${
                index === currentIndex 
                  ? 'bg-white w-6 md:w-8 h-2 md:h-3 scale-110' 
                  : 'bg-white/50 hover:bg-white/70 w-2 md:w-3 h-2 md:h-3 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>

    
    </div>
  );
};

export default FeaturedProduct;