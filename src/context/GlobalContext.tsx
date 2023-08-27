"use client";

import { SESSION_TOKEN, USER_ID } from "@/constants";
import { BasketItems } from "@/models/basket";

function returnSessioToken(): string {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(SESSION_TOKEN) || "";
  }
  return "";
}

function getUserToken(): number {
  if (typeof window !== "undefined") {
    Number(sessionStorage.getItem(USER_ID)) || 0;
  }
  return 0;
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
  userToken: string;
  userId: number;
  setUserId: Dispatch<SetStateAction<number>>;
  orderSum: number;
  setOrderSum: Dispatch<SetStateAction<number>>;
  discount: number;
  setDiscount: Dispatch<SetStateAction<number>>;
};

const GlobalContext = createContext<ContextProps>({
  basketItems: new BasketItems(null, null, null, []),
  setBasketItems: (): BasketItems => new BasketItems(null, null, null, []),
  userToken: returnSessioToken(),
  userId: 0,
  setUserId: (): number => 0,
  orderSum: 0,
  setOrderSum: (): number => 0,
  discount: 0,
  setDiscount: (): number => 0,
});

type ContextChildrenProp = {
  children: React.ReactNode;
};
export const GlobalContextProvider = ({ children }: ContextChildrenProp) => {
  const newBasket = new BasketItems(null, null, null, []);
  const [basketItems, setBasketItems] = useState<BasketItems>(newBasket);
  const userToken = returnSessioToken();
  const [userId, setUserId] = useState<number>(getUserToken());
  const [orderSum, setOrderSum] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  return (
    <GlobalContext.Provider
      value={{
        basketItems,
        setBasketItems,
        userToken,
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
