import { expect, describe, it, beforeEach, jest } from "@jest/globals";
import { useRouter } from "next/navigation";
import { fireEvent, render, screen } from "@testing-library/react";

import Payment from "@/app/payment/page";
import { GlobalContextProvider } from "@/context/GlobalContext";
import {
  BASKET_SESSION_KEY,
  ORDER_SUM_SESSION_KEY,
  USER_ID_KEY,
} from "@/constants";

const city = "kilcoole";
const street = "new road";
const number = 7682;
const zip = 12926 - 3874;
const email = "john@gmail.com";
const firstname = "john";
const lastname = "doe";
const phone = "1-570-236-7033";

function fetchResonse(): string {
  return JSON.stringify({
    address: {
      geolocation: { lat: "-37.3159", long: "81.1496" },
      city: city,
      street: street,
      number: number,
      zipcode: zip,
    },
    id: 1,
    email: email,
    username: "johnd",
    password: "m38rmF$",
    name: { firstname: firstname, lastname: lastname },
    phone: phone,
    __v: 0,
  });
}

describe("Payment", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("redirects unauthenticated user", () => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <GlobalContextProvider>
        <Payment />
      </GlobalContextProvider>
    );

    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith("/login");
    expect(screen.queryAllByAltText("PAYMENT").length).toBe(0);
  });

  it("redirects authenticated user with empty basket", () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <GlobalContextProvider>
        <Payment />
      </GlobalContextProvider>
    );

    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith("/");
    expect(screen.queryAllByAltText("PAYMENT").length).toBe(0);
  });

  it("renders payment component", async () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(ORDER_SUM_SESSION_KEY, "20");
    fetchMock.mockResponseOnce(fetchResonse());

    render(
      <GlobalContextProvider>
        <Payment />
      </GlobalContextProvider>
    );

    expect(await screen.findByText("PAYMENT")).toBeInTheDocument();

    //Shipping data
    expect(screen.getByText(`Shipping address`)).toBeInTheDocument();
    expect(screen.getByText(`${firstname} ${lastname}`)).toBeInTheDocument();
    expect(screen.getByText(`${street} ${number}`)).toBeInTheDocument();
    expect(screen.getByText(`${zip} ${city}`)).toBeInTheDocument();
    expect(screen.getByText(`${email}`)).toBeInTheDocument();
    expect(screen.getByText(`${phone}`)).toBeInTheDocument();

    //Shippping options:
    expect(screen.getByText(`Shipping options`)).toBeInTheDocument();
    expect(screen.getByText(`4-9 days`)).toBeInTheDocument();
    expect(screen.getByText(`10€`)).toBeInTheDocument(); //default shipping price

    //Payment
    expect(screen.getByTestId("paymentForm")).toBeInTheDocument();

    //Sum
    expect(screen.getByText(`Order value`)).toBeInTheDocument();
    expect(screen.getByText(`20 €`)).toBeInTheDocument();
  });

  it("updates user data", async () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(ORDER_SUM_SESSION_KEY, "20");
    fetchMock.mockResponseOnce(fetchResonse());

    render(
      <GlobalContextProvider>
        <Payment />
      </GlobalContextProvider>
    );

    expect(screen.queryAllByTestId("updateUserForm").length).toBe(0);

    fireEvent.click(screen.getByTestId("editUserBtn"));
    expect(screen.getByTestId("updateUserForm")).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue(firstname), {
      target: { value: "Patrick" },
    });
    fireEvent.submit(screen.getByText("Update data"));
    expect(await screen.findByText(`Patrick ${lastname}`)).toBeInTheDocument();
  });

  it("changes total sum when different shipping option is chosen", () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(ORDER_SUM_SESSION_KEY, "20");
    fetchMock.mockResponseOnce(fetchResonse());

    render(
      <GlobalContextProvider>
        <Payment />
      </GlobalContextProvider>
    );
    expect(screen.queryAllByAltText("15€").length).toBe(0);
    expect(screen.queryAllByAltText("35€").length).toBe(0);

    fireEvent.change(screen.getByTestId("selectPostage"), {
      target: { value: "1-3 days" },
    });
    expect(screen.getByText("15€")).toBeInTheDocument(); //updated shipping value
    expect(screen.getByText("35€")).toBeInTheDocument(); //updated total sum value
  });

  it("handles invalid credit card information", async () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(ORDER_SUM_SESSION_KEY, "20");
    fetchMock.mockResponseOnce(fetchResonse());

    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <GlobalContextProvider>
        <Payment />
      </GlobalContextProvider>
    );

    expect(screen.getByTestId("paymentForm")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Card number"), {
      target: { value: 4111111111111111 },
    });
    fireEvent.change(screen.getByPlaceholderText("Exp.Date (YY/MM)"), {
      target: { value: "24/12" },
    });
    fireEvent.change(screen.getByPlaceholderText("CVV"), {
      target: { value: "wrongCVV" },
    });
    fireEvent.click(screen.getByText("Pay"));
    await screen.findByText("PAYMENT");
    expect(mockRouter.push).not.toBeCalled();
  });

  it("redirects user and deletes session storage data after successful payment", async () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    sessionStorage.setItem(ORDER_SUM_SESSION_KEY, "20");
    fetchMock.mockResponseOnce(fetchResonse());

    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <GlobalContextProvider>
        <Payment />
      </GlobalContextProvider>
    );
    expect(screen.getByTestId("paymentForm")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Card number"), {
      target: { value: 4111111111111111 },
    });
    fireEvent.change(screen.getByPlaceholderText("Exp.Date (YY/MM)"), {
      target: { value: "24/12" },
    });
    fireEvent.change(screen.getByPlaceholderText("CVV"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Pay"));
    await screen.findByText("PAYMENT");

    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith("/successfulPurchase");
    expect(sessionStorage.getItem(ORDER_SUM_SESSION_KEY)).toBe(null);
    expect(sessionStorage.getItem(BASKET_SESSION_KEY)).toBe(null);
  });
});
