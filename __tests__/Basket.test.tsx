import fetchMock from "jest-fetch-mock";
import { expect, describe, it, beforeEach, jest } from "@jest/globals";
import { usePathname } from "next/navigation";
import React, { ReactElement } from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Basket from "@/app/basket/page";
import { GlobalContext, GlobalContextProvider } from "@/context/GlobalContext";
import { BasketItem, Basket as BasketModel } from "@/models/basket";

describe("Basket", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty basket component when user is not athenticated", async () => {
    const mockRouter = {
      back: jest.fn(),
    };

    (usePathname as jest.Mock).mockReturnValue(mockRouter);

    render(
      <GlobalContextProvider>
        <Basket />
      </GlobalContextProvider>
    );
    const heading = await screen.findByText("SHOPPING BAG");
    const valueText = await screen.findByText("Order value");
    const value = await screen.findByText("0 €");
    const sumText = await screen.findByText("Sum");
    const itemImage = screen.queryByRole("image");

    expect(heading).toBeInTheDocument();
    expect(valueText).toBeInTheDocument();
    expect(value).toBeInTheDocument();
    expect(sumText).toBeInTheDocument();
    expect(itemImage).not.toBeInTheDocument();
  });

  it("renders basket items", async () => {
    const mockRouter = {
      back: jest.fn(),
      push: jest.fn(),
    };

    (usePathname as jest.Mock).mockReturnValue(mockRouter);

    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: 1,
        title: "Fjallraven",
        price: 109.95,
        description: "Your perfect pack",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        rating: { rate: 3.9, count: 120 },
      })
    );

    const customRender = (
      ui: ReactElement,
      { providerProps, ...renderOptions }: any
    ) => {
      return render(
        <GlobalContext.Provider {...providerProps}>
          {ui}
        </GlobalContext.Provider>,
        renderOptions
      );
    };

    const basket = new BasketModel(1, 1, new Date(), [new BasketItem(1, 1)]);

    const providerProps = {
      value: { userId: 1, setBasket: jest.fn(), basket: basket },
    };

    customRender(<Basket />, { providerProps });

    const valueText = await screen.findByText("Order value");
    const value = await screen.findByText("109.95 €");
    const sumText = await screen.findByText("Sum");
    const itemImage = screen.getAllByRole("img");

    expect(valueText).toBeInTheDocument();
    expect(value).toBeInTheDocument();
    expect(sumText).toBeInTheDocument();
    expect(itemImage.length).toBe(1);
  });
});
