import { prisma } from "@/lib/prisma";
import type { UserWordProgress } from "@/generated/prisma/client";

export type { UserWordProgress };

export async function upsertProgress(
  userId: number,
  wordId: number,
  known: boolean
): Promise<UserWordProgress> {
  return prisma.userWordProgress.upsert({
    where: {
      userId_wordId: { userId, wordId },
    },
    create: { userId, wordId, known },
    update: { known },
  });
}

export async function getUserProgress(
  userId: number
): Promise<UserWordProgress[]> {
  return prisma.userWordProgress.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProgressStats(userId: number): Promise<{
  total: number;
  known: number;
  byCategory: Array<{
    categoryId: number;
    categoryName: string;
    total: number;
    known: number;
  }>;
}> {
  const rows = await prisma.userWordProgress.findMany({
    where: { userId },
    include: {
      word: {
        include: {
          category: true,
        },
      },
    },
  });

  const total = rows.length;
  const known = rows.filter((r) => r.known).length;

  const categoryMap = new Map<
    number,
    { categoryId: number; categoryName: string; total: number; known: number }
  >();

  for (const row of rows) {
    const { id: categoryId, name: categoryName } = row.word.category;
    const entry = categoryMap.get(categoryId) ?? {
      categoryId,
      categoryName,
      total: 0,
      known: 0,
    };
    entry.total += 1;
    if (row.known) entry.known += 1;
    categoryMap.set(categoryId, entry);
  }

  return {
    total,
    known,
    byCategory: Array.from(categoryMap.values()),
  };
}
