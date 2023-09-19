import { expect, describe, it, beforeEach, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders footer component", () => {
    render(<Footer />);

    expect(screen.getByText("copyright © Cozzy 2023")).toBeInTheDocument();
  });
});
