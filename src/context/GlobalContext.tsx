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
};

const GlobalContext = createContext<ContextProps>({
  basketItems: new BasketItems(null, null, null, []),
  setBasketItems: (): BasketItems => new BasketItems(null, null, null, []),
  userToken: sessionStorage.getItem(SESSION_TOKEN) || "",
  userId: 0,
  setUserId: (): number => 0,
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

  return (
    <GlobalContext.Provider
      value={{ basketItems, setBasketItems, userToken, userId, setUserId }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
