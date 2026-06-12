import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatsCard } from "./StatsCard";

describe("StatsCard", () => {
  it("title と value が表示されること", () => {
    render(<StatsCard title="総単語数" value={100} />);
    expect(screen.getByText("総単語数")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("subtitle が渡された場合に表示されること", () => {
    render(<StatsCard title="習得率" value="75%" subtitle="75 / 100 単語" />);
    expect(screen.getByText("75 / 100 単語")).toBeInTheDocument();
  });

  it("subtitle が undefined の場合に表示されないこと", () => {
    const { container } = render(<StatsCard title="総単語数" value={42} />);
    // Only title and value paragraphs, no subtitle
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
  });

  it("value に文字列を渡して表示されること", () => {
    render(<StatsCard title="習得率" value="50%" />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});
