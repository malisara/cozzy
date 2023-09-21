"use client";

import { useEffect, useState } from "react";

import Item from "@/models/item";
import SingleItem from "./SingleItem";
import { useGlobalContext } from "@/context/GlobalContext";

type Props = {
  gridDisplay?: boolean;
  sortPriceDescending?: boolean;
  data: Item[];
};

function Items({
  gridDisplay = true,
  sortPriceDescending,
  data,
}: Props): JSX.Element | undefined {
  const [items, setitems] = useState<Item[]>(sortItems(data));
  const { savedItems, setSavedItems } = useGlobalContext();

  useEffect(() => {
    setitems(sortItems([...items]));
  }, [sortPriceDescending]);

  function sortItems(items: Item[]): Item[] {
    if (sortPriceDescending) {
      items.sort((a, b) => b.price - a.price);
    } else {
      items.sort((a, b) => a.price - b.price);
    }
    return items;
  }

  function toggleSaveItem(id: number) {
    if (savedItems.includes(id.toString())) {
      setSavedItems(savedItems.filter((itemId) => itemId !== id.toString()));
      return;
    }
    setSavedItems([...savedItems, id.toString()]);
  }

  return (
    <div
      className={`${
        gridDisplay ? "flex-wrap justify-center" : "flex-nowrap overflow-x-auto"
      } flex gap-[5rem]`}
    >
      {items.map((item: Item) => {
        return (
          <SingleItem
            item={item}
            key={item.id}
            handleSaveItem={toggleSaveItem}
          />
        );
      })}
    </div>
  );
}

export default Items;
