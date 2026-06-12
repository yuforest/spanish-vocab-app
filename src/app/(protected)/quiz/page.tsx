import { getWords } from "@/lib/db/words";
import { QuizCard } from "@/components/QuizCard";

export default async function QuizPage() {
  const words = await getWords();

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-8 text-2xl font-bold text-gray-900 text-center">
          クイズモード
        </h1>
        <QuizCard words={words} />
      </div>
    </main>
  );
}
