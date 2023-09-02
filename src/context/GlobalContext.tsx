"use client";

import { BASKET_SESSION_KEY, USER_ID_KEY } from "@/constants";
import { BasketItems } from "@/models/basket";

function getUserId(): number | null {
  if (typeof window !== "undefined") {
    return Number(sessionStorage.getItem(USER_ID_KEY)) || null;
  }
  return null;
}

function getBasket(): BasketItems {
  const savedBasket = JSON.parse(
    sessionStorage.getItem(BASKET_SESSION_KEY) || "null"
  );
  if (savedBasket === null) {
    return new BasketItems(null, getUserId(), null, []);
  }
  return savedBasket;
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
  basketItems: getBasket(),
  setBasketItems: (): BasketItems => getBasket(),
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
  const [basketItems, setBasketItems] = useState<BasketItems>(getBasket());
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
