"use client";

import { SESSION_TOKEN, USER_ID } from "@/constants";
import { BasketItems } from "@/models/basket";

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
  userToken: sessionStorage.getItem(SESSION_TOKEN) || "",
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
  const userToken = sessionStorage.getItem(SESSION_TOKEN) || "";
  const [userId, setUserId] = useState<number>(
    Number(sessionStorage.getItem(USER_ID)) || 0
  );
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
