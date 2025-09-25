"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-9xl font-bold dark:text-gray-100 text-gray-900 text-center lg:text-left">
              Bs.As Cars
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl dark:text-gray-200 text-gray-800 text-center lg:text-left">
              Tu mejor opción para tu próximo vehículo.
            </p>
            <Link href="/vehiculos" className="cursor-pointer">
              <button className="cursor-pointer group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-emerald-300 dark:bg-emerald-700 py-1 pl-6 pr-14 font-bold text-gray-900 dark:text-neutral-50">
                <span className="z-10 pr-2">Ver Vehículos</span>
                <div className="absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-full dark:bg-emerald-500 bg-emerald-500 transition-[width] group-hover:w-[calc(100%-8px)]">
                  <div className="mr-3.5 flex items-center justify-center">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-black font-black"
                    >
                      <path
                        d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      ></path>
                    </svg>
                  </div>
                </div>
              </button>
            </Link>
          </motion.div>

          {/* Right Side - Car Image */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
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
