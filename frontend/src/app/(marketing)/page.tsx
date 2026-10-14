import Image from "next/image";
import Link from "next/link";
import type * as React from "react";

import { PriceBreakdown } from "@/components/domain/price-breakdown";
import { TicketPass } from "@/components/domain/ticket-pass";
import { Button } from "@/components/ui/button";
import { tripStatus } from "@/lib/status";

import islamabad from "@/assets/photos/islamabad.jpg";
import karachi from "@/assets/photos/karachi.jpg";
import lahore from "@/assets/photos/lahore.jpg";

const steps = [
  {
    title: "Find someone going your way",
    body: "Search trips by city and date. Every trip shows how much space is left and the price per kilo.",
  },
  {
    title: "Ask for space",
    body: "Say what you're sending and how much it weighs. They can accept or decline.",
  },
  {
    title: "Pay once they say yes",
    body: "You only pay after your request is accepted, and the space is kept for you.",
  },
  {
    title: "Hand it over, follow it, rate it",
    body: "Confirm the handoff, see each step until it arrives, then rate each other.",
  },
];

const trust = [
  {
    title: "ID checks",
    body: "An admin checks ID documents before a profile shows as verified.",
  },
  {
    title: "Ratings both ways",
    body: "After every delivery, both people rate each other. You see ratings before you ask.",
  },
  {
    title: "Help when something goes wrong",
    body: "Raise a dispute and an admin looks at what happened and decides.",
  },
  {
    title: "Clear rules",
    body: "No cash, weapons, drugs or anything illegal. Up to 50 kg on any trip.",
  },
];

function Block({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="mx-auto flex max-w-5xl flex-col gap-8 border-t border-line px-4 py-14 sm:px-6 md:py-20"
    >
      <div className="flex max-w-[60ch] flex-col gap-3">
        <h2 id={id} className="font-display text-h1">
          {title}
        </h2>
        {intro !== undefined && (
          <p className="text-lg text-ink-muted">{intro}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function CityPhoto({
  src,
  alt,
  caption,
  sizes,
  priority = false,
  className,
}: {
  src: typeof lahore;
  alt: string;
  caption: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        preload={priority}
        fetchPriority={priority ? "high" : undefined}
        placeholder="blur"
        className="aspect-[3/2] w-full rounded-tile-sm object-cover sm:rounded-tile"
      />
      <figcaption className="mt-2 text-sm text-ink-muted">{caption}</figcaption>
    </figure>
  );
}

function sampleDepartureDate(): string {
  const sixDays = 6 * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + sixDays).toISOString().slice(0, 10);
}

export default function LandingPage() {
  return (
    <>
      <section
        aria-labelledby="hero-title"
        className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pt-12 pb-14 sm:px-6 md:pt-20 md:pb-20"
      >
        <div className="flex max-w-3xl flex-col gap-6">
          <h1
            id="hero-title"
            className="font-display text-display text-balance"
          >
            Send it with someone already going.
          </h1>
          <p className="max-w-[52ch] text-lg text-ink-muted md:text-xl">
            CargoShare connects people who need to send small things with people
            already travelling between Pakistan&apos;s cities. They carry it in
            their spare luggage space, and you pay a fair price per kilo.
          </p>
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            <Button asChild size="lg">
              <Link prefetch={false} href="/signup?intent=send">
                Send something
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link prefetch={false} href="/signup?intent=carry">
                Carry something
              </Link>
            </Button>
          </div>
        </div>
        <CityPhoto
          src={lahore}
          alt="The red sandstone walls and white domes of the Badshahi Mosque in Lahore under a clear sky"
          caption="Badshahi Mosque, Lahore"
          sizes="(min-width: 1024px) 976px, calc(100vw - 2rem)"
          priority
        />
      </section>

      <Block
        id="how-it-works"
        title="How it works"
        intro="Four steps, whether you're sending something or carrying it."
      >
        <ol className="grid gap-x-10 border-t border-line md:grid-cols-2">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-5 border-b border-line py-6"
            >
              <span
                aria-hidden
                className="font-display text-h2 leading-none text-ink-muted"
              >
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-base text-ink-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Block>

      <Block
        id="price"
        title="You see the price before you ask"
        intro="The person carrying it sets a price per kilo. Weight times that price is all you pay."
      >
        <div className="flex flex-col gap-2 border-y border-line py-8">
          <p className="text-base text-ink-muted">For example</p>
          <PriceBreakdown
            weightKg={5}
            ratePerKg={800}
            total={4000}
            className="font-display text-h2"
          />
        </div>
        <div className="max-w-xl">
          <TicketPass
            origin="Lahore"
            destination="Karachi"
            departureDate={sampleDepartureDate()}
            carrierName="Sana"
            carrierVerified
            remainingKg="12.5"
            totalKg={20}
            ratePerKg={800}
            status={tripStatus.active}
          />
          <p className="mt-3 text-sm text-ink-muted">
            A trip, as you&apos;ll see it in search.
          </p>
        </div>
      </Block>

      <Block
        id="cities"
        title="Between the cities you already travel"
        intro="If someone is making the trip anyway, their spare luggage space can carry what you need to send."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <CityPhoto
            src={karachi}
            alt="Glass towers rising over the shoreline at Clifton Beach in Karachi"
            caption="Clifton, Karachi"
            sizes="(min-width: 768px) 480px, calc(100vw - 2rem)"
          />
          <CityPhoto
            src={islamabad}
            alt="The Faisal Mosque and its four tall minarets in front of the Margalla Hills in Islamabad"
            caption="Faisal Mosque, Islamabad"
            sizes="(min-width: 768px) 480px, calc(100vw - 2rem)"
          />
        </div>
      </Block>

      <Block
        id="trust"
        title="Why people trust it"
        intro="You're handing your things to someone you haven't met. Here's what keeps that safe."
      >
        <ul className="grid gap-x-10 border-t border-line md:grid-cols-2">
          {trust.map((item) => (
            <li key={item.title} className="border-b border-line py-6">
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="text-base text-ink-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="choose" title="Which one are you today?">
        <div className="grid border-t border-line md:grid-cols-2 md:divide-x md:divide-line">
          <div className="flex flex-col items-start gap-3 border-b border-line py-8 md:border-b-0 md:pr-10">
            <h3 className="font-display text-h2">Carry something</h3>
            <p className="text-base text-ink-muted">
              Going somewhere anyway? Post your trip and earn from the luggage
              space you weren&apos;t going to use.
            </p>
            <Button asChild variant="secondary">
              <Link prefetch={false} href="/signup?intent=carry">
                Post a trip
              </Link>
            </Button>
          </div>
          <div className="flex flex-col items-start gap-3 py-8 md:pl-10">
            <h3 className="font-display text-h2">Send something</h3>
            <p className="text-base text-ink-muted">
              Need something in another city soon? Find someone already on the
              road and ask them to take it.
            </p>
            <Button asChild variant="secondary">
              <Link prefetch={false} href="/signup?intent=send">
                Find a trip
              </Link>
            </Button>
          </div>
        </div>
      </Block>

      <section
        aria-labelledby="start-title"
        className="mx-auto flex max-w-5xl flex-col items-start gap-5 border-t border-line px-4 py-16 sm:px-6 md:py-24"
      >
        <h2 id="start-title" className="font-display text-display text-balance">
          Ready when you are.
        </h2>
        <p className="max-w-[52ch] text-lg text-ink-muted">
          Sign up with your email. You can send, carry, or both.
        </p>
        <Button asChild variant="secondary" size="lg">
          <Link prefetch={false} href="/signup">
            Create your account
          </Link>
        </Button>
      </section>
    </>
  );
}
