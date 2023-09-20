import fetchMock from "jest-fetch-mock";
import { expect, describe, it, jest, beforeEach } from "@jest/globals";
import { usePathname } from "next/navigation";
import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

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
  });

  it("renders homepage component", async () => {
    fetchMock.mockResponseOnce(jsonResponse());
    (usePathname as jest.Mock).mockReturnValue("");

    render(<Home />);

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
});
