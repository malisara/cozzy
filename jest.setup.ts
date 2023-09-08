import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

require("jest-fetch-mock").enableMocks();
