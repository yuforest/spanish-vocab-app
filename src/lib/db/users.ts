import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma/client";

const SALT_ROUNDS = 10;

export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name ?? null,
    },
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}
