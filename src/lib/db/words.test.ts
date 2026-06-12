import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the prisma module
vi.mock("@/lib/prisma", () => ({
  prisma: {
    word: {
      findMany: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { getWords, getWordsByCategory, getCategories } from "./words";

const mockWords = [
  {
    id: 1,
    spanish: "hola",
    japanese: "こんにちは",
    difficulty: 1,
    categoryId: 1,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    spanish: "adiós",
    japanese: "さようなら",
    difficulty: 1,
    categoryId: 1,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: 3,
    spanish: "manzana",
    japanese: "りんご",
    difficulty: 1,
    categoryId: 2,
    createdAt: new Date("2024-01-01"),
  },
];

const mockCategories = [
  { id: 1, name: "挨拶" },
  { id: 2, name: "食べ物" },
];

describe("getWords", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all words", async () => {
    vi.mocked(prisma.word.findMany).mockResolvedValue(mockWords);

    const result = await getWords();

    expect(result).toEqual(mockWords);
    expect(prisma.word.findMany).toHaveBeenCalledWith({
      orderBy: { id: "asc" },
    });
  });

  it("should return an empty array when no words exist", async () => {
    vi.mocked(prisma.word.findMany).mockResolvedValue([]);

    const result = await getWords();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});

describe("getWordsByCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return words filtered by categoryId", async () => {
    const categoryWords = mockWords.filter((w) => w.categoryId === 1);
    vi.mocked(prisma.word.findMany).mockResolvedValue(categoryWords);

    const result = await getWordsByCategory(1);

    expect(result).toEqual(categoryWords);
    expect(prisma.word.findMany).toHaveBeenCalledWith({
      where: { categoryId: 1 },
      orderBy: { id: "asc" },
    });
  });

  it("should return an empty array when no words exist for the category", async () => {
    vi.mocked(prisma.word.findMany).mockResolvedValue([]);

    const result = await getWordsByCategory(999);

    expect(result).toEqual([]);
    expect(prisma.word.findMany).toHaveBeenCalledWith({
      where: { categoryId: 999 },
      orderBy: { id: "asc" },
    });
  });

  it("should pass the correct categoryId to the query", async () => {
    vi.mocked(prisma.word.findMany).mockResolvedValue([]);

    await getWordsByCategory(3);

    expect(prisma.word.findMany).toHaveBeenCalledWith({
      where: { categoryId: 3 },
      orderBy: { id: "asc" },
    });
  });
});

describe("getCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all categories", async () => {
    vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories);

    const result = await getCategories();

    expect(result).toEqual(mockCategories);
    expect(prisma.category.findMany).toHaveBeenCalledWith({
      orderBy: { id: "asc" },
    });
  });

  it("should return an empty array when no categories exist", async () => {
    vi.mocked(prisma.category.findMany).mockResolvedValue([]);

    const result = await getCategories();

    expect(result).toEqual([]);
  });
});
