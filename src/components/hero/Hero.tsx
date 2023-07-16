"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { heroData } from "./heroData";
//TODO
//keys

const variants = {
  //taken from:
  //https://codesandbox.io/s/framer-motion-image-gallery-pqvx3?from-embed=&file=/src/Example.tsx:1038-1045
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

function Hero(): JSX.Element {
  const [[shownImage, direction], setShownImage] = useState<number[]>([1, -1]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [shownImage]);

  function nextImage(nextImg: boolean) {
    if (nextImg) {
      setShownImage((prevState) => [(prevState[0] + 1) % 3, -1]);
    } else {
      setShownImage((prev) => [(prev[0] + 2) % 3, 1]);
    }
  }

  return (
    // carousel insipred by:
    //https://tailwind-elements.com/docs/standard/components/carousel/
    <div>
      <div className="fixed w-full top-0">
        <div className="h-[20rem] overflow-hidden lg:h-[50rem]">
          <AnimatePresence custom={direction} initial={false}>
            {/* Hero Images */}
            {heroData
              .filter((hero) => hero.id === shownImage)
              .map((hero) => {
                return (
                  <>
                    <motion.img
                      key={hero.id}
                      src={hero.src.src}
                      className="object-cover w-full h-full"
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.1 },
                      }}
                      custom={direction}
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
                          p-1 md:p-2 text-base-secondary
                          hover:bg-gray-50/10 text-sm md:text-lg"
                      >
                        <Link href={hero.url} />
                        Explore {hero.buttonContent}
                      </button>
                    </div>
                  </>
                );
              })}
          </AnimatePresence>
        </div>

        {/* Contro Buttons */}
        <div
          className="absolute top-0 left-0 z-30 flex items-center
           justify-center h-full px-4"
        >
          <button
            className="inline-flex items-center justify-center w-10 h-10 
          rounded-full bg-gray-300 hover:bg-gray-50"
            onClick={() => nextImage(false)}
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
            onClick={() => nextImage(true)}
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
