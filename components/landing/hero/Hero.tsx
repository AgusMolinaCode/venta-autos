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
            className="flex flex-col items-center lg:items-start justify-center space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-9xl font-bold dark:text-gray-100 text-gray-900 text-center lg:text-left">
              Bs.As Cars
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl dark:text-gray-200 text-gray-800 text-center lg:text-left">
              Tu mejor opción para tu próximo vehículo.
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