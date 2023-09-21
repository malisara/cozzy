"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { DEFAULT_HOMEPAGE_CATEGORY } from "@/constants";
import { useGetItemsByCategory } from "@/fetchers/fetchItems";
import GeneralError from "./errorComponents/GeneralError";
import Items from "./Items";
import Loading from "./Loading";
import Title from "./Title";
import ToggleDisplay from "./ToggleDisplay";
import ToggleSort from "./ToggleSort";

const categories = {
  women: { title: "women's clothing", category: "women's clothing" },
  men: { title: "men's clothing", category: "men's clothing" },
  jewelry: { title: "jewelry", category: "jewelery" },
  home: { title: "explore", category: DEFAULT_HOMEPAGE_CATEGORY },
};

type Props = {
  limit?: number;
};

function ItemsByCategory({ limit }: Props): JSX.Element {
  const [gridDisplay, setGridDisplay] = useState<boolean>(true);
  const [sortPriceDescending, setsortPriceDescending] =
    useState<boolean>(false);

  let currentPath = usePathname().slice(1);
  currentPath = currentPath.length > 0 ? currentPath : "home";
  const category = categories[currentPath as keyof typeof categories];
  const { data, error, isLoading } = useGetItemsByCategory(
    category.category,
    limit
  );

  if (error)
    return (
      <GeneralError errorMessage={`unable to load ${category.title} page`} />
    );
  if (isLoading || !data) return <Loading />;

  return (
    <div className="bg-white">
      <Title title={category.title} />
      <div
        className="px-4 h-fit w-full flex flex-wrap 
      justify-center gap-6 mb-6"
      >
        <ToggleSort onSortChange={setsortPriceDescending} />
        <ToggleDisplay
          onDisplayChange={setGridDisplay}
          gridDisplay={gridDisplay}
        />
      </div>
      <div className="pt-16 pb-[7rem] px-10 lg:px-[13rem]">
        <Items
          gridDisplay={gridDisplay}
          sortPriceDescending={sortPriceDescending}
          data={data}
        />
      </div>
    </div>
  );
}

export default ItemsByCategory;
