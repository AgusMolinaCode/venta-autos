'use client'

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Hero = memo(function Hero() {
  return (
    <div className="">
      <div className="container mx-auto px-6 py-20">
        <div className="grid 2xl:grid-cols-2 gap-12 items-center">
          {/* Left Side - Title */}
          <motion.div 
            className="flex flex-col items-center lg:items-start justify-center space-y-4 w-[400px]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-5xl font-bold text-white text-center lg:text-left">
              Rent Car
            </h1>
            <p className="text-xl md:text-2xl lg:text-2xl text-blue-100 text-center lg:text-left font-light">
              Tu mejor opción para alquilar vehículos
            </p>
          </motion.div>

          {/* Right Side - Car Image */}
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Fondo adaptativo para light y dark mode */}
              <div className="absolute inset-y-0 right-0 left-1/4 bg-gradient-to-r from-emerald-200 to-emerald-300 dark:from-emerald-800 dark:to-emerald-700 rounded-l-3xl rounded-r-3xl"></div>
              
              <Image
                src="/hero-car.jpg"
                alt="Hero Car"
                width={1000}
                height={1000}
                className="relative z-10 w-full h-auto lg:max-w-6xl xl:w-[900px] 3xl:w-[1200px]"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

export default Hero;