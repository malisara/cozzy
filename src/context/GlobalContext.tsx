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
};

const GlobalContext = createContext<ContextProps>({
  basketItems: new BasketItems(null, null, []),
  setBasketItems: (): BasketItems => new BasketItems(null, null, []),
});

type ContextChildrenProp = {
  children: React.ReactNode;
};
export const GlobalContextProvider = ({ children }: ContextChildrenProp) => {
  const newBasket = new BasketItems(null, null, []);
  const [basketItems, setBasketItems] = useState<BasketItems>(newBasket);

  return (
    <GlobalContext.Provider value={{ basketItems, setBasketItems }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
