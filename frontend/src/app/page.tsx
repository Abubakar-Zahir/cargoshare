import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import islamabad from "@/assets/photos/islamabad.jpg";
import karachi from "@/assets/photos/karachi.jpg";
import lahore from "@/assets/photos/lahore.jpg";
import SiteFooter from "@/components/marketing/site-footer";
import { SIGNUP_PATH } from "@/lib/constants";

export const metadata: Metadata = {
  title: "CargoShare — a little space, a useful journey",
  description:
    "A new way to connect people sending small items with travelers who have room to spare. Explore how CargoShare will work.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CargoShare",
    description: "A little space. A useful journey.",
    url: "/",
    type: "website",
  },
};

const STEPS = [
  [
    "Find a shared route",
    "Travelers post where they’re going, their departure date and the space they can offer.",
  ],
  [
    "Agree on the item",
    "Senders request space. The traveler reviews the item and accepts or declines.",
  ],
  [
    "Meet for the handoff",
    "Once the request is accepted, arrange the handoff and follow the delivery steps.",
  ],
  ["Close the loop", "Confirm the delivery and leave a rating about your experience."],
];

const HomePage = () => (
  <>
    <main id="main-content" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <section className="pt-14 pb-12 sm:pt-24 sm:pb-20" aria-labelledby="landing-title">
        <p className="mb-6 text-xs font-medium tracking-[0.2em] text-accent uppercase">
          Shared routes. Small deliveries.
        </p>
        <h1
          id="landing-title"
          className="max-w-4xl font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl"
        >
          A little space.
          <br />A useful journey.
        </h1>
        <p className="mt-8 max-w-xl text-lg text-ink-muted sm:text-xl">
          Something needs to get there. Someone’s already going. CargoShare brings the two together.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={SIGNUP_PATH}
            className="inline-flex min-h-12 items-center justify-center rounded-control bg-accent px-6 font-medium text-accent-ink no-underline"
          >
            Send something{" "}
            <span aria-hidden="true" className="ml-4">
              ↗
            </span>
          </Link>
          <Link
            href={SIGNUP_PATH}
            className="inline-flex min-h-12 items-center justify-center rounded-control border border-line-strong px-6 font-medium text-ink no-underline"
          >
            Carry something{" "}
            <span aria-hidden="true" className="ml-4">
              ↗
            </span>
          </Link>
        </div>
        <p className="mt-4 text-sm text-ink-muted">
          Create an account today. Trip booking is coming soon.
        </p>
      </section>
      <section
        aria-label="Cities and journeys"
        className="grid grid-cols-3 gap-2 border-t border-line pt-5 sm:gap-5"
      >
        {[
          { city: "Lahore", image: lahore, alt: "Badshahi Mosque in Lahore" },
          { city: "Islamabad", image: islamabad, alt: "Faisal Mosque in Islamabad" },
          { city: "Karachi", image: karachi, alt: "Mazar-e-Quaid in Karachi" },
        ].map(({ city, image, alt }) => (
          <figure key={city}>
            <Image
              src={image}
              alt={alt}
              sizes="(max-width: 1152px) 33vw, 368px"
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="mt-3 text-sm font-medium sm:text-base">{city}</figcaption>
          </figure>
        ))}
      </section>
      <section
        id="how-it-works"
        aria-labelledby="how-title"
        className="mt-16 border-t border-line py-10 sm:mt-24"
      >
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="how-title" className="font-display text-3xl font-semibold sm:text-4xl">
            One route. Four simple steps.
          </h2>
          <p className="text-sm text-ink-muted">The journey we’re building</p>
        </div>
        <ol className="divide-y divide-line">
          {STEPS.map(([title, description], index) => (
            <li key={title} className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr_1.3fr] sm:gap-6">
              <span className="text-sm text-accent">0{index + 1}</span>
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="max-w-xl text-ink-muted">{description}</p>
            </li>
          ))}
        </ol>
      </section>
      <section
        aria-labelledby="price-title"
        className="border-y border-dashed border-line-strong py-10 sm:py-14"
      >
        <p className="text-xs font-medium tracking-widest text-ink-muted uppercase">
          An illustrative journey · not a live listing
        </p>
        <div className="mt-5 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 id="price-title" className="font-display text-3xl font-semibold sm:text-4xl">
              Lahore <span aria-hidden="true">→</span>
              <span className="sr-only">to</span> Islamabad
            </h2>
            <p className="mt-4 max-w-md text-ink-muted">
              A traveler sets a price per kilogram. The item’s weight determines the agreed price.
            </p>
          </div>
          <div className="sm:border-l sm:border-line sm:pl-10">
            <p className="text-2xl font-medium sm:text-3xl">5 kg × Rs 800 = Rs 4,000</p>
            <p className="mt-4 text-sm text-ink-muted">
              Example only. Payment in this project is simulated; no real money moves.
            </p>
          </div>
        </div>
      </section>
      <section aria-labelledby="trust-title" className="py-12 sm:py-20">
        <h2 id="trust-title" className="font-display text-3xl font-semibold sm:text-4xl">
          Clarity at every handoff.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-ink-muted">
          Know the route, agree on the item and understand what happens next. We’re building ID
          checks, delivery confirmations, ratings and a dispute process to support that journey.
        </p>
        <p className="mt-4 max-w-2xl text-sm text-ink-muted">
          These safeguards are planned features, not guarantees of safety or insurance. Never agree
          to carry an item you haven’t inspected.
        </p>
      </section>
      <section aria-labelledby="join-title" className="border-t border-line py-12 sm:py-16">
        <h2 id="join-title" className="max-w-2xl font-display text-3xl font-semibold sm:text-5xl">
          Your next journey could do a little more.
        </h2>
        <Link
          href={SIGNUP_PATH}
          className="mt-7 inline-flex min-h-12 items-center rounded-control bg-accent px-6 font-medium text-accent-ink no-underline"
        >
          Create your account{" "}
          <span aria-hidden="true" className="ml-4">
            ↗
          </span>
        </Link>
      </section>
    </main>
    <SiteFooter />
  </>
);

export default HomePage;
