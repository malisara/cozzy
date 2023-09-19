import "jest-canvas-mock";
import { expect, describe, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import SuccessfulPurchase from "@/app/successfulPurchase/page";

describe("Payment confirmation", () => {
  it("renders payment confirmation page", () => {
    render(<SuccessfulPurchase />);

    expect(screen.getByText("Thank you for your purchase")).toBeInTheDocument();
  });
});
