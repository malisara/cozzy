"use client";

import { BASKET_SESSION_KEY, USER_ID_KEY } from "@/constants";
import { Basket } from "@/models/basket";

function getUserId(): number | null {
  if (typeof window !== "undefined") {
    return Number(sessionStorage.getItem(USER_ID_KEY)) || null;
  }
  return null;
}

function getBasket(): Basket {
  if (typeof window !== "undefined") {
    const savedBasket = JSON.parse(
      sessionStorage.getItem(BASKET_SESSION_KEY) || "null"
    );
    if (savedBasket !== null) {
      return savedBasket;
    }
  }
  return new Basket(null, getUserId(), null, []);
}

import {
  useContext,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type ContextProps = {
  basket: Basket;
  setBasket: Dispatch<SetStateAction<Basket>>;
  userId: number | null;
  setUserId: Dispatch<SetStateAction<number | null>>;
  discount: number;
  setDiscount: Dispatch<SetStateAction<number>>;
  itemCategory: string;
  setItemCategory: Dispatch<SetStateAction<string>>;
};

export const GlobalContext = createContext<ContextProps>({
  basket: getBasket(),
  setBasket: (): Basket => getBasket(),
  userId: getUserId(),
  setUserId: (): number | null => null,
  discount: 0,
  setDiscount: (): number => 0,
  itemCategory: "",
  setItemCategory: (): string => "",
});

type ContextChildrenProp = {
  children: React.ReactNode;
};
export const GlobalContextProvider = ({ children }: ContextChildrenProp) => {
  const [basket, setBasket] = useState<Basket>(getBasket());
  const [userId, setUserId] = useState<number | null>(getUserId());
  const [discount, setDiscount] = useState<number>(0);
  const [itemCategory, setItemCategory] = useState<string>("");

  return (
    <GlobalContext.Provider
      value={{
        basket,
        setBasket,
        userId,
        setUserId,
        discount,
        setDiscount,
        itemCategory,
        setItemCategory,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
