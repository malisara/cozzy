"use client";
import { useEffect, useState } from "react";

import { BACKEND_API_URL, LOCAL_STORAGE_KEY } from "@/constants";
import Item from "@/models/item";
import SingleItem from "../singleItem/SingleItem";
import useSWR from "swr";
import NoItems from "@/components/noItems/NoItems";
import Loading from "@/components/loading/Loading";

async function fetcher(category: string, limit?: number): Promise<Item[]> {
  let apiUrl = `${BACKEND_API_URL}/products/category/${category}`;
  if (limit) {
    apiUrl += `?limit=${limit}`;
  }
  return await fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      return data.map((itemObj: any) => {
        return new Item(
          itemObj.id,
          itemObj.title,
          itemObj.price,
          itemObj.image
        );
      });
    });
}

type Props = {
  gridDisplay: boolean;
  sortPriceDescending: boolean;
  category: string;
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
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const { data, error, isLoading } = useSWR(category, () =>
    fetcher(category, limit)
  );

  useEffect(() => {
    //LS not defined on a window object
    const savedItems = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
    );
    setSavedItems(savedItems);
  }, []);

  useEffect(() => {
    if (data) {
      setItemsToDisplay(sortItems(data));
    }
  }, [data]);

  useEffect(() => {
    const items = [...itemsToDisplay];
    setItemsToDisplay(sortItems(items));
  }, [sortPriceDescending]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedItems));
  }, [savedItems]);

  if (error) return <NoItems />;
  if (isLoading || !data) return <Loading />;

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

  return (
    <div
      className={`${
        gridDisplay ? gridDisplayStyle : lineDisplayStyle
      } flex gap-[5rem]`}
    >
      {itemsToDisplay.map((item: Item) => {
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
