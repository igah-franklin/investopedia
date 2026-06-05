"use client";

import { useState } from "react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How long will this program last?",
    a: "The design clinic runs for 4 weeks and the accelerator for 12 weeks. With a 2-week break sandwiched between them, the full journey spans roughly 18 weeks.",
  },
  {
    q: "What are the program dates?",
    a: "Current tentative dates run from Friday, July 31st, 2026 to Friday, December 4th, 2026. Dates, duration and schedule may be adjusted based on realities on the ground. An intensive accelerator track may run for 6 weeks instead of 12 depending on the training-needs assessment and the training lead's discretion.",
  },
  {
    q: "What happens if I raise my round during the business design clinic?",
    a: "You can choose to focus on building your venture, or continue to the accelerator to strategize on your venture-financing plan or your next raise. Raising is not the accelerator's only goal — though it is one of the most important outcomes. If you receive an offer at the clinic stage, we'll coach you through due diligence and negotiations during the accelerator, since prospects that seem certain can still back out at the last minute.",
  },
  {
    q: "Is there a guarantee I raise the funding I'm looking for?",
    a: "No. The program is purely supportive and facilitative. Closing your round depends on your commitment, your follow-through on our guidance, market realities, and the quality of your venture and fundraising strategy. We aim to improve your odds — but the outcome is ultimately yours.",
  },
  {
    q: "Is there a guarantee I get into the accelerator after the design clinic?",
    a: "No. If you're already venture-backed, the clinic is optional. The clinic is designed to prepare you and increase your chances of performing in the accelerator. With an honest, detailed application and genuine commitment, there's a high chance of progressing. Non-performing participants, or those whose model doesn't meet our minimum venture-backability assessment, won't progress — even if they paid for the clinic. Our focus isn't where you start, but how fast we can move you up the ladder.",
  },
  {
    q: "Will the program directly invest in my startup?",
    a: "No. The purpose is to make you more investable to other investors, not to invest in you ourselves. As a pipeline-development program, strong performers may be introduced to allied funds, invited to our upcoming investment syndicate, or put in front of actual investors — all separate, allied benefits from this investment-readiness program.",
  },
  {
    q: "I've been accepted but I need to close immediately — can the timeline flex?",
    a: "We believe a successful raise blends consistency in both process and strategy, and both usually take time. The program may not suit you if you plan to start and finish a raise overnight. That said, if you're already fundraising and can close soon with minimal added support, contact the team to see how we can help your ongoing effort.",
  },
  {
    q: "Why is the design clinic optional for venture-backed startups?",
    a: "Being venture-backed is itself a substantial form of validation, so for already-backed founders we focus more on performance with previous funding rather than re-validating venture design.",
  },
  {
    q: "Will I be monitored during the program?",
    a: "No. Your performance is entirely up to you. We remove non-performing participants at various checkpoints, but it's on you to set your goals, achieve them, and meet the program's minimum requirements at each stage.",
  },
  {
    q: "Why are you charging a fee for the business design clinic?",
    a: "The accelerator is delivered completely free — in line with our mission to reduce the cost of capital for African startups, we don't want to dilute you. The clinic fee covers the cost of those preparatory sessions and serves as a selection filter to ensure only committed, ready founders join. It remains optional for previously venture-backed startups.",
  },
  {
    q: "We're still within the introductory deadline but I can no longer apply for the need-based reduction. Why?",
    a: "The need-based fee reduction is available for up to 50% of the class, accepted on a rolling basis. Availability ends automatically once that threshold is reached or the deadline passes — whichever comes first — except where our team extends it at its discretion.",
  },
  {
    q: "What is your refund policy?",
    a: "Participants on the $108 need-based rate cannot be refunded after payment. Participants on the subsidized $297 rate can request a full refund up to 2 weeks before the course start date, and 50% up to 7 days before. No refund is possible once the design clinic has started — including for absenteeism or no-shows.",
  },
];

function Plus({ open }: { open: boolean }) {
  return (
    <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald/10 transition-colors duration-300 group-hover:bg-emerald/18">
      <span className="absolute h-[2px] w-3.5 rounded-full bg-forest-700" />
      <span
        className={`absolute h-3.5 w-[2px] rounded-full bg-forest-700 transition-transform duration-300 ${
          open ? "rotate-90 scale-0" : ""
        }`}
      />
    </span>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-forest-900/10 overflow-hidden rounded-none border border-forest-900/10 bg-white/60 backdrop-blur">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="group">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-7"
              aria-expanded={isOpen}
            >
              <Plus open={isOpen} />
              <span
                className={`flex-1 font-display text-[1.05rem] font-medium leading-snug transition-colors duration-300 sm:text-lg ${
                  isOpen ? "text-forest-700" : "text-ink"
                }`}
              >
                {item.q}
              </span>
            </button>
            <div
              className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-6 pl-[4.25rem] pr-6 text-[0.97rem] leading-relaxed text-muted sm:px-7 sm:pl-[4.75rem]">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
