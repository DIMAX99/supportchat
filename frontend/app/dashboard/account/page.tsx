"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();

  const user: { email?: string; id?: string } | null = (() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("auth_token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])) as {
        email?: string;
        id?: string;
      };
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto max-w-full px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-stone-900">ResolveAI</h1>
          <button
            onClick={() => {
              localStorage.removeItem("auth_token");
              router.push("/login");
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-stone-200 bg-white min-h-[calc(100vh-65px)]">
          <nav className="p-4 space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-stone-700 hover:bg-stone-100 transition">
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/chats" className="flex items-center gap-3 px-4 py-3 rounded-lg text-stone-700 hover:bg-stone-100 transition">
              <span>💬</span>
              <span>Chats</span>
            </Link>
            <Link href="/dashboard/knowledge-base" className="flex items-center gap-3 px-4 py-3 rounded-lg text-stone-700 hover:bg-stone-100 transition">
              <span>📚</span>
              <span>Knowledge Base</span>
            </Link>
            <Link href="/dashboard/models" className="flex items-center gap-3 px-4 py-3 rounded-lg text-stone-700 hover:bg-stone-100 transition">
              <span>🤖</span>
              <span>Models</span>
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-100 text-amber-900 font-semibold">
              <span>👤</span>
              <span>Account</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-8">
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <h2 className="text-3xl font-bold text-stone-900">👤 Account Settings</h2>
            <p className="mt-2 text-stone-600">
              Manage your account information and preferences
            </p>
          </div>

          <div className="mt-8 rounded-lg border border-stone-200 bg-white p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-stone-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-stone-600">Email</p>
                <p className="text-lg font-medium text-stone-900">{user?.email || "Loading..."}</p>
              </div>
              <div>
                <p className="text-sm text-stone-600">User ID</p>
                <p className="text-lg font-medium text-stone-900 font-mono">{user?.id || "Loading..."}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-stone-200 pt-6">
              <button
                onClick={() => {
                  localStorage.removeItem("auth_token");
                  router.push("/login");
                }}
                className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
