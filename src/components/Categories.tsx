"use client";

import Image from "next/image";
import Link from "next/link";

import useMediaQuery from "./hooks/useMediaQuery";
import { urlData } from "./utils/routes";
import { flexCenter } from "./utils/style";

const titleStyle = "text-base-secondary text-lg font-semibold";

function Categories(): JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 1060px)");

  return (
    <div
      className="flex flex-wrap gap-5 justify-center mb-5"
      data-testid="categories"
    >
      {urlData.map((category) => {
        return (
          <Link
            href={category.url}
            key={category.id}
            className="relative group"
          >
            <div>
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
                  <p className={titleStyle}>{category.alt.toUpperCase()}</p>
                </div>
              ) : (
                <div
                  className={`absolute inset-0 transition-opacity duration-300
                   bg-black/40 ${flexCenter}`}
                >
                  <p className={titleStyle}>{category.alt.toUpperCase()}</p>
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
