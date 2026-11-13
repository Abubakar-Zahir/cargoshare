import type { Profile } from "@/lib/types";

const GetStarted = ({ profile }: Readonly<{ profile: Profile }>) => {
  const roles = [profile.is_sender && "Send items", profile.is_traveler && "Carry items"]
    .filter(Boolean)
    .join(" and ");
  const steps = [
    {
      title: "Choose how you’ll use CargoShare",
      detail: roles || "No role selected.",
      complete: profile.is_sender || profile.is_traveler,
    },
    {
      title: "Verify your identity",
      detail: profile.is_verified
        ? "Your ID has been verified."
        : "ID verification will be available in a later update.",
      complete: profile.is_verified,
    },
    {
      title: profile.is_traveler ? "Post your first trip" : "Find space for your first item",
      detail: profile.is_traveler ? "Trip posting is coming soon." : "Trip search is coming soon.",
      complete: false,
    },
  ];
  return (
    <section
      aria-labelledby="get-started-title"
      className="rounded-2xl border border-line bg-surface p-5 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="get-started-title" className="font-display text-2xl font-semibold">
          Get started
        </h2>
        <p className="text-sm text-ink-muted">
          {steps.filter((step) => step.complete).length} of {steps.length} complete
        </p>
      </div>
      <ol className="mt-5 divide-y divide-line">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <span
              aria-hidden="true"
              className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-sm ${step.complete ? "border-accent bg-accent-soft text-accent" : "border-line-strong text-ink-muted"}`}
            >
              {step.complete ? "✓" : index + 1}
            </span>
            <div className="min-w-0">
              <h3 className="font-medium">
                <span className="sr-only">{step.complete ? "Complete: " : "Pending: "}</span>
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-ink-muted">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
export default GetStarted;
