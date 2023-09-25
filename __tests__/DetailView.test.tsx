import fetchMock from "jest-fetch-mock";
import { expect, describe, it, beforeEach, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import DetailView from "@/app/item/[id]/page";
import { BASKET_SESSION_KEY, USER_ID_KEY } from "@/constants";
import { GlobalContextProvider } from "@/context/GlobalContext";
import { useParams, useRouter } from "next/navigation";
import { Basket, BasketItem } from "@/models/basket";

function jsonResponse() {
  return JSON.stringify({
    id: 1,
    title: "Fjallraven",
    price: 109.95,
    description: "Your perfect pack",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    rating: { rate: 3.9, count: 120 },
  });
}

describe("Detail view component", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("renders detail item page", async () => {
    fetchMock.mockResponseOnce(jsonResponse());
    (useParams as jest.Mock).mockReturnValue({ id: 1 });

    render(
      <GlobalContextProvider>
        <DetailView />
      </GlobalContextProvider>
    );

    expect(
      await screen.findByText("Fjallraven".toUpperCase())
    ).toBeInTheDocument();
    expect(screen.getByText("(120)")).toBeInTheDocument(); //review count
    expect(screen.getAllByRole("img").length).toBe(1);
    expect(screen.getByText("Your perfect pack")).toBeInTheDocument();
    expect(screen.getByText("109.95€")).toBeInTheDocument();
    expect(screen.getByTestId("sizesContainer")).toBeInTheDocument();
    expect(screen.getByText("Add to basket")).toBeInTheDocument();
  });

  it("redirects unauthenticated user when he tries to buy an item", () => {
    fetchMock.mockResponseOnce(jsonResponse());
    (useParams as jest.Mock).mockReturnValue({ id: 1 });

    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <GlobalContextProvider>
        <DetailView />
      </GlobalContextProvider>
    );

    fireEvent.click(screen.getByText("Add to basket"));
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("initializes basket", async () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(
      BASKET_SESSION_KEY,
      JSON.stringify(new Basket(null, 1, new Date(), []))
    );

    fetchMock.once(jsonResponse()).once(JSON.stringify({ id: 5 }));
    (useParams as jest.Mock).mockReturnValue(1);

    render(
      <GlobalContextProvider>
        <DetailView />
      </GlobalContextProvider>
    );

    expect(
      JSON.parse(sessionStorage.getItem(BASKET_SESSION_KEY) || "").basketId
    ).toBe(null);
    expect(
      JSON.parse(sessionStorage.getItem(BASKET_SESSION_KEY) || "").items.length
    ).toBe(0);

    fireEvent.click(await screen.findByText("Add to basket"));
    await screen.findByText("Add to basket"); //await for async funtion execution
    expect(
      JSON.parse(sessionStorage.getItem(BASKET_SESSION_KEY) || "").basketId
    ).toBe(5);
    expect(
      JSON.parse(sessionStorage.getItem(BASKET_SESSION_KEY) || "").items.length
    ).toBe(1);
  });

  it("handles updating item quantity", async () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(
      BASKET_SESSION_KEY,
      JSON.stringify(new Basket(1, 1, new Date(), [new BasketItem(1, 1)]))
    );
    fetchMock.mockResponseOnce(jsonResponse());

    (useParams as jest.Mock).mockReturnValue({ id: 1 });

    render(
      <GlobalContextProvider>
        <DetailView />
      </GlobalContextProvider>
    );

    expect(
      JSON.parse(sessionStorage.getItem(BASKET_SESSION_KEY) || "").items.length
    ).toBe(1);

    fireEvent.click(await screen.findByText("Add to basket"));
    expect(await screen.findByTestId("basketPopover")).toBeInTheDocument();
    const ssBasket1 = JSON.parse(
      sessionStorage.getItem(BASKET_SESSION_KEY) || ""
    );
    expect(ssBasket1.items.length).toBe(1);
    expect(ssBasket1.items[0].productId).toBe(1);
    expect(ssBasket1.items[0].quantity).toBe(2);
  });

  it("handles adding new item", async () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(
      BASKET_SESSION_KEY,
      JSON.stringify(new Basket(1, 1, new Date(), [new BasketItem(2, 2)]))
    );
    fetchMock.mockResponseOnce(jsonResponse());

    (useParams as jest.Mock).mockReturnValue({ id: 1 });

    render(
      <GlobalContextProvider>
        <DetailView />
      </GlobalContextProvider>
    );

    expect(
      JSON.parse(sessionStorage.getItem(BASKET_SESSION_KEY) || "").items.length
    ).toBe(1);

    fireEvent.click(await screen.findByText("Add to basket"));
    expect(await screen.findByTestId("basketPopover")).toBeInTheDocument();
    const ssBasket = JSON.parse(
      sessionStorage.getItem(BASKET_SESSION_KEY) || ""
    );
    expect(ssBasket.items.length).toBe(2);
    expect(ssBasket.items[0].productId).toBe(2);
    expect(ssBasket.items[0].quantity).toBe(2);
    expect(ssBasket.items[1].productId).toBe(1);
    expect(ssBasket.items[1].quantity).toBe(1);
  });

  it("handles quantity increase and decrease", async () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(
      BASKET_SESSION_KEY,
      JSON.stringify(new Basket(1, 1, new Date(), []))
    );
    fetchMock.mockResponseOnce(jsonResponse());

    (useParams as jest.Mock).mockReturnValue({ id: 1 });

    render(
      <GlobalContextProvider>
        <DetailView />
      </GlobalContextProvider>
    );

    expect(
      JSON.parse(sessionStorage.getItem(BASKET_SESSION_KEY) || "").items.length
    ).toBe(0);
    // 1 by default + 2
    fireEvent.click(screen.getByTestId("increaseQuantity"));
    fireEvent.click(screen.getByTestId("increaseQuantity"));
    fireEvent.click(screen.getByText("Add to basket"));

    // +1
    fireEvent.click(screen.getByTestId("decreaseQuantity"));
    fireEvent.click(screen.getByTestId("decreaseQuantity"));
    fireEvent.click(screen.getByText("Add to basket"));

    const ssBasket = JSON.parse(
      sessionStorage.getItem(BASKET_SESSION_KEY) || ""
    );
    expect(ssBasket.items.length).toBe(1);
    expect(ssBasket.items[0].quantity).toBe(4);
  });

  it("sizes only available for clothing items", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        id: 2,
        title: "Diamond ring",
        price: 100,
        description: "Looks nice",
        category: "jewelry",
        image: "https://fakestoreapi.com/ring.jpg",
        rating: { rate: 4.9, count: 78 },
      })
    );

    (useParams as jest.Mock).mockReturnValue({ id: 2 });
    render(
      <GlobalContextProvider>
        <DetailView />
      </GlobalContextProvider>
    );

    await screen.findByText("Diamond ring".toUpperCase());
    expect(screen.queryAllByTestId("sizesContainers").length).toBe(0);
  });
});
