import fetchMock from "jest-fetch-mock";
import { expect, describe, it, jest, beforeEach } from "@jest/globals";
import { usePathname } from "next/navigation";
import { fireEvent, render, screen } from "@testing-library/react";

import Home from "@/app/page";
import { LS_KEY_SAVED_ITEMS } from "@/constants";
import { GlobalContextProvider } from "@/context/GlobalContext";

function jsonResponse() {
  return JSON.stringify([
    {
      id: 5,
      title: "Item 1",
      price: 695,
      description: "test description 1",
      category: "jewelery",
      image: "https://url1",
      rating: { rate: 4.6, count: 400 },
    },
    {
      id: 6,
      title: "Item 2",
      price: 168,
      description: "test description 2",
      category: "jewelery",
      image: "https://url2",
      rating: { rate: 3.9, count: 70 },
    },
  ]);
}

describe("Homepage test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("renders homepage component", async () => {
    fetchMock.mockResponseOnce(jsonResponse());
    (usePathname as jest.Mock).mockReturnValue("");

    render(
      <GlobalContextProvider>
        <Home />
      </GlobalContextProvider>
    );

    //hero
    expect(await screen.findByTestId("heroCarrousel")).toBeInTheDocument();
    expect(
      screen.getByText("Cozzy Up Your Wardrobe Today!")
    ).toBeInTheDocument();

    //categories
    expect(
      screen.getByText("explore our categories".toUpperCase())
    ).toBeInTheDocument();
    expect(screen.getByTestId("categories")).toBeInTheDocument();
    expect(
      screen.getByText("women's clothing".toUpperCase())
    ).toBeInTheDocument();
    expect(
      screen.getByText("men's clothing".toUpperCase())
    ).toBeInTheDocument();
    expect(screen.getByText("jewelery".toUpperCase())).toBeInTheDocument();

    //items
    expect(await screen.findByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBe(6); //2 items + 3 categories + 1 carousel
  });

  it("saves and unsaves items", async () => {
    fetchMock.mockResponseOnce(jsonResponse());
    (usePathname as jest.Mock).mockReturnValue("");

    render(
      <GlobalContextProvider>
        <Home />
      </GlobalContextProvider>
    );

    expect(
      JSON.parse(localStorage.getItem(LS_KEY_SAVED_ITEMS) || "").length
    ).toBe(0);
    const saveBtns = await screen.findAllByTestId("saveItemBtn");

    //save
    fireEvent.click(saveBtns[0]);
    expect(
      JSON.parse(localStorage.getItem(LS_KEY_SAVED_ITEMS) || "").length
    ).toBe(1);

    //unsave
    fireEvent.click(saveBtns[0]);
    expect(
      JSON.parse(localStorage.getItem(LS_KEY_SAVED_ITEMS) || "").length
    ).toBe(0);
  });

  it("sorts items by price", async () => {
    fetchMock.mockResponseOnce(jsonResponse());
    (usePathname as jest.Mock).mockReturnValue("");

    render(
      <GlobalContextProvider>
        <Home />
      </GlobalContextProvider>
    );

    //cheapest items first by default
    const itemImagesBeforeSort = await screen.findAllByTestId("itemImage");
    expect((itemImagesBeforeSort[0] as HTMLImageElement).alt).toBe("Item 2");

    const saveBtns = await screen.findByTestId("sortByPriceBtn");
    fireEvent.click(saveBtns);
    fireEvent.click(screen.getByText("highest price first"));

    const itemImagesAfterSort = await screen.findAllByTestId("itemImage");
    expect((itemImagesAfterSort[0] as HTMLImageElement).alt).toBe("Item 1");
  });
});
