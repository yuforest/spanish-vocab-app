import { describe, it, expect } from "vitest";
import { generateChoices } from "./quiz";
import type { Word } from "@/lib/db/words";

function makeWord(id: number, japanese: string): Word {
  return {
    id,
    spanish: `word_${id}`,
    japanese,
    difficulty: 1,
    categoryId: 1,
    createdAt: new Date(),
  };
}

const allWords: Word[] = [
  makeWord(1, "一"),
  makeWord(2, "二"),
  makeWord(3, "三"),
  makeWord(4, "四"),
  makeWord(5, "五"),
];

describe("generateChoices", () => {
  it("4つの選択肢を返すこと", () => {
    const choices = generateChoices(allWords[0], allWords);
    expect(choices).toHaveLength(4);
  });

  it("正解が1つだけ含まれること", () => {
    const choices = generateChoices(allWords[0], allWords);
    const correct = choices.filter((c) => c.isCorrect);
    expect(correct).toHaveLength(1);
    expect(correct[0].id).toBe(allWords[0].id);
    expect(correct[0].japanese).toBe(allWords[0].japanese);
  });

  it("毎回異なる順序になる可能性があること（isCorrect の位置が固定でない）", () => {
    const positions = new Set<number>();
    for (let i = 0; i < 50; i++) {
      const choices = generateChoices(allWords[0], allWords);
      const idx = choices.findIndex((c) => c.isCorrect);
      positions.add(idx);
    }
    // 50回試行して少なくとも2種類の位置が現れることを確認
    expect(positions.size).toBeGreaterThan(1);
  });

  it("allWords が3件未満のエッジケース: 存在する不正解だけで補う", () => {
    const twoWords = [makeWord(10, "十"), makeWord(20, "二十")];
    const choices = generateChoices(twoWords[0], twoWords);
    // 正解1 + 不正解1 = 2件しか作れない
    expect(choices).toHaveLength(2);
    const correct = choices.filter((c) => c.isCorrect);
    expect(correct).toHaveLength(1);
  });

  it("allWords が1件のエッジケース（正解のみ）", () => {
    const oneWord = [makeWord(99, "百")];
    const choices = generateChoices(oneWord[0], oneWord);
    expect(choices).toHaveLength(1);
    expect(choices[0].isCorrect).toBe(true);
  });
});
