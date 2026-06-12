import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Flashcard from "./Flashcard";
import type { Word, Category } from "@/lib/db/words";

const mockWords: Word[] = [
  {
    id: 1,
    spanish: "hola",
    japanese: "こんにちは",
    difficulty: 1,
    categoryId: 1,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    spanish: "adiós",
    japanese: "さようなら",
    difficulty: 1,
    categoryId: 1,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 3,
    spanish: "manzana",
    japanese: "りんご",
    difficulty: 2,
    categoryId: 2,
    createdAt: new Date("2024-01-01"),
  },
];

const mockCategories: Category[] = [
  { id: 1, name: "挨拶" },
  { id: 2, name: "食べ物" },
];

describe("Flashcard", () => {
  it("初期状態でスペイン語が表示されること", () => {
    render(<Flashcard words={mockWords} categories={mockCategories} />);
    expect(screen.getByText("hola")).toBeInTheDocument();
  });

  it("初期状態でカテゴリ名が表示されること", () => {
    render(<Flashcard words={mockWords} categories={mockCategories} />);
    expect(screen.getByText("挨拶")).toBeInTheDocument();
  });

  it("クリックで日本語が表示されること", () => {
    render(<Flashcard words={mockWords} categories={mockCategories} />);
    const card = screen.getByRole("button", {
      name: "クリックして裏面を見る",
    });
    fireEvent.click(card);
    expect(screen.getByText("こんにちは")).toBeInTheDocument();
  });

  it("「知ってた」クリックで次のカードに進むこと", () => {
    render(<Flashcard words={mockWords} categories={mockCategories} />);

    // Flip to reveal answer
    const card = screen.getByRole("button", {
      name: "クリックして裏面を見る",
    });
    fireEvent.click(card);

    // Click 知ってた
    const knownBtn = screen.getByRole("button", { name: "知ってた" });
    fireEvent.click(knownBtn);

    // Second card should now be shown
    expect(screen.getByText("adiós")).toBeInTheDocument();
  });

  it("「もう一度」クリックで次のカードに進むこと", () => {
    render(<Flashcard words={mockWords} categories={mockCategories} />);

    const card = screen.getByRole("button", {
      name: "クリックして裏面を見る",
    });
    fireEvent.click(card);

    const againBtn = screen.getByRole("button", { name: "もう一度" });
    fireEvent.click(againBtn);

    expect(screen.getByText("adiós")).toBeInTheDocument();
  });

  it("全完了後にサマリが表示されること", () => {
    render(<Flashcard words={mockWords} categories={mockCategories} />);

    // Go through all cards choosing 知ってた
    for (let i = 0; i < mockWords.length; i++) {
      const card = screen.getByRole("button", {
        name: "クリックして裏面を見る",
      });
      fireEvent.click(card);

      const knownBtn = screen.getByRole("button", { name: "知ってた" });
      fireEvent.click(knownBtn);
    }

    expect(screen.getByText("セッション完了！")).toBeInTheDocument();
    expect(screen.getByText("正解数 / 総数")).toBeInTheDocument();
  });

  it("全完了後に正解数が正しく表示されること", () => {
    render(<Flashcard words={mockWords} categories={mockCategories} />);

    const actions = ["known", "known", "again"] as const;

    for (const action of actions) {
      const card = screen.getByRole("button", {
        name: "クリックして裏面を見る",
      });
      fireEvent.click(card);

      if (action === "known") {
        fireEvent.click(screen.getByRole("button", { name: "知ってた" }));
      } else {
        fireEvent.click(screen.getByRole("button", { name: "もう一度" }));
      }
    }

    // 2 known out of 3
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("セッション完了！")).toBeInTheDocument();
  });

  it("単語が空のときに案内メッセージが表示されること", () => {
    render(<Flashcard words={[]} categories={mockCategories} />);
    expect(
      screen.getByText("単語が登録されていません。")
    ).toBeInTheDocument();
  });
});
