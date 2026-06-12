import { getWords, getCategories } from "@/lib/db/words";
import Flashcard from "@/components/Flashcard";

export const metadata = {
  title: "フラッシュカード学習 | Spanish Vocab",
};

export default async function LearnPage() {
  const [words, categories] = await Promise.all([getWords(), getCategories()]);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-8 text-center">
          フラッシュカード学習
        </h1>
        <Flashcard words={words} categories={categories} />
      </div>
    </div>
  );
}
