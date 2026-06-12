"use client";

import { useState, useEffect, useCallback } from "react";
import type { Word, Category } from "@/lib/db/words";
import StudyProgress from "@/components/StudyProgress";

type FlashcardProps = {
  words: Word[];
  categories: Category[];
};

type CardResult = "known" | "again";

export default function Flashcard({ words, categories }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<CardResult[]>([]);
  const [deck, setDeck] = useState<Word[]>(words);
  const [isFinished, setIsFinished] = useState(false);

  const categoryMap: Record<number, string> = {};
  for (const cat of categories) {
    categoryMap[cat.id] = cat.name;
  }

  const currentCard = deck[currentIndex];

  const flip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const advance = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex + 1 >= deck.length) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, deck.length]);

  const handleKnown = useCallback(() => {
    setResults((prev) => [...prev, "known"]);
    advance();
  }, [advance]);

  const handleAgain = useCallback(() => {
    setResults((prev) => [...prev, "again"]);
    advance();
  }, [advance]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isFinished) return;
      if (e.code === "Space") {
        e.preventDefault();
        flip();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFinished, flip]);

  const knownCount = results.filter((r) => r === "known").length;

  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          単語が登録されていません。
        </p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center gap-8 py-10">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          セッション完了！
        </h2>
        <div className="text-6xl font-extrabold text-emerald-500">
          {knownCount}
          <span className="text-2xl font-semibold text-zinc-500 dark:text-zinc-400">
            {" "}
            / {deck.length}
          </span>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          正解数 / 総数
        </p>
        <button
          onClick={() => {
            setDeck(words);
            setCurrentIndex(0);
            setResults([]);
            setIsFlipped(false);
            setIsFinished(false);
          }}
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
        >
          もう一度
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <StudyProgress current={currentIndex} total={deck.length} />

      {/* Card */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={flip}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? "カードを表に戻す" : "クリックして裏面を見る"}
        onKeyDown={(e) => {
          if (e.key === "Enter") flip();
        }}
      >
        <div
          className="relative w-full"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.5s",
            height: "240px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-zinc-800 shadow-md border border-zinc-100 dark:border-zinc-700 p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
              {categoryMap[currentCard.categoryId] ?? ""}
            </span>
            <span className="text-4xl font-bold text-zinc-800 dark:text-zinc-100">
              {currentCard.spanish}
            </span>
            <span className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">
              クリックまたはスペースキーで答えを見る
            </span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 shadow-md border border-emerald-100 dark:border-emerald-800/50 p-8"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-xs uppercase tracking-widest text-emerald-400 dark:text-emerald-500 mb-3">
              日本語訳
            </span>
            <span className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
              {currentCard.japanese}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons (show only when flipped) */}
      <div
        className="flex gap-4 w-full"
        style={{
          opacity: isFlipped ? 1 : 0,
          pointerEvents: isFlipped ? "auto" : "none",
          transition: "opacity 0.2s",
        }}
      >
        <button
          onClick={handleAgain}
          className="flex-1 py-3 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label="もう一度"
        >
          もう一度 ↺
        </button>
        <button
          onClick={handleKnown}
          className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
          aria-label="知ってた"
        >
          知ってた ✓
        </button>
      </div>
    </div>
  );
}
