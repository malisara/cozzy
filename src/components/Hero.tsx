"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { urlData } from "./utils/routes";
import { flexCenter, imageCover } from "./utils/style";

const indicatorStyle = "bg-gray-400 w-3 h-3 rounded-full";

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
      setShownImage((prev) => [(prev[0] + 1) % 3, -1]);
    } else {
      setShownImage((prev) => [(prev[0] + 2) % 3, 1]);
    }
  }

  return (
    // carousel insipred by:
    //https://tailwind-elements.com/docs/standard/components/carousel/
    <div>
      <div className="absolute w-full top-0">
        <div className="h-[20rem] overflow-hidden lg:h-[50rem]">
          <AnimatePresence custom={direction} initial={false}>
            {/* Hero Images */}
            {urlData
              .filter((hero) => hero.id === shownImage)
              .map((hero) => {
                return (
                  <div className={imageCover} key={"animate-div"}>
                    <motion.img
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                      custom={direction}
                      key={hero.id}
                      src={hero.src.src}
                      className={imageCover}
                    />
                    <div
                      className={`absolute inset-0 flex-col gap-5
                         lg:gap-10 ${flexCenter}`}
                    >
                      <div
                        className="text-base-secondary text-4xl 
                        lg:text-6xl"
                      >
                        {hero.title}.
                      </div>
                      <Link
                        href={hero.url}
                        className="rounded border-base-secondary border-2 
                          p-1 md:p-2 text-base-secondary
                          hover:bg-gray-50/10 text-sm md:text-lg
                          transtion-all duration-500"
                      >
                        Explore {hero.alt}
                      </Link>

                      {/* indicators */}
                      <div
                        className="absolute flex gap-3 -translate-x-1/2 
                          bottom-16 left-1/2"
                      >
                        <p
                          id="sliderBtn-0"
                          aria-current={0 === shownImage}
                          className={`[&[aria-current='true']]:bg-white 
                          ${indicatorStyle}`}
                        ></p>
                        <p
                          id="sliderBtn-1"
                          aria-current={1 === shownImage}
                          className={`[&[aria-current='true']]:bg-white
                           ${indicatorStyle}`}
                        ></p>
                        <p
                          id="sliderBtn-2"
                          aria-current={2 === shownImage}
                          className={`[&[aria-current='true']]:bg-white 
                          ${indicatorStyle}`}
                        ></p>
                      </div>
                    </div>
                  </div>
                );
              })}
            [0]
          </AnimatePresence>
        </div>

        {/* Control Buttons */}
        <div className={`absolute top-0 left-0 h-full px-4 ${flexCenter}`}>
          <button
            className={`w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-50 
            ${flexCenter}`}
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

        <div className={`absolute top-0 right-0 h-full px-4 ${flexCenter}`}>
          <button
            className={`w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-50
             ${flexCenter}`}
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
