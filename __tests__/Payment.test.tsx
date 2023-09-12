import { expect, describe, it, beforeEach, jest } from "@jest/globals";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import Payment from "@/app/payment/page";
import { GlobalContext } from "@/context/GlobalContext";
import { Basket, BasketItem } from "@/models/basket";

const city = "kilcoole";
const street = "new road";
const number = 7682;
const zip = 12926 - 3874;
const email = "john@gmail.com";
const firstname = "john";
const lastname = "doe";
const phone = "1-570-236-7033";

const customRender = (
  ui: ReactElement,
  { providerProps, ...renderOptions }: any
) => {
  return render(
    <GlobalContext.Provider {...providerProps}>{ui}</GlobalContext.Provider>,
    renderOptions
  );
};

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

const providerProps = {
  value: {
    userId: 1,
    basket: new Basket(1, 1, new Date(), [new BasketItem(1, 1)]),
  },
};

describe("Register", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("redirects unauthenticated user", () => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    render(<Payment />);

    expect(mockRouter.push).toBeCalledTimes(1);
    expect(screen.queryAllByAltText("PAYMENT").length).toBe(0);
  });

  it("renders payment component", async () => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    fetchMock.mockResponseOnce(fetchResonse());

    customRender(<Payment />, { providerProps });
    expect(mockRouter.push).toBeCalledTimes(1);

    const heading = await screen.findByText("PAYMENT");
    expect(heading).toBeInTheDocument();

    //Shipping data
    expect(await screen.findByText(`Shipping address`)).toBeInTheDocument();
    expect(
      await screen.findByText(`${firstname} ${lastname}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`${street} ${number}`)).toBeInTheDocument();
    expect(screen.getByText(`${zip} ${city}`)).toBeInTheDocument();
    expect(screen.getByText(`${email}`)).toBeInTheDocument();
    expect(screen.getByText(`${phone}`)).toBeInTheDocument();

    //Shippping options:
    expect(screen.getByText(`Shipping options`)).toBeInTheDocument();
    expect(screen.getByText(`4-9 days`)).toBeInTheDocument();
    expect(screen.getByText(`10 €`)).toBeInTheDocument(); //default shipping price

    //Sum
    expect(screen.getByText(`Order value`)).toBeInTheDocument();
    expect(screen.getByText(`0 €`)).toBeInTheDocument(); //sno sum in session storage
  });

  it("updates user data", async () => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    fetchMock.mockResponseOnce(fetchResonse());

    customRender(<Payment />, { providerProps });
    //the form isn't avaibla before clicking on the 'edit' button
    expect(screen.queryAllByTestId("updateUserForm").length).toBe(0);

    fireEvent.click(screen.getByTestId("editUserBtn"));
    expect(screen.getByTestId("updateUserForm")).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue(firstname), {
      target: { value: "Patrick" },
    });
    fireEvent.submit(screen.getByText("Update data"));
    expect(await screen.findByText(`Patrick ${lastname}`)).toBeInTheDocument();
  });

  it("updates shipping price", async () => {
    const mockRouter = {
      push: jest.fn(),
      back: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    fetchMock.mockResponseOnce(fetchResonse());

    customRender(<Payment />, { providerProps });

    fireEvent.change(screen.getByTestId("selectPostage"), {
      target: { value: "1-3 days" },
    });
    expect(screen.getByText("15 €")).toBeInTheDocument();
  });
});
//todo test payment form-render, change, submit
//test payment sum
