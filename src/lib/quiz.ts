import type { Word } from "@/lib/db/words";

export type QuizChoice = {
  id: number;
  japanese: string;
  isCorrect: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateChoices(
  correctWord: Word,
  allWords: Word[]
): QuizChoice[] {
  const distractors = allWords.filter((w) => w.id !== correctWord.id);
  const shuffledDistractors = shuffle(distractors).slice(0, 3);

  const choices: QuizChoice[] = [
    { id: correctWord.id, japanese: correctWord.japanese, isCorrect: true },
    ...shuffledDistractors.map((w) => ({
      id: w.id,
      japanese: w.japanese,
      isCorrect: false,
    })),
  ];

  return shuffle(choices);
}
