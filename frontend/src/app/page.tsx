import { connection } from "next/server";

import Welcome from "@/components/home/welcome";
import { APP_NAME, HOME_MESSAGE } from "@/lib/constants";

const HomePage = async () => {
  // Render on every request (not once at build time) so Next.js can stamp the
  // per-request CSP nonce from src/proxy.ts on the page's scripts.
  await connection();

  return <Welcome title={APP_NAME} message={HOME_MESSAGE} />;
};

export default HomePage;
