import Link from "next/link";
const NotFound = () => (
  <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-20">
    <p className="text-sm font-medium text-ink-muted">404 · Page not found</p>
    <h1>That route doesn’t exist.</h1>
    <p>The link may be old, or the address may have a typo.</p>
    <Link href="/" className="inline-flex min-h-12 items-center">
      Back to CargoShare
    </Link>
  </main>
);
export default NotFound;
