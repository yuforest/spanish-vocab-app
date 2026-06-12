import { getCategories, getWords, getWordsByCategory } from "@/lib/db/words";
import { WordCard } from "@/components/WordCard";
import { CategoryFilter } from "@/components/CategoryFilter";

type WordsPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function WordsPage({ searchParams }: WordsPageProps) {
  const params = await searchParams;
  const categoryId = params.category ? Number(params.category) : undefined;

  const [categories, words] = await Promise.all([
    getCategories(),
    categoryId !== undefined ? getWordsByCategory(categoryId) : getWords(),
  ]);

  const wordsWithCategory = await Promise.all(
    words.map(async (word) => {
      const category = categories.find((c) => c.id === word.categoryId) ?? {
        name: "不明",
      };
      return { ...word, category };
    })
  );

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">単語一覧</h1>
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selectedId={categoryId}
          />
        </div>
        {wordsWithCategory.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            単語が見つかりませんでした。
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wordsWithCategory.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
