import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      route: "",
      pathname: "",
      query: "",
      asPath: "",
    };
  },
}));

jest.spyOn(require("next/navigation"), "useRouter");
