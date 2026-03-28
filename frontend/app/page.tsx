import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(150deg,_#fef3c7_0%,_#fde68a_30%,_#fecaca_60%,_#ddd6fe_100%)] px-4 py-10 md:px-8">
      <section className="mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col justify-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-stone-700">
          SupportChat Auth
        </p>
        <h1 className="max-w-2xl text-4xl font-black leading-tight text-stone-900 md:text-6xl">
          Secure Access for ResolveAI Support Teams
        </h1>
        <p className="mt-4 max-w-xl text-base text-stone-700 md:text-lg">
          Start by creating your account or logging in to continue to your dashboard.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-stone-800"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-stone-900 bg-white/75 px-6 py-3 text-sm font-bold text-stone-900 transition hover:bg-white"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
