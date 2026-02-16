// app/welcome/page.js or components/WelcomeSplash.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function WelcomeSplash() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const visited = localStorage.getItem('hasVisited');
    if (visited === 'true') {
      // Skip splash and go directly to home
      router.push('/');
    } else {
      setIsReady(true);
    }
  }, [router]);

  const handleEnter = () => {
    // Mark as visited
    localStorage.setItem('hasVisited', 'true');
    // Navigate to main page
    router.push('/');
  };

  if (!isReady) {
    return null; // Or a simple loader
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            #000 50px,
            #000 51px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            #000 50px,
            #000 51px
          )`
        }}></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-gray-900 transform rotate-12 animate-spin-slow"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-gray-900 transform -rotate-12 animate-spin-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gray-900 transform rotate-45 animate-pulse"></div>
      </motion.div>

      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        
        {/* Logo/Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Your Logo */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
              className="inline-block"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-900 flex items-center justify-center text-white text-4xl md:text-5xl font-black">
                R
              </div>
            </motion.div>
          </div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight mb-4">
              Welcome to
            </h1>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium text-gray-900 tracking-tight">
              Our Restaurant
            </h2>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full mb-12 md:mb-16"
        >
          <FeatureCard
            icon="🔥"
            title="Premium Quality"
            description="Finest ingredients"
            delay={1}
          />
          <FeatureCard
            icon="⚡"
            title="Fast Delivery"
            description="20-30 minutes"
            delay={1.1}
          />
          <FeatureCard
            icon="⭐"
            title="5-Star Rated"
            description="By 8000+ customers"
            delay={1.2}
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md"
        >
          <button
            onClick={handleEnter}
            className="group relative w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-gray-900 text-white text-base md:text-lg font-medium tracking-wide hover:bg-gray-800 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Explore Menu
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </button>

          <button
            onClick={() => router.push('/user/popular')}
            className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-gray-50 text-gray-900 text-base md:text-lg font-medium tracking-wide hover:bg-gray-100 transition-all duration-300 border border-gray-200"
          >
            Chef's Specials
          </button>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-600 font-light mb-2">
            Trusted by food lovers across UAE & Saudi Arabia
          </p>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900"></div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="group bg-gray-50 border border-gray-200 p-6 hover:bg-white hover:border-gray-900 hover:shadow-lg transition-all duration-300"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 font-light">{description}</p>
    </motion.div>
  );
}