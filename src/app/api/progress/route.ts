import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { upsertProgress } from "@/lib/db/progress";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).wordId !== "number" ||
    typeof (body as Record<string, unknown>).known !== "boolean"
  ) {
    return NextResponse.json(
      { error: "wordId (number) and known (boolean) are required" },
      { status: 400 }
    );
  }

  const { wordId, known } = body as { wordId: number; known: boolean };

  const progress = await upsertProgress(userId, wordId, known);

  return NextResponse.json(progress, { status: 200 });
}
