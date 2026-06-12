type WordCardProps = {
  word: {
    id: number;
    spanish: string;
    japanese: string;
    difficulty: number;
    category: {
      name: string;
    };
  };
};

function DifficultyStars({ difficulty }: { difficulty: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`難易度: ${difficulty}`}>
      {[1, 2, 3].map((level) => (
        <span
          key={level}
          className={level <= difficulty ? "text-yellow-400" : "text-gray-300"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function WordCard({ word }: WordCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-xl font-bold text-gray-900">{word.spanish}</p>
          <p className="mt-1 text-base text-gray-600">{word.japanese}</p>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 whitespace-nowrap">
          {word.category.name}
        </span>
      </div>
      <div className="mt-3">
        <DifficultyStars difficulty={word.difficulty} />
      </div>
    </div>
  );
}
