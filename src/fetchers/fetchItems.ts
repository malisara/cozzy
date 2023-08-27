import { BACKEND_API_URL } from "@/constants";
import Item from "@/models/item";
import useSWR from "swr";

class FetchResult<T> {
  constructor(
    public data: T | undefined,
    public error: any,
    public isLoading: boolean
  ) {}
}

export function getItemsById(ids: string[]): FetchResult<Item[]> {
  const { data, error, isLoading } = useSWR({ ids }, () =>
    itemsByIdsFetcher(ids)
  );
  return new FetchResult(data, error, isLoading);
}

export function getItem(id: string): FetchResult<Item> {
  const { data, error, isLoading } = useSWR({ id }, () => itemFetcher(id));
  return new FetchResult(data, error, isLoading);
}

export function getItemsByCategory(
  category: string,
  limit?: number
): FetchResult<Item[]> {
  const { data, error, isLoading } = useSWR({ category, limit }, () =>
    itemsByCategoryFetcher(category, limit)
  );
  return new FetchResult(data, error, isLoading);
}

async function itemsByIdsFetcher(ids: string[]): Promise<Item[]> {
  return Promise.all(ids.map((id) => itemFetcher(id)));
}

async function itemFetcher(id: string): Promise<Item> {
  return await fetch(`${BACKEND_API_URL}/products/${id}`)
    .then((response) => response.json())
    .then((data) => {
      return new Item(
        data.id,
        data.title,
        data.price,
        data.image,
        data.rating.rate,
        data.rating.count,
        data.description
      );
    });
}

async function itemsByCategoryFetcher(
  category: string,
  limit?: number
): Promise<Item[]> {
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
