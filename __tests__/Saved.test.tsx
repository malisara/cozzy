import fetchMock from "jest-fetch-mock";
import { expect, describe, it, beforeEach, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import Saved from "@/app/saved/page";
import { LS_KEY_SAVED_ITEMS } from "@/constants";
import { GlobalContextProvider } from "@/context/GlobalContext";

describe("Saved component", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("renders empty saved page when no items are saved", async () => {
    render(
      <GlobalContextProvider>
        <Saved />
      </GlobalContextProvider>
    );

    expect(
      await screen.findByText("saved items".toUpperCase())
    ).toBeInTheDocument();
    expect(
      screen.getByText("You don't have any items saved yet.")
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("img").length).toBe(0);
  });

  it("unsaves item", async () => {
    localStorage.setItem(LS_KEY_SAVED_ITEMS, JSON.stringify(["1"]));

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

    render(
      <GlobalContextProvider>
        <Saved />
      </GlobalContextProvider>
    );

    expect(
      await screen.findByText("saved items".toUpperCase())
    ).toBeInTheDocument();
    expect(
      screen.queryAllByText("You don't have any items saved yet.").length
    ).toBe(0);
    expect(screen.queryAllByRole("img").length).toBe(1);

    //unsave item
    fireEvent.click(screen.getAllByTestId("saveItemBtn")[0]);

    expect(
      JSON.parse(localStorage.getItem(LS_KEY_SAVED_ITEMS) || "").length
    ).toBe(0);
    expect(
      screen.getByText("You don't have any items saved yet.")
    ).toBeInTheDocument(0);
  });
});
