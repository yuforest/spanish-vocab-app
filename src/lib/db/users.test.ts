import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma before importing users module
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

import { createUser, findUserByEmail } from "./users";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const mockCreate = vi.mocked(prisma.user.create);
const mockFindUnique = vi.mocked(prisma.user.findUnique);
const mockHash = vi.mocked(bcrypt.hash);

describe("createUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("パスワードをハッシュ化してユーザーを作成する", async () => {
    const email = "test@example.com";
    const password = "password123";
    const name = "Test User";
    const hashedPassword = "hashed_password";

    mockHash.mockResolvedValue(hashedPassword as never);
    mockCreate.mockResolvedValue({
      id: 1,
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    });

    const result = await createUser(email, password, name);

    expect(mockHash).toHaveBeenCalledWith(password, 10);
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    expect(result.email).toBe(email);
    expect(result.password).toBe(hashedPassword);
    expect(result.name).toBe(name);
  });

  it("nameを省略した場合はnullで作成する", async () => {
    const email = "noname@example.com";
    const password = "password123";
    const hashedPassword = "hashed_password";

    mockHash.mockResolvedValue(hashedPassword as never);
    mockCreate.mockResolvedValue({
      id: 2,
      email,
      password: hashedPassword,
      name: null,
      createdAt: new Date(),
    });

    const result = await createUser(email, password);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        email,
        password: hashedPassword,
        name: null,
      },
    });
    expect(result.name).toBeNull();
  });
});

describe("findUserByEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("メールアドレスでユーザーを検索して返す", async () => {
    const email = "found@example.com";
    const mockUser = {
      id: 1,
      email,
      password: "hashed_password",
      name: "Found User",
      createdAt: new Date(),
    };

    mockFindUnique.mockResolvedValue(mockUser);

    const result = await findUserByEmail(email);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email },
    });
    expect(result).toEqual(mockUser);
  });

  it("存在しないメールアドレスの場合はnullを返す", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await findUserByEmail("notfound@example.com");

    expect(result).toBeNull();
  });
});
