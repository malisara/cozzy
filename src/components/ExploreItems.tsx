"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Title from "./Title";

import ItemDisplay from "./ItemDisplay";
import ItemList from "./ItemList";
import ItemSort from "./itemSort/ItemSort";
import { DEFAULT_HOMEPAGE_CATEGORY } from "@/constants";

type Props = {
  limit?: number;
};

const categoriesAndTitles = {
  women: { title: "women's clothing", category: "women's clothing" },
  men: { title: "men's clothing", category: "men's clothing" },
  jewelry: { title: "jewelry", category: "jewelery" },
  home: { title: "explore", category: DEFAULT_HOMEPAGE_CATEGORY },
};

function ExploreItems({ limit }: Props): JSX.Element {
  let currentPath = usePathname().slice(1);
  currentPath = currentPath ? currentPath : "home";
  const [hasGridDisplay, sethasGridDisplay] = useState<boolean>(true);
  const [sortPriceDescending, setsortPriceDescending] =
    useState<boolean>(false);
  const result =
    categoriesAndTitles[currentPath as keyof typeof categoriesAndTitles];

  function changeItemsDisplay(value: boolean) {
    sethasGridDisplay(value);
  }

  function changeSorting(value: boolean) {
    setsortPriceDescending(value);
  }

  return (
    <div className="bg-white">
      <Title title={result.title} />
      <div
        className="px-4 h-fit w-full flex flex-wrap 
      justify-center gap-6 mb-6"
      >
        <ItemSort onSortChange={changeSorting} />
        <ItemDisplay
          onDisplayChange={changeItemsDisplay}
          hasGridDisplay={hasGridDisplay}
        />
      </div>
      <div className="pt-16 pb-[7rem] px-10 lg:px-[13rem]">
        <ItemList
          hasGridDisplay={hasGridDisplay}
          sortPriceDescending={sortPriceDescending}
          category={result.category}
          limit={limit}
        />
      </div>
    </div>
  );
}

export default ExploreItems;
