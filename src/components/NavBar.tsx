import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/words", label: "単語一覧" },
  { href: "/learn", label: "学習" },
  { href: "/quiz", label: "クイズ" },
  { href: "/dashboard", label: "ダッシュボード" },
];

export function NavBar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white dark:bg-zinc-900 dark:border-zinc-700">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-base font-bold text-blue-600 dark:text-blue-400">
            Spanish Vocab
          </span>
          <ul className="flex items-center gap-4">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <SignOutButton className="text-sm font-medium text-gray-600 hover:text-red-600 dark:text-zinc-300 dark:hover:text-red-400 transition-colors" />
      </div>
    </nav>
  );
}
