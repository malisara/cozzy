import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useParams: jest.fn(),
}));

require("jest-fetch-mock").enableMocks();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
