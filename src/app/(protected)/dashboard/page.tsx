import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getProgressStats } from "@/lib/db/progress";
import { StatsCard } from "@/components/StatsCard";

export const metadata = {
  title: "学習進捗ダッシュボード | Spanish Vocab",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);
  const stats = await getProgressStats(userId);

  const masteryRate =
    stats.total > 0 ? Math.round((stats.known / stats.total) * 100) : 0;
  const unknown = stats.total - stats.known;

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-8">
          学習進捗ダッシュボード
        </h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <StatsCard title="総単語数" value={stats.total} subtitle="学習済み" />
          <StatsCard
            title="習得済み"
            value={stats.known}
            subtitle={`未習得: ${unknown} 単語`}
          />
          <StatsCard
            title="習得率"
            value={`${masteryRate}%`}
            subtitle={`${stats.known} / ${stats.total} 単語`}
          />
        </div>

        {/* Progress bar */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">全体の習得率</p>
            <p className="text-sm font-semibold text-gray-900">{masteryRate}%</p>
          </div>
          <div className="h-4 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${masteryRate}%` }}
              role="progressbar"
              aria-valuenow={masteryRate}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`習得率 ${masteryRate}%`}
            />
          </div>
        </div>

        {/* Category table */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">
              カテゴリ別習得状況
            </h2>
          </div>
          {stats.byCategory.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-500">
              まだ学習データがありません。フラッシュカードやクイズで学習を始めましょう。
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    カテゴリ
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">
                    習得済み
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">
                    総数
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">
                    習得率
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.byCategory.map((cat) => {
                  const rate =
                    cat.total > 0
                      ? Math.round((cat.known / cat.total) * 100)
                      : 0;
                  return (
                    <tr key={cat.categoryId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {cat.categoryName}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700">
                        {cat.known}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700">
                        {cat.total}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-semibold ${
                            rate >= 80
                              ? "text-green-600"
                              : rate >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/learn"
            className="flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-base font-semibold text-white transition-colors hover:bg-blue-700"
          >
            フラッシュカードを始める
          </Link>
          <Link
            href="/quiz"
            className="flex h-12 items-center justify-center rounded-full border border-blue-600 px-8 text-base font-semibold text-blue-600 transition-colors hover:bg-blue-50"
          >
            クイズを始める
          </Link>
        </div>
      </div>
    </div>
  );
}
