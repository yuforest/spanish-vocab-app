import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { WordCard } from "./WordCard";

const baseWord = {
  id: 1,
  spanish: "hola",
  japanese: "こんにちは",
  difficulty: 1,
  category: { name: "挨拶" },
};

describe("WordCard", () => {
  it("スペイン語が表示される", () => {
    render(<WordCard word={baseWord} />);
    expect(screen.getByText("hola")).toBeInTheDocument();
  });

  it("日本語訳が表示される", () => {
    render(<WordCard word={baseWord} />);
    expect(screen.getByText("こんにちは")).toBeInTheDocument();
  });

  it("カテゴリ名が表示される", () => {
    render(<WordCard word={baseWord} />);
    expect(screen.getByText("挨拶")).toBeInTheDocument();
  });

  it("difficulty=1 のとき星1つが黄色、2〜3がグレーで表示される", () => {
    render(<WordCard word={{ ...baseWord, difficulty: 1 }} />);
    const stars = screen.getAllByText("★");
    expect(stars).toHaveLength(3);
    expect(stars[0]).toHaveClass("text-yellow-400");
    expect(stars[1]).toHaveClass("text-gray-300");
    expect(stars[2]).toHaveClass("text-gray-300");
  });

  it("difficulty=2 のとき星2つが黄色、3がグレーで表示される", () => {
    render(<WordCard word={{ ...baseWord, difficulty: 2 }} />);
    const stars = screen.getAllByText("★");
    expect(stars[0]).toHaveClass("text-yellow-400");
    expect(stars[1]).toHaveClass("text-yellow-400");
    expect(stars[2]).toHaveClass("text-gray-300");
  });

  it("difficulty=3 のとき星3つすべてが黄色で表示される", () => {
    render(<WordCard word={{ ...baseWord, difficulty: 3 }} />);
    const stars = screen.getAllByText("★");
    expect(stars[0]).toHaveClass("text-yellow-400");
    expect(stars[1]).toHaveClass("text-yellow-400");
    expect(stars[2]).toHaveClass("text-yellow-400");
  });

  it("aria-label で難易度が読み上げられる", () => {
    render(<WordCard word={{ ...baseWord, difficulty: 2 }} />);
    expect(screen.getByLabelText("難易度: 2")).toBeInTheDocument();
  });
});
