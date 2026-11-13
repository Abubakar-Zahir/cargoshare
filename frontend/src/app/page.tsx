import { redirect } from "next/navigation";

import { DASHBOARD_PATH } from "@/components/shell/nav-items";

// PR9 replaces this with the public landing page.
const HomePage = () => redirect(DASHBOARD_PATH);

export default HomePage;
