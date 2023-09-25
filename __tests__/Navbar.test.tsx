import { beforeEach, expect, describe, it, jest } from "@jest/globals";
import { usePathname } from "next/navigation";
import { fireEvent, render, screen } from "@testing-library/react";

import Navbar from "@/components/Navbar";
import { BASKET_SESSION_KEY, USER_ID_KEY } from "@/constants";
import { GlobalContextProvider } from "@/context/GlobalContext";
import { Basket, BasketItem } from "@/models/basket";

describe("Navbar", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("renders navbar component", () => {
    //jsdom default browser size:  1024 x 768
    (usePathname as jest.Mock).mockReturnValue("");
    render(
      <GlobalContextProvider>
        <Navbar />
      </GlobalContextProvider>
    );

    expect(screen.getByText("COZZY")).toBeInTheDocument();
    expect(screen.queryAllByText("WOMEN").length).toBe(0);
    expect(screen.getByTestId("navbarSavedBtn")).toBeInTheDocument();
    expect(screen.getByTestId("navbarBasketBtn")).toBeInTheDocument();
    expect(screen.getByTestId("navbarLogintBtn")).toBeInTheDocument();
    expect(screen.getByTestId("navbarHamburgerBtn")).toBeInTheDocument();
  });

  it("toggles sidebar", async () => {
    (usePathname as jest.Mock).mockReturnValue("");
    render(<Navbar />);

    fireEvent.click(screen.getByTestId("navbarHamburgerBtn"));
    expect(screen.getByText("WOMEN")).toBeInTheDocument();
    expect(screen.getByText("MEN")).toBeInTheDocument();
    expect(screen.getByText("JEWELRY")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("navbarHamburgerBtn"));
    await screen.findByText("COZZY");
    expect(screen.queryAllByText("WOMEN").length).toBe(0);
    expect(screen.queryAllByText("MEN").length).toBe(0);
    expect(screen.queryAllByText("JEWELRY").length).toBe(0);
  });

  it("displays amount of items in basket", () => {
    const quantity = 5;
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(
      BASKET_SESSION_KEY,
      JSON.stringify(new Basket(1, 1, null, [new BasketItem(5, quantity)]))
    );
    (usePathname as jest.Mock).mockReturnValue("");

    render(
      <GlobalContextProvider>
        <Navbar />
      </GlobalContextProvider>
    );

    expect(screen.getByText(quantity.toString())).toBeInTheDocument();
  });

  it("logs out authenticated user", () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(
      BASKET_SESSION_KEY,
      JSON.stringify(new Basket(1, 1, null, [new BasketItem(5, 1)]))
    );

    (usePathname as jest.Mock).mockReturnValue("");
    render(
      <GlobalContextProvider>
        <Navbar />
      </GlobalContextProvider>
    );

    expect(screen.queryAllByTestId("navbarLoginBtn").length).toBe(0);
    expect(sessionStorage.getItem(USER_ID_KEY)).toBe("1");

    fireEvent.click(screen.getByTestId("navbarLogoutBtn"));
    expect(sessionStorage.getItem(USER_ID_KEY)).toBe(null);
    expect(sessionStorage.getItem(BASKET_SESSION_KEY)).toBe(null);
  });
});
