import Link from "next/link";
import { APP_NAME, LOGIN_PATH, SIGNUP_PATH } from "@/lib/constants";

const SiteFooter = () => (
  <footer className="mt-16 border-t border-line py-8">
    <div className="w-full px-4 sm:px-8 lg:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-display text-xl font-semibold">{APP_NAME}</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href={SIGNUP_PATH} className="inline-flex min-h-12 items-center">
            Create an account
          </Link>
          <Link href={LOGIN_PATH} className="inline-flex min-h-12 items-center">
            Log in
          </Link>
        </nav>
      </div>
      <p className="mt-4 max-w-xl text-sm text-ink-muted">
        A project in development. Trip booking, identity verification and payment flows are being
        built. Payments will be simulated; no real money moves.
      </p>
      <details className="mt-6 text-xs text-ink-muted">
        <summary className="flex min-h-12 cursor-pointer items-center">Photo credits</summary>
        <ul className="mt-2 space-y-3">
          <li>
            <a href="https://commons.wikimedia.org/wiki/File:Badshahi_Mosque,_Lahore.jpg">
              Lahore: a1245
            </a>{" "}
            · <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>.
          </li>
          <li>
            <a href="https://commons.wikimedia.org/wiki/File:Faisal_Mosque_in_Islamabad.jpg">
              Islamabad: Guilhem Vellut
            </a>{" "}
            · <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>.
          </li>
          <li>
            <a href="https://commons.wikimedia.org/wiki/File:Mazar-e-Quaid.jpg">
              Karachi: Saiffakbar
            </a>{" "}
            · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.
          </li>
        </ul>
        <p className="mt-3">
          Photos resized/compressed and cropped for display. Karachi’s adapted image remains CC
          BY-SA 4.0.
        </p>
      </details>
    </div>
  </footer>
);
export default SiteFooter;
