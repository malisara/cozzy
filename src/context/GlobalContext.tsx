"use client";

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
  setUserToken: Dispatch<SetStateAction<string>>;
};

const GlobalContext = createContext<ContextProps>({
  basketItems: new BasketItems(null, null, null, []),
  setBasketItems: (): BasketItems => new BasketItems(null, null, null, []),
  userToken: "",
  setUserToken: (): [string] => [""],
});

type ContextChildrenProp = {
  children: React.ReactNode;
};
export const GlobalContextProvider = ({ children }: ContextChildrenProp) => {
  const newBasket = new BasketItems(null, null, null, []);
  const [basketItems, setBasketItems] = useState<BasketItems>(newBasket);
  const [userToken, setUserToken] = useState<string>("");
  return (
    <GlobalContext.Provider
      value={{ basketItems, setBasketItems, userToken, setUserToken }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
