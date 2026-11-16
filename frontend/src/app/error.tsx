"use client";
import Link from "next/link";
import Button from "@/components/ui/button";
const ErrorPage = ({ retry }: Readonly<{ retry: () => void }>) => (
  <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-20">
    <h1>We couldn’t load this page.</h1>
    <p>Please try again. If it keeps happening, return to the home page.</p>
    <div className="flex flex-wrap items-center gap-6">
      <Button type="button" onClick={retry}>
        Try again
      </Button>
      <Link href="/">Back to CargoShare</Link>
    </div>
  </main>
);
export default ErrorPage;
