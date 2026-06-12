---
name: pr-create
description: 実装完了後に lint・テストを実行し、通ったらPRを作成する。ticket-work の最終工程。
---

## 手順

1. `pnpm lint` を実行。エラーがあれば修正して再実行（最大3回。
   3回で通らなければ Issue にコメントを残して人間にエスカレーション）

2. `pnpm test` を実行。同上

3. 変更をコミットし push する

4. PR を作成：
   `gh pr create --title "{type}: {要約} (#{N})" --body-file -`
   PR 本文に必ず含める：
   - Closes #{N}
   - 変更内容の要約（3行以内）
   - 受け入れ条件のチェックリスト（Issue からコピーし、満たした項目にチェック）
   - テスト結果の要約（実行コマンドと結果）

5. `gh issue edit {N} --add-label "status:review" --remove-label "status:in-progress"`

6. worktree の後片付けはマージ後に行うため、ここでは削除しない

## 禁止事項

- lint/test をスキップして PR を作ること
- `--no-verify` の使用
- テストの期待値を実装に合わせて書き換えて「通す」こと
