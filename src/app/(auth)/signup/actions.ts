"use server";

import { createUser } from "@/lib/db/users";

type SignUpResult = { error: string } | null;

export async function signUpAction(formData: FormData): Promise<SignUpResult> {
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "入力値が不正です" };
  }

  // メール形式バリデーション
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "有効なメールアドレスを入力してください" };
  }

  // パスワード長バリデーション
  if (password.length < 8) {
    return { error: "パスワードは8文字以上で入力してください" };
  }

  const nameValue = typeof name === "string" && name.length > 0 ? name : undefined;

  try {
    await createUser(email, password, nameValue);
    return null;
  } catch (err) {
    // Prismaのユニーク制約エラー
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint failed")
    ) {
      return { error: "このメールアドレスは既に登録されています" };
    }
    console.error("signUpAction error:", err);
    return { error: "アカウント作成に失敗しました。しばらくしてから再試行してください" };
  }
}
