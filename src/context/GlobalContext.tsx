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
  const emptyBasket = new Basket(null, getUserId(), null, []);
  if (typeof window !== "undefined") {
    const savedBasket = JSON.parse(
      sessionStorage.getItem(BASKET_SESSION_KEY) || "null"
    );
    if (savedBasket === null) {
      return emptyBasket;
    }
  }
  return emptyBasket;
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
};

const GlobalContext = createContext<ContextProps>({
  basket: getBasket(),
  setBasket: (): Basket => getBasket(),
  userId: getUserId(),
  setUserId: (): number | null => null,
  discount: 0,
  setDiscount: (): number => 0,
});

type ContextChildrenProp = {
  children: React.ReactNode;
};
export const GlobalContextProvider = ({ children }: ContextChildrenProp) => {
  const [basket, setBasket] = useState<Basket>(getBasket());
  const [userId, setUserId] = useState<number | null>(getUserId());
  const [discount, setDiscount] = useState<number>(0);

  return (
    <GlobalContext.Provider
      value={{
        basket,
        setBasket,
        userId,
        setUserId,
        discount,
        setDiscount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
