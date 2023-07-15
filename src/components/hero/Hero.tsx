"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { heroData } from "./heroData";

//todo
//darker image
//routes

function Hero(): JSX.Element {
  const [shownImage, setShownImage] = useState<number>(1);
  const indicatorStyle = "bg-gray-400 w-3 h-3 rounded-full";

  useEffect(() => {
    const interval = setInterval(() => {
      setShownImage((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, [shownImage]);

  return (
    // carousel insipred by:
    //https://tailwind-elements.com/docs/standard/components/carousel/
    <div>
      <div className="fixed w-full top-0">
        <div className="relative h-[20rem] overflow-hidden lg:h-[50rem]">
          {/* Hero Images */}
          {heroData
            .filter((hero) => hero.id === shownImage)
            .map((hero) => {
              return (
                <AnimatePresence>
                  <motion.div
                    key={hero.id}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1, transition: { duration: 0.4 } }}
                    exit={{ opacity: 0.8, transition: { duration: 0.4 } }}
                    className="h-full relative"
                  >
                    <Image
                      src={hero.src}
                      fill={true}
                      alt={hero.alt}
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0 flex flex-col gap-5
                         lg:gap-10 items-center justify-center"
                    >
                      <div
                        className="text-base-secondary text-4xl 
                        lg:text-6xl"
                      >
                        {hero.title}.
                      </div>
                      <button
                        className="rounded border-base-secondary border-2 
                          p-1 md:p-2 text-base-secondary hover:bg-gray-50/10 
                          text-sm md:text-lg"
                      >
                        <Link href={hero.url} />
                        Explore {hero.buttonContent}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              );
            })}
        </div>

        {/* Slider Indicators */}
        <div
          className="absolute z-40 flex gap-3 -translate-x-1/2 
        bottom-16 left-1/2"
        >
          <button
            onClick={() => setShownImage(0)}
            id="sliderBtn-0"
            aria-current={0 === shownImage}
            className={`[&[aria-current='true']]:bg-white ${indicatorStyle}`}
          ></button>
          <button
            onClick={() => setShownImage(1)}
            id="sliderBtn-1"
            aria-current={1 === shownImage}
            className={`[&[aria-current='true']]:bg-white ${indicatorStyle}`}
          ></button>
          <button
            onClick={() => setShownImage(2)}
            id="sliderBtn-2"
            aria-current={2 === shownImage}
            className={`[&[aria-current='true']]:bg-white ${indicatorStyle}`}
          ></button>
        </div>

        {/* Contro Buttons */}
        <div
          className="absolute top-0 left-0 z-30 flex items-center
           justify-center h-full px-4"
        >
          <button
            className="inline-flex items-center justify-center w-10 h-10 
          rounded-full bg-gray-300 hover:bg-gray-50"
            onClick={() => setShownImage((prev) => (prev + 2) % 3)}
          >
            <svg
              className="w-4 h-4 dark:text-gray-800"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </button>
        </div>

        <div
          className="absolute top-0 right-0 z-30 flex items-center
           justify-center h-full px-4"
        >
          <button
            className="inline-flex items-center justify-center w-10 h-10 
          rounded-full bg-gray-300 hover:bg-gray-50"
            onClick={() => setShownImage((prev) => (prev + 1) % 3)}
          >
            <svg
              className="w-4 h-4 dark:text-gray-800"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
