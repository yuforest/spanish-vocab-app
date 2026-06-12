import { prisma } from "@/lib/prisma";
import type { Word, Category } from "@/generated/prisma/client";

export type { Word, Category };

export async function getWords(): Promise<Word[]> {
  return prisma.word.findMany({
    orderBy: { id: "asc" },
  });
}

export async function getWordsByCategory(categoryId: number): Promise<Word[]> {
  return prisma.word.findMany({
    where: { categoryId },
    orderBy: { id: "asc" },
  });
}

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { id: "asc" },
  });
}
