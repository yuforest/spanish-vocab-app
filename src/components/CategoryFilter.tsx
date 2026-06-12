"use client";

import Link from "next/link";

type Category = {
  id: number;
  name: string;
};

type CategoryFilterProps = {
  categories: Category[];
  selectedId?: number;
};

export function CategoryFilter({ categories, selectedId }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/words"
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          selectedId === undefined
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        すべて
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/words?category=${category.id}`}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedId === category.id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
