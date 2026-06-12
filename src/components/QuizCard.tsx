"use client";

import { useState, useMemo } from "react";
import type { Word } from "@/lib/db/words";
import { generateChoices, type QuizChoice } from "@/lib/quiz";

type Props = {
  words: Word[];
};

const MAX_QUESTIONS = 20;

type AnswerState = "unanswered" | "correct" | "incorrect";

export function QuizCard({ words }: Props) {
  const questions = useMemo(
    () => (words.length <= MAX_QUESTIONS ? words : words.slice(0, MAX_QUESTIONS)),
    [words]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentWord = questions[currentIndex];

  const choices: QuizChoice[] = useMemo(
    () => (currentWord ? generateChoices(currentWord, words) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIndex, currentWord?.id]
  );

  function handleSelect(choice: QuizChoice) {
    if (answerState !== "unanswered") return;
    if (choice.isCorrect) {
      setAnswerState("correct");
      setScore((s) => s + 1);
    } else {
      setAnswerState("incorrect");
    }
  }

  function handleNext() {
    const next = currentIndex + 1;
    if (next >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(next);
      setAnswerState("unanswered");
    }
  }

  if (questions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        単語が登録されていません。
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-6 py-12" data-testid="score-display">
        <h2 className="text-2xl font-bold text-gray-900">クイズ終了！</h2>
        <p className="text-4xl font-bold text-blue-600">
          {questions.length}問中{score}問正解
        </p>
        <button
          className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
          onClick={() => {
            setCurrentIndex(0);
            setAnswerState("unanswered");
            setScore(0);
            setFinished(false);
          }}
        >
          もう一度挑戦する
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-gray-500 text-right">
        {currentIndex + 1} / {questions.length}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        <p className="text-sm text-gray-500 mb-2">スペイン語</p>
        <p className="text-3xl font-bold text-gray-900" data-testid="spanish-word">
          {currentWord.spanish}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {choices.map((choice) => {
          let buttonClass =
            "rounded-lg border-2 px-4 py-3 text-base font-medium transition-colors text-left ";

          if (answerState === "unanswered") {
            buttonClass +=
              "border-gray-200 bg-white text-gray-900 hover:border-blue-400 hover:bg-blue-50";
          } else if (choice.isCorrect) {
            buttonClass +=
              "border-green-500 bg-green-50 text-green-800";
          } else {
            buttonClass +=
              "border-red-400 bg-red-50 text-red-700 opacity-70";
          }

          return (
            <button
              key={choice.id}
              className={buttonClass}
              onClick={() => handleSelect(choice)}
              disabled={answerState !== "unanswered"}
              data-testid={`choice-${choice.id}`}
            >
              {choice.japanese}
            </button>
          );
        })}
      </div>

      {answerState !== "unanswered" && (
        <div className="flex flex-col items-center gap-4">
          <p
            className={
              answerState === "correct"
                ? "text-xl font-bold text-green-600"
                : "text-xl font-bold text-red-600"
            }
            data-testid="feedback"
          >
            {answerState === "correct" ? "正解！" : "不正解..."}
          </p>
          <button
            className="rounded-lg bg-gray-800 px-6 py-2 text-white font-semibold hover:bg-gray-900 transition-colors"
            onClick={handleNext}
          >
            {currentIndex + 1 >= questions.length ? "結果を見る" : "次の問題へ"}
          </button>
        </div>
      )}
    </div>
  );
}
