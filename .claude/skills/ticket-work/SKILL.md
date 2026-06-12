---
name: ticket-work
description: status:ready の GitHub Issue を1件取得し、worktree を作って実装する。「次のチケットやって」と言われたときに使う。
---

## 手順

1. 着工可能な Issue を探す：
   `gh issue list --label "status:ready" --label "ai-task" --json number,title`
   本文に「Blocked by」がある場合、ブロック元が Closed か確認する

2. 排他ロックを取る（最重要・この順番を守る）：
   - `gh issue edit {N} --add-assignee @me --add-label "status:in-progress" --remove-label "status:ready"`
   - 直後に `gh issue view {N} --json assignees` で自分だけが
     assignee であることを確認。他にもいたら手を引いて別 Issue を探す

3. worktree を作る：
   `git worktree add ../spanish-vocab-app-wt-{N} -b feat/issue-{N}-{slug} origin/main`
   以後の作業はすべて `../spanish-vocab-app-wt-{N}` 内で行う

4. Issue の受け入れ条件を満たす実装を行う。条件が曖昧な場合は
   実装前に Issue にコメントで解釈を書き残す

5. 受け入れ条件に対応するテストを書く（既存のテスト規約に従う）

6. 完了したら pr-create スキルに進む
