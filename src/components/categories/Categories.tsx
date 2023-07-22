"use client";

import Image from "next/image";
import Link from "next/link";

import { urlData } from "../hero/heroData";
import useMediaQuery from "../hooks/useMediaQuery";

function Categories(): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 1060px)");
  const categoryTitleSTyle = "text-base-secondary text-lg font-semibold";

  return (
    <div className="flex flex-wrap gap-5 justify-center mb-5">
      {urlData.map((category) => {
        return (
          <Link
            href={category.url}
            key={category.id}
            className="relative group"
          >
            <div className="">
              <Image
                src={category.category_image}
                alt={category.alt}
                width={250}
                height={250}
                className="hover:scale-105 transition-all duration-300"
              />
              {isDesktop ? (
                <div
                  className="absolute bottom-5 left-0 p-4 opacity-0
               bg-black/50 transition-all duration-300 
               group-hover:opacity-100 scale-105"
                >
                  <p className={`${categoryTitleSTyle}`}>
                    {category.alt.toUpperCase()}
                  </p>
                </div>
              ) : (
                <div
                  className="absolute inset-0 flex items-center
                   justify-center transition-opacity duration-300
                   bg-black/40"
                >
                  <p className={`${categoryTitleSTyle}`}>
                    {category.alt.toUpperCase()}
                  </p>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Categories;
