"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Decode token on client-side (safe since it's already signed)
  const user: { email?: string } | null = (() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("auth_token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])) as { email?: string };
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

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Chats", href: "/dashboard/chats", icon: "💬" },
    { name: "Knowledge Base", href: "/dashboard/knowledge-base", icon: "📚" },
    { name: "Models", href: "/dashboard/models", icon: "🤖" },
    { name: "Account", href: "/dashboard/account", icon: "👤" },
  ];

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto max-w-full px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-stone-900">ResolveAI</h1>
          <button
            onClick={handleLogout}
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
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-amber-100 text-amber-900 font-semibold"
                      : "text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info at bottom of sidebar */}
          <div className="absolute bottom-4 left-4 right-4 border-t border-stone-200 pt-4">
            <div className="rounded-lg bg-stone-100 p-3">
              <p className="text-xs text-stone-600">Logged in as</p>
              <p className="text-sm font-semibold text-stone-900 truncate">{user.email}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-8">
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-stone-900">Welcome to Dashboard</h2>
            <p className="mt-2 text-stone-600">
              Select an option from the sidebar to get started.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-stone-200 bg-white p-6 transition hover:shadow-lg hover:border-stone-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="text-lg font-semibold text-stone-900">{item.name}</h3>
                </div>
                <p className="mt-3 text-sm text-stone-600">
                  Manage your {item.name.toLowerCase()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
