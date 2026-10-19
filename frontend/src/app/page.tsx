import { connection } from "next/server";

import { APP_NAME } from "@/lib/constants";

const HomePage = async () => {
  // Render on every request (not once at build time) so Next.js can stamp the
  // per-request CSP nonce from src/proxy.ts on the page's scripts.
  await connection();

  return (
    <main>
      <h1>{APP_NAME}</h1>
      <p>The frontend is set up. Features arrive in the next pull requests.</p>
    </main>
  );
};

export default HomePage;
