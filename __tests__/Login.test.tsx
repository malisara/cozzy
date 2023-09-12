import fetchMock from "jest-fetch-mock";
import { expect, describe, it, beforeEach, jest } from "@jest/globals";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Login from "@/app/login/page";
import { GlobalContext } from "@/context/GlobalContext";

describe("Login", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("renders login component", () => {
    render(<Login />);
    const heading = screen.getByText("Welcome back!");
    const usernameField = screen.getByPlaceholderText("Username");
    const passwordField = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button");

    expect(heading).toBeInTheDocument();
    expect(usernameField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("redirects logged-in user", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
        {
          id: 3,
          userId: 5,
          date: new Date(),
          products: [
            { productId: 1, quantity: 2 },
            { productId: 9, quantity: 1 },
          ],
        },
      ])
    );

    const mockRouter = {
      push: jest.fn(),
      back: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    //Custom context
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

    const providerProps = {
      value: { userId: 1, setBasket: jest.fn() },
    };

    customRender(<Login />, { providerProps });
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
  });
});
