import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NpsAlert } from "./index";

describe("NpsAlert", () => {
  it("renders correctly", () => {
    render(<NpsAlert data-testid="test-alert" />);
    expect(screen.getByTestId("test-alert")).toBeInTheDocument();
  });
});
