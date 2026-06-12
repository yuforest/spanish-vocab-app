import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the prisma module
vi.mock("@/lib/prisma", () => ({
  prisma: {
    userWordProgress: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  upsertProgress,
  getUserProgress,
  getProgressStats,
} from "./progress";

const mockProgress = [
  {
    id: 1,
    userId: 1,
    wordId: 1,
    known: true,
    updatedAt: new Date("2024-01-01"),
    word: {
      id: 1,
      spanish: "hola",
      japanese: "こんにちは",
      difficulty: 1,
      categoryId: 1,
      createdAt: new Date("2024-01-01"),
      category: { id: 1, name: "挨拶" },
    },
  },
  {
    id: 2,
    userId: 1,
    wordId: 2,
    known: false,
    updatedAt: new Date("2024-01-02"),
    word: {
      id: 2,
      spanish: "adiós",
      japanese: "さようなら",
      difficulty: 1,
      categoryId: 1,
      createdAt: new Date("2024-01-01"),
      category: { id: 1, name: "挨拶" },
    },
  },
  {
    id: 3,
    userId: 1,
    wordId: 3,
    known: true,
    updatedAt: new Date("2024-01-03"),
    word: {
      id: 3,
      spanish: "manzana",
      japanese: "りんご",
      difficulty: 1,
      categoryId: 2,
      createdAt: new Date("2024-01-01"),
      category: { id: 2, name: "食べ物" },
    },
  },
];

describe("upsertProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call prisma.userWordProgress.upsert with correct args", async () => {
    const expected = { id: 1, userId: 1, wordId: 1, known: true, updatedAt: new Date() };
    vi.mocked(prisma.userWordProgress.upsert).mockResolvedValue(expected);

    const result = await upsertProgress(1, 1, true);

    expect(result).toEqual(expected);
    expect(prisma.userWordProgress.upsert).toHaveBeenCalledWith({
      where: { userId_wordId: { userId: 1, wordId: 1 } },
      create: { userId: 1, wordId: 1, known: true },
      update: { known: true },
    });
  });

  it("should pass known=false when marking as unknown", async () => {
    const expected = { id: 2, userId: 1, wordId: 2, known: false, updatedAt: new Date() };
    vi.mocked(prisma.userWordProgress.upsert).mockResolvedValue(expected);

    await upsertProgress(1, 2, false);

    expect(prisma.userWordProgress.upsert).toHaveBeenCalledWith({
      where: { userId_wordId: { userId: 1, wordId: 2 } },
      create: { userId: 1, wordId: 2, known: false },
      update: { known: false },
    });
  });
});

describe("getUserProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all progress entries for the user", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const flatMock = mockProgress.map(({ word: _w, ...rest }) => rest);
    vi.mocked(prisma.userWordProgress.findMany).mockResolvedValue(
      flatMock as Awaited<ReturnType<typeof prisma.userWordProgress.findMany>>
    );

    const result = await getUserProgress(1);

    expect(result).toEqual(flatMock);
    expect(prisma.userWordProgress.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      orderBy: { updatedAt: "desc" },
    });
  });

  it("should filter by the given userId", async () => {
    vi.mocked(prisma.userWordProgress.findMany).mockResolvedValue([]);

    await getUserProgress(42);

    expect(prisma.userWordProgress.findMany).toHaveBeenCalledWith({
      where: { userId: 42 },
      orderBy: { updatedAt: "desc" },
    });
  });

  it("should return an empty array when no progress exists", async () => {
    vi.mocked(prisma.userWordProgress.findMany).mockResolvedValue([]);

    const result = await getUserProgress(999);

    expect(result).toEqual([]);
  });
});

describe("getProgressStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return correct total and known counts", async () => {
    vi.mocked(prisma.userWordProgress.findMany).mockResolvedValue(
      mockProgress as Awaited<ReturnType<typeof prisma.userWordProgress.findMany>>
    );

    const result = await getProgressStats(1);

    expect(result.total).toBe(3);
    expect(result.known).toBe(2);
  });

  it("should return correct per-category aggregation", async () => {
    vi.mocked(prisma.userWordProgress.findMany).mockResolvedValue(
      mockProgress as Awaited<ReturnType<typeof prisma.userWordProgress.findMany>>
    );

    const result = await getProgressStats(1);

    const greeting = result.byCategory.find((c) => c.categoryId === 1);
    const food = result.byCategory.find((c) => c.categoryId === 2);

    expect(greeting).toEqual({ categoryId: 1, categoryName: "挨拶", total: 2, known: 1 });
    expect(food).toEqual({ categoryId: 2, categoryName: "食べ物", total: 1, known: 1 });
  });

  it("should return empty stats when user has no progress", async () => {
    vi.mocked(prisma.userWordProgress.findMany).mockResolvedValue([]);

    const result = await getProgressStats(1);

    expect(result).toEqual({ total: 0, known: 0, byCategory: [] });
  });

  it("should query with include for word and category", async () => {
    vi.mocked(prisma.userWordProgress.findMany).mockResolvedValue([]);

    await getProgressStats(5);

    expect(prisma.userWordProgress.findMany).toHaveBeenCalledWith({
      where: { userId: 5 },
      include: {
        word: {
          include: {
            category: true,
          },
        },
      },
    });
  });
});
