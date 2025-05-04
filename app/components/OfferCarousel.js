"use client";
import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowRight, Clock, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export default function OfferCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);
  
  // Enhanced offer data with more engaging details
  const offers = [
    { 
      id: 1,
      img: "/Images/banner.jpg", 
      title: "10.10 MEGA SALE", 
      subtitle: "Save up to 35% on premium dishes",
      color: "from-orange-500 to-red-500",
      badge: "Limited Time",
      endTime: "2023-10-15",
      buttonText: "Grab Offer",
      description: "Enjoy exclusive discounts on our chef's special selection"
    },
    { 
      id: 2,
      img: "/images/offer2.png", 
      title: "FREE DELIVERY", 
      subtitle: "No minimum order required",
      color: "from-blue-500 to-indigo-600",
      badge: "Weekend Special",
      promoCode: "FREEDEL",
      buttonText: "Use Code",
      description: "Order your favorites and enjoy free delivery all weekend long"
    },
    { 
      id: 3,
      img: "/images/offer3.png", 
      title: "FAMILY FEAST", 
      subtitle: "Perfect for 4-6 people",
      color: "from-green-500 to-emerald-600",
      badge: "Best Value",
      discount: "25%",
      buttonText: "Order Now",
      description: "Complete meal with appetizers, mains, and desserts at a special price"
    },
  ];

  // Custom next/prev methods
  const next = () => {
    sliderRef.current.slickNext();
  };
  
  const previous = () => {
    sliderRef.current.slickPrev();
  };

  // Calculate remaining time for limited offers
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });
  
  useEffect(() => {
    const updateRemainingTime = () => {
      const endDate = new Date(offers[0].endTime);
      const now = new Date();
      const timeDiff = endDate - now;
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeRemaining({ days, hours, minutes });
      }
    };
    
    updateRemainingTime();
    const timer = setInterval(updateRemainingTime, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setActiveSlide(next),
    fade: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <div className="w-full max-w-[520px]">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        {/* Main Slider */}
        <Slider ref={sliderRef} {...settings} className="offer-carousel">
          {offers.map((offer, index) => (
            <div key={offer.id}>
              <div className={`relative w-full h-[320px] md:h-[380px] overflow-hidden`}>
                {/* Background Gradient + Image */}
                <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-90 z-10`}></div>
                <img
                  src={offer.img}
                  alt={offer.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover opacity-30 scale-110"
                />
                
                {/* Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYyYzcuNzMyIDAgMTQgNi4yNjggMTQgMTRoMnptLTIgMGMwIDcuNzMyLTYuMjY4IDE0LTE0IDE0djJjOC45NCAwIDE2LTcuMDYgMTYtMTZoLTJ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-50 z-20"></div>
                
                {/* Content */}
                <div className="absolute inset-0 z-30 flex flex-col justify-between p-8 md:p-10">
                  {/* Top Badge */}
                  <div className="flex justify-between items-start">
                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{offer.badge}</span>
                      </div>
                    </div>
                    
                    {/* Timer for limited offer */}
                    {index === 0 && (
                      <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 text-white">
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>Ends in:</span>
                        </div>
                        <div className="flex gap-2 mt-1 font-mono text-sm">
                          <span>{timeRemaining.days}d</span>
                          <span>{timeRemaining.hours}h</span>
                          <span>{timeRemaining.minutes}m</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Promo code display */}
                    {offer.promoCode && (
                      <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2">
                        <div className="text-xs text-white mb-1">Use code:</div>
                        <div className="bg-white text-gray-800 px-2 py-1 rounded font-mono font-bold text-sm tracking-wider">
                          {offer.promoCode}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Main Content */}
                  <div className="mt-auto">
                    {/* Offer details */}
                    <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                      {offer.title}
                    </h3>
                    <p className="text-xl md:text-2xl font-medium text-white/90 mb-2">
                      {offer.subtitle}
                    </p>
                    <p className="text-white/80 mb-6 max-w-xs">
                      {offer.description}
                    </p>
                    
                    {/* CTA Button */}
                    <button className="group inline-flex items-center gap-2 bg-white hover:bg-white/90 transition-all text-gray-800 font-medium px-6 py-3 rounded-full shadow-lg">
                      {offer.buttonText}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
        
        {/* Navigation Controls */}
        <div className="absolute bottom-4 right-4 z-40 flex gap-2">
          <button 
            onClick={previous}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={next}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-4 z-40 flex gap-2">
          {offers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => sliderRef.current.slickGoTo(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeSlide === idx 
                  ? 'w-6 bg-white' 
                  : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}