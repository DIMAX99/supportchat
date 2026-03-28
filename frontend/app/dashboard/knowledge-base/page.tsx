"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function KnowledgeBasePage() {
  const router = useRouter();

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
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-100 text-amber-900 font-semibold">
              <span>📚</span>
              <span>Knowledge Base</span>
            </div>
            <Link href="/dashboard/models" className="flex items-center gap-3 px-4 py-3 rounded-lg text-stone-700 hover:bg-stone-100 transition">
              <span>🤖</span>
              <span>Models</span>
            </Link>
            <Link href="/dashboard/account" className="flex items-center gap-3 px-4 py-3 rounded-lg text-stone-700 hover:bg-stone-100 transition">
              <span>👤</span>
              <span>Account</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-8">
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <h2 className="text-3xl font-bold text-stone-900">📚 Knowledge Base</h2>
            <p className="mt-2 text-stone-600">
              Create and manage documentation for your support team
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <button className="flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-left transition hover:border-amber-300 hover:bg-amber-50">
                <span className="text-xl" aria-hidden="true">📄</span>
                <div>
                  <p className="font-semibold text-stone-900">Upload File</p>
                  <p className="mt-1 text-sm text-stone-600">Import PDFs, docs, or text files.</p>
                </div>
              </button>

              <button className="flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-left transition hover:border-amber-300 hover:bg-amber-50">
                <span className="text-xl" aria-hidden="true">🌐</span>
                <div>
                  <p className="font-semibold text-stone-900">Add Website</p>
                  <p className="mt-1 text-sm text-stone-600">Crawl content directly from a URL.</p>
                </div>
              </button>

              <button className="flex items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-left transition hover:border-amber-300 hover:bg-amber-50">
                <span className="text-xl" aria-hidden="true">✍️</span>
                <div>
                  <p className="font-semibold text-stone-900">Manual Text</p>
                  <p className="mt-1 text-sm text-stone-600">Write or paste custom knowledge manually.</p>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-stone-200 bg-white p-6">
            <p className="text-stone-600">No articles yet. Create your first knowledge base article to get started.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
