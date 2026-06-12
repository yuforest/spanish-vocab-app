@AGENTS.md

# 開発ルール

## スタック
- Next.js 14 (App Router) + TypeScript
- Prisma + SQLite
- NextAuth.js v5
- Tailwind CSS
- Vitest + Testing Library

## コマンド
- パッケージマネージャ: `pnpm` のみ
- lint: `pnpm lint`
- test: `pnpm test`
- DB マイグレーション: `pnpm prisma migrate dev`
- DB シード: `pnpm prisma db seed`

## ブランチ・コミット規約
- ブランチ名: `feat/issue-{番号}-{短い説明}`
- コミット: Conventional Commits 形式（`feat:`, `fix:`, `chore:` など）
- PR 本文には必ず `Closes #{Issue番号}` を含める

## 実装規約
- `any` 型禁止
- Server Component / Client Component の境界を意識する
- API エンドポイントは `src/app/api/` 配下
- DB アクセスは `src/lib/db/` 配下にまとめる
- 認証が必要なページは middleware でガードする

## スコープ管理
- 担当 Issue のスコープ外は触らない
- 気づいた問題は新 Issue として起票するだけにする
