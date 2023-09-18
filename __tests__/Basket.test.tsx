import fetchMock from "jest-fetch-mock";
import { expect, describe, it, beforeEach, jest } from "@jest/globals";
import { useRouter } from "next/navigation";
import { fireEvent, render, screen } from "@testing-library/react";

import Basket from "@/app/basket/page";
import { BASKET_SESSION_KEY, USER_ID_KEY } from "@/constants";
import { GlobalContextProvider } from "@/context/GlobalContext";
import { BasketItem, Basket as BasketModel } from "@/models/basket";

const fullPrice = "109.95 €";
function setSessionStorageData(): void {
  const basket = new BasketModel(1, 1, new Date(), [new BasketItem(1, 1)]);
  sessionStorage.setItem(BASKET_SESSION_KEY, JSON.stringify(basket));
  sessionStorage.setItem(USER_ID_KEY, "1");
}

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

describe("Basket", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("renders empty basket when user is not authenticated", async () => {
    render(
      <GlobalContextProvider>
        <Basket />
      </GlobalContextProvider>
    );

    expect(await screen.findByText("SHOPPING BAG")).toBeInTheDocument();
    expect(screen.getByText("Order value")).toBeInTheDocument();
    expect(screen.getByText("0 €")).toBeInTheDocument();
    expect(screen.getByText("Sum")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders basket items", async () => {
    setSessionStorageData();
    fetchMock.mockResponseOnce(jsonResponse());

    render(
      <GlobalContextProvider>
        <Basket />
      </GlobalContextProvider>
    );

    expect(await screen.findByText("Order value")).toBeInTheDocument();
    expect(screen.getByText(fullPrice)).toBeInTheDocument();
    expect(screen.getByText("Sum")).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBe(1);
  });

  it("handles invalid discount", () => {
    setSessionStorageData();
    fetchMock.mockResponseOnce(jsonResponse());

    render(
      <GlobalContextProvider>
        <Basket />
      </GlobalContextProvider>
    );

    fireEvent.click(screen.getByText("add a discount"));
    fireEvent.change(screen.getByTestId("discountInput"), {
      target: { value: "fakeDiscount" },
    });
    fireEvent.click(screen.getByText("add"));
    expect(screen.getByText("Invalid code")).toBeInTheDocument();
  });

  it("adds discound and displays discounted value", () => {
    setSessionStorageData();
    fetchMock.mockResponseOnce(jsonResponse());

    render(
      <GlobalContextProvider>
        <Basket />
      </GlobalContextProvider>
    );

    fireEvent.click(screen.getByText("add a discount"));
    fireEvent.change(screen.getByTestId("discountInput"), {
      target: { value: "goodDiscount" },
    });
    fireEvent.click(screen.getByText("add"));
    expect(screen.getByText(fullPrice)).toBeInTheDocument();
    expect(screen.getByText("-20%")).toBeInTheDocument(); //discount in %
    expect(screen.getByText("-21.99€")).toBeInTheDocument(); //discount in €
    expect(screen.getByText("87.96€")).toBeInTheDocument(); //sum with discount
  });

  it("handles item quantity change", () => {
    setSessionStorageData();
    fetchMock.mockResponseOnce(jsonResponse());

    render(
      <GlobalContextProvider>
        <Basket />
      </GlobalContextProvider>
    );

    expect(screen.getByText(fullPrice)).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("selectQuantityChange"), {
      target: { value: 2 },
    });
    expect(screen.queryAllByText(fullPrice).length).toBe(0);
    expect(screen.getByText("219.9 €")).toBeInTheDocument(); //2x price
  });

  it("handles item delete", () => {
    setSessionStorageData();
    fetchMock.mockResponseOnce(jsonResponse());

    render(
      <GlobalContextProvider>
        <Basket />
      </GlobalContextProvider>
    );

    //add disocunt
    fireEvent.click(screen.getByText("add a discount"));
    fireEvent.change(screen.getByTestId("discountInput"), {
      target: { value: "goodDiscount" },
    });
    fireEvent.click(screen.getByText("add"));
    expect(screen.getByText("-20%")).toBeInTheDocument();

    //delete item
    expect(screen.getByText(fullPrice)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("deleteItem"));
    expect(screen.getByText("0 €")).toBeInTheDocument(0);
    expect(screen.queryAllByRole("img").length).toBe(0);
    expect(screen.queryAllByText(fullPrice).length).toBe(0);

    //discount is deleted
    expect(screen.queryAllByText("-20%").length).toBe(0);
  });

  it("redirects user to payment", () => {
    setSessionStorageData();
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    fetchMock.mockResponseOnce(jsonResponse());

    render(
      <GlobalContextProvider>
        <Basket />
      </GlobalContextProvider>
    );

    expect(screen.getByText("Continue with purchase")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Continue with purchase"));
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith("/payment");
  });
});
