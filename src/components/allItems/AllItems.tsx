"use client";
import { useEffect, useState } from "react";

import { BACKEND_API_URL, LOCAL_STORAGE_KEY } from "@/constants";
import Item from "@/models/item";
import SingleItem from "../singleItem/SingleItem";

type Props = {
  gridDisplay: boolean;
  sortPriceDescending: boolean;
  category?: string;
  limit?: number;
};

function AllItems({
  gridDisplay,
  sortPriceDescending,
  category,
  limit,
}: Props): JSX.Element {
  const lineDisplayStyle = "flex-nowrap overflow-x-auto"; // TODO
  const gridDisplayStyle = "flex-wrap justify-center";
  const [itemsToDisplay, setItemsToDisplay] = useState<Item[]>([]);
  const [savedItems, setSavedItems] = useState<string[]>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]")
  );

  useEffect(() => {
    let apiUrl = `${BACKEND_API_URL}/products`;

    if (category) {
      apiUrl += `/category/${category}`;
    }

    if (limit) {
      apiUrl += `?limit=${limit}`;
    }

    fetch(`${apiUrl}`)
      .then((response) => response.json())
      .then((data) => {
        const items: Item[] = data.map((itemObj: any) => {
          return new Item(
            itemObj.id,
            itemObj.title,
            itemObj.price,
            itemObj.image
          );
        });

        setItemsToDisplay(sortItems(items));
      });
  }, []);

  useEffect(() => {
    const items = [...itemsToDisplay];
    setItemsToDisplay(sortItems(items));
  }, [sortPriceDescending]);

  function sortItems(items: Item[]): Item[] {
    if (sortPriceDescending === true) {
      items.sort((a, b) => b.price - a.price);
    } else {
      items.sort((a, b) => a.price - b.price);
    }
    return items;
  }

  function toggleSaveItem(id: number) {
    if (savedItems.includes(id.toString())) {
      setSavedItems(savedItems.filter((itemId) => itemId !== id.toString()));
    } else {
      setSavedItems([...savedItems, id.toString()]);
    }
  }

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedItems));
  }, [savedItems]);

  return (
    <div
      className={`${
        gridDisplay ? gridDisplayStyle : lineDisplayStyle
      } flex gap-[5rem]`}
    >
      {itemsToDisplay.map((item: any) => {
        return (
          <SingleItem
            item={item}
            key={item.id}
            handleItemSave={toggleSaveItem} //todo naming
            savedItems={savedItems}
          />
        );
      })}
    </div>
  );
}

export default AllItems;
