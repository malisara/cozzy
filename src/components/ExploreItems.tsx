"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { DEFAULT_HOMEPAGE_CATEGORY } from "@/constants";
import ItemDisplay from "./ItemDisplay";
import ItemList from "./ItemList";
import ItemSort from "./itemSort/ItemSort";
import Title from "./Title";

const categoriesAndTitles = {
  women: { title: "women's clothing", category: "women's clothing" },
  men: { title: "men's clothing", category: "men's clothing" },
  jewelry: { title: "jewelry", category: "jewelery" },
  home: { title: "explore", category: DEFAULT_HOMEPAGE_CATEGORY },
};

type Props = {
  limit?: number;
};

function ExploreItems({ limit }: Props): JSX.Element {
  const [gridDisplay, setGridDisplay] = useState<boolean>(true);
  const [sortPriceDescending, setsortPriceDescending] =
    useState<boolean>(false);

  let currentPath = usePathname().slice(1);
  currentPath = currentPath.length > 0 ? currentPath : "home";
  const result =
    categoriesAndTitles[currentPath as keyof typeof categoriesAndTitles];

  return (
    <div className="bg-white">
      <Title title={result.title} />
      <div
        className="px-4 h-fit w-full flex flex-wrap 
      justify-center gap-6 mb-6"
      >
        <ItemSort onSortChange={setsortPriceDescending} />
        <ItemDisplay
          onDisplayChange={setGridDisplay}
          hasGridDisplay={gridDisplay}
        />
      </div>
      <div className="pt-16 pb-[7rem] px-10 lg:px-[13rem]">
        <ItemList
          gridDisplay={gridDisplay}
          sortPriceDescending={sortPriceDescending}
          category={result.category}
          limit={limit}
        />
      </div>
    </div>
  );
}

export default ExploreItems;
