import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QuizCard } from "./QuizCard";
import type { Word } from "@/lib/db/words";

// quiz モジュールをモックして決定論的なテストにする
vi.mock("@/lib/quiz", () => ({
  generateChoices: (correctWord: Word, allWords: Word[]) => {
    const distractors = allWords
      .filter((w) => w.id !== correctWord.id)
      .slice(0, 3);
    return [
      { id: correctWord.id, japanese: correctWord.japanese, isCorrect: true },
      ...distractors.map((w) => ({
        id: w.id,
        japanese: w.japanese,
        isCorrect: false,
      })),
    ];
  },
}));

function makeWord(id: number, spanish: string, japanese: string): Word {
  return {
    id,
    spanish,
    japanese,
    difficulty: 1,
    categoryId: 1,
    createdAt: new Date(),
  };
}

const sampleWords: Word[] = [
  makeWord(1, "hola", "こんにちは"),
  makeWord(2, "gracias", "ありがとう"),
  makeWord(3, "adios", "さようなら"),
  makeWord(4, "buenas", "おはよう"),
];

describe("QuizCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態でスペイン語が表示されること", () => {
    render(<QuizCard words={sampleWords} />);
    expect(screen.getByTestId("spanish-word")).toHaveTextContent("hola");
  });

  it("選択肢が4つ表示されること", () => {
    render(<QuizCard words={sampleWords} />);
    const buttons = screen.getAllByRole("button");
    // 4択ボタンのみカウント（次へボタンはまだ表示されていない）
    const choiceButtons = buttons.filter(
      (b) => !b.textContent?.includes("次の問題へ") && !b.textContent?.includes("結果を見る")
    );
    expect(choiceButtons).toHaveLength(4);
  });

  it("正解選択で緑のフィードバックが表示されること", () => {
    render(<QuizCard words={sampleWords} />);
    // 正解は「こんにちは」
    fireEvent.click(screen.getByText("こんにちは"));
    const feedback = screen.getByTestId("feedback");
    expect(feedback).toHaveTextContent("正解！");
    expect(feedback).toHaveClass("text-green-600");
  });

  it("不正解選択で赤のフィードバックが表示されること", () => {
    render(<QuizCard words={sampleWords} />);
    // 不正解は「ありがとう」
    fireEvent.click(screen.getByText("ありがとう"));
    const feedback = screen.getByTestId("feedback");
    expect(feedback).toHaveTextContent("不正解");
    expect(feedback).toHaveClass("text-red-600");
  });

  it("全問終了後にスコアが表示されること", () => {
    render(<QuizCard words={sampleWords} />);

    // 4問を全て正解で答える
    for (let i = 0; i < sampleWords.length; i++) {
      // 正解ボタン（isCorrect=true のもの）をクリック
      const correctText = sampleWords[i].japanese;
      fireEvent.click(screen.getByText(correctText));

      const nextBtn = screen.queryByText("次の問題へ") ?? screen.queryByText("結果を見る");
      if (nextBtn) fireEvent.click(nextBtn);
    }

    expect(screen.getByTestId("score-display")).toBeInTheDocument();
    expect(screen.getByTestId("score-display")).toHaveTextContent("4問中4問正解");
  });
});
