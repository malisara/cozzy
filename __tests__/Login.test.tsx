import fetchMock from "jest-fetch-mock";
import { expect, describe, it, beforeEach, jest } from "@jest/globals";
import { useRouter } from "next/navigation";
import { fireEvent, render, screen } from "@testing-library/react";

import Login from "@/app/login/page";
import { BASKET_SESSION_KEY, USER_ID_KEY } from "@/constants";
import { GlobalContextProvider } from "@/context/GlobalContext";
import { Basket } from "@/models/basket";

function jsonResponse() {
  return JSON.stringify([
    {
      id: 3,
      userId: 1,
      date: new Date(),
      products: [
        { productId: 1, quantity: 2 },
        { productId: 9, quantity: 1 },
      ],
    },
  ]);
}

describe("Login", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("renders login component", () => {
    render(
      <GlobalContextProvider>
        <Login />
      </GlobalContextProvider>
    );

    expect(screen.getByText("Welcome back!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("redirects logged-in user with non-empty basket", () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(BASKET_SESSION_KEY, "1");

    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <GlobalContextProvider>
        <Login />
      </GlobalContextProvider>
    );

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
  });

  it("sets userId to session storage when user logs in", async () => {
    fetchMock.mockResponseOnce(jsonResponse());

    const mockRouter = {
      back: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <GlobalContextProvider>
        <Login />
      </GlobalContextProvider>
    );

    expect(sessionStorage.length).toBe(0);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testPassword" },
    });
    fireEvent.submit(await screen.findByRole("button"));
    await screen.findByText("Welcome back!");
    expect(Number(sessionStorage.getItem(USER_ID_KEY))).toBeGreaterThan(0);
  });

  it("sets basket data to session storage when user is authenticated", async () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    fetchMock.mockResponseOnce(jsonResponse());

    const mockRouter = {
      push: jest.fn(),
      back: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <GlobalContextProvider>
        <Login />
      </GlobalContextProvider>
    );

    expect(sessionStorage.length).toBe(1);
    await screen.findByText("Welcome back!");
    expect(sessionStorage.length).toBe(2);
    expect(mockRouter.back).toHaveBeenCalledTimes(1);

    const basket = JSON.parse(
      sessionStorage.getItem(BASKET_SESSION_KEY) || "[]"
    ) as Basket;

    expect(basket.basketId).toBe(3);
    expect(basket.items).toHaveLength(2);
    expect(Object.keys(basket.items[0])).toHaveLength(2);
  });
});
