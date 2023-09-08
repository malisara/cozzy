import fetchMock from "jest-fetch-mock";
import { expect, describe, it, beforeEach, jest } from "@jest/globals";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import Register from "@/app/register/page";
import { GlobalContext } from "@/context/GlobalContext";

const name = "user";
const lastName = "userson";
const username = "testUser";
const email = "mail@mail.com";
const password = "123";
const city = "Nice City";
const street = "Fancy street";
const number = "5";
const zip = "123";
const phone = "000-111-2222";

describe("Register", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("renders register component", () => {
    render(<Register />);
    const heading = screen.getByText(
      "Create an account and join our community today"
    );
    const nameField = screen.getByPlaceholderText("First name");
    const phoneField = screen.getByPlaceholderText("Phone number");
    const submitButton = screen.getByRole("button");

    expect(heading).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(phoneField).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("shows popup after successful registration", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
        {
          id: 11,
        },
      ])
    );

    render(<Register />);

    const nameField = screen.getByPlaceholderText("First name");
    const LastNameField = screen.getByPlaceholderText("Last name");
    const usernameField = screen.getByPlaceholderText("Username");
    const emailField = screen.getByPlaceholderText("Email");
    const passwordField = screen.getByPlaceholderText("Password");
    const passwordConfirmField = screen.getByPlaceholderText(
      "Password confirmation"
    );
    const cityField = screen.getByPlaceholderText("City");
    const streetField = screen.getByPlaceholderText("Street");
    const numberField = screen.getByPlaceholderText("Number");
    const zipField = screen.getByPlaceholderText("Zip-code");
    const phoneField = screen.getByPlaceholderText("Phone number");

    fireEvent.change(nameField, { target: { value: `${name}` } });
    fireEvent.change(LastNameField, { target: { value: `${lastName}` } });
    fireEvent.change(usernameField, { target: { value: `${username}` } });
    fireEvent.change(emailField, { target: { value: `${email}` } });
    fireEvent.change(cityField, { target: { value: `${city}` } });
    fireEvent.change(streetField, { target: { value: `${street}` } });
    fireEvent.change(numberField, { target: { value: `${number}` } });
    fireEvent.change(zipField, { target: { value: `${zip}` } });
    fireEvent.change(phoneField, { target: { value: `${phone}` } });
    fireEvent.change(passwordField, { target: { value: `${password}` } });
    fireEvent.change(passwordConfirmField, {
      target: { value: `${password}` },
    });

    fireEvent.submit(await screen.findByRole("button"));

    const confirmationText = await screen.findByText(
      "Awesome, your account is up and running."
    );

    expect(confirmationText).toBeInTheDocument();
  });

  it("handles unsuccessful registration", async () => {
    render(<Register />);

    const nameField = screen.getByPlaceholderText("First name");
    const LastNameField = screen.getByPlaceholderText("Last name");
    const usernameField = screen.getByPlaceholderText("Username");
    const emailField = screen.getByPlaceholderText("Email");
    const passwordField = screen.getByPlaceholderText("Password");
    const passwordConfirmField = screen.getByPlaceholderText(
      "Password confirmation"
    );
    const cityField = screen.getByPlaceholderText("City");
    const streetField = screen.getByPlaceholderText("Street");
    const numberField = screen.getByPlaceholderText("Number");
    const zipField = screen.getByPlaceholderText("Zip-code");
    const phoneField = screen.getByPlaceholderText("Phone number");

    fireEvent.change(nameField, { target: { value: `${name}` } });
    fireEvent.change(LastNameField, { target: { value: `${lastName}` } });
    fireEvent.change(usernameField, { target: { value: `${username}` } });
    fireEvent.change(emailField, { target: { value: `${email}` } });
    fireEvent.change(cityField, { target: { value: `${city}` } });
    fireEvent.change(streetField, { target: { value: `${street}` } });
    fireEvent.change(numberField, { target: { value: `${number}` } });
    fireEvent.change(zipField, { target: { value: `${zip}` } });
    fireEvent.change(phoneField, { target: { value: `${phone}` } });
    fireEvent.change(passwordField, { target: { value: `wrong password` } });
    fireEvent.change(passwordConfirmField, {
      target: { value: `${password}` },
    });

    fireEvent.submit(await screen.findByRole("button"));

    const confirmationText = screen.queryByText(
      "Awesome, your account is up and running."
    );

    expect(confirmationText).not.toBeInTheDocument();
  });

  it("redirects logged-in user", () => {
    const mockRouter = {
      push: jest.fn(),
      back: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

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
      value: { userId: 1 },
    };

    customRender(<Register />, { providerProps });

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
  });
});
