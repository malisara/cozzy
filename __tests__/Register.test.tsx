import fetchMock from "jest-fetch-mock";
import { expect, describe, it, beforeEach, jest } from "@jest/globals";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import Register from "@/app/register/page";
import { GlobalContextProvider } from "@/context/GlobalContext";
import { USER_ID_KEY } from "@/constants";

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
    fetchMock.resetMocks();
  });

  it("renders register component", () => {
    render(
      <GlobalContextProvider>
        <Register />
      </GlobalContextProvider>
    );
    expect(
      screen.getByText("Create an account and join our community today")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone number")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("redirects logged-in user", () => {
    sessionStorage.setItem(USER_ID_KEY, "1");
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <GlobalContextProvider>
        <Register />
      </GlobalContextProvider>
    );
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("shows popup after successful registration", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
        {
          id: 11,
        },
      ])
    );

    render(
      <GlobalContextProvider>
        <Register />
      </GlobalContextProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: `${name}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: `${lastName}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: `${username}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: `${email}` },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: `${city}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Street"), {
      target: { value: `${street}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Number"), {
      target: { value: `${number}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Zip-code"), {
      target: { value: `${zip}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: `${phone}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: `${password}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Password confirmation"), {
      target: { value: `${password}` },
    });

    fireEvent.submit(await screen.findByRole("button"));

    expect(
      await screen.findByText("Awesome, your account is up and running.")
    ).toBeInTheDocument();
  });

  it("handles unsuccessful registration", async () => {
    render(
      <GlobalContextProvider>
        <Register />
      </GlobalContextProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: `${name}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: `${lastName}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: `${username}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: `${email}` },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: `${city}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Street"), {
      target: { value: `${street}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Number"), {
      target: { value: `${number}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Zip-code"), {
      target: { value: `${zip}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: `${phone}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: `${password}` },
    });
    fireEvent.change(screen.getByPlaceholderText("Password confirmation"), {
      target: { value: "WrongPassword" },
    });

    fireEvent.submit(await screen.findByRole("button"));

    expect(
      screen.queryByText("Awesome, your account is up and running.")
    ).not.toBeInTheDocument();
  });
});
