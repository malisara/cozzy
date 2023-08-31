"use client";

import { BASKET_ID_KEY, BASKET_ITEMS_KEY, USER_ID_KEY } from "@/constants";
import { BasketItem, BasketItems } from "@/models/basket";

function getUserId(): number | null {
  if (typeof window !== "undefined") {
    return Number(sessionStorage.getItem(USER_ID_KEY)) || null;
  }
  return null;
}

function getBasketId(): number | null {
  if (typeof window !== "undefined") {
    return Number(sessionStorage.getItem(BASKET_ID_KEY)) || null;
  }
  return null;
}

function getBasketItems(): BasketItem[] {
  return JSON.parse(sessionStorage.getItem(BASKET_ITEMS_KEY) || "[]");
}

import {
  useContext,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type ContextProps = {
  basketItems: BasketItems;
  setBasketItems: Dispatch<SetStateAction<BasketItems>>;
  userId: number | null;
  setUserId: Dispatch<SetStateAction<number | null>>;
  orderSum: number;
  setOrderSum: Dispatch<SetStateAction<number>>;
  discount: number;
  setDiscount: Dispatch<SetStateAction<number>>;
};

const GlobalContext = createContext<ContextProps>({
  basketItems: new BasketItems(getBasketId(), getUserId(), null, []),
  setBasketItems: (): BasketItems => new BasketItems(null, null, null, []),
  userId: getUserId(),
  setUserId: (): number | null => null,
  orderSum: 0,
  setOrderSum: (): number => 0,
  discount: 0,
  setDiscount: (): number => 0,
});

type ContextChildrenProp = {
  children: React.ReactNode;
};
export const GlobalContextProvider = ({ children }: ContextChildrenProp) => {
  const newBasket = new BasketItems(
    getBasketId(),
    getUserId(),
    null,
    getBasketItems()
  );
  const [basketItems, setBasketItems] = useState<BasketItems>(newBasket);
  const [userId, setUserId] = useState<number | null>(getUserId());
  const [orderSum, setOrderSum] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  return (
    <GlobalContext.Provider
      value={{
        basketItems,
        setBasketItems,
        userId,
        setUserId,
        orderSum,
        setOrderSum,
        discount,
        setDiscount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
