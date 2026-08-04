"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqGroup {
  title: string;
  items: FaqItem[];
}

const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Program & Eligibility",
    items: [
      {
        q: "How long does the program last?",
        a: "The Venture Readiness Clinic lasts between 2 and 4 weeks depending on the selected track. The Fundraising Accelerator lasts approximately 12 weeks. Including the transition period between both stages, participants should expect a total experience of approximately 18 weeks.",
      },
      {
        q: "What are the current program dates?",
        a: "The current proposed schedule runs from August 31, 2026 through January 4, 2027. Dates may be adjusted based on operational considerations and participant needs.",
      },
      {
        q: "Is the program only for startups already raising capital?",
        a: "No. The program is suitable for founders planning a future raise as well as those actively fundraising.",
      },
      {
        q: "Can venture-backed startups apply?",
        a: "Absolutely. Previously funded startups who already received at least $20k in equity funding from venture capital can be exempted from the Venture Readiness Clinic.",
      },
      {
        q: "What is the InvestoVilla Venture Backability Assessment™ and Venture Backability Report?",
        a: "The InvestoVilla Venture Backability Assessment™ (IVBA) is an independent, expert-led assessment designed to help founders understand how investor-ready their ventures are and identify the areas that matter most for improvement. The findings are compiled into your sharable InvestoVilla Venture Backability Report™ (IVBR). Unlike a static report, the IVBR is designed to evolve. As founders address identified gaps and make progress throughout their fundraising journey, they may request an update in their assessment to reflect improvements in their venture's readiness. Over time, founders may also request and incorporate relevant signals (feedback) from investor engagements, creating a better shared investor intelligence and a richer picture of how the market perceives the opportunity.",
      },
      {
        q: "What happens after the program?",
        a: "The end of the InvestoVilla Pipeline Development Program is intended to mark the beginning of a longer-term relationship with the InvestoVilla ecosystem rather than the end of the journey. Participants who successfully complete the program may be invited to join the broader InvestoVilla founder community. In addition, top-performing participants may be considered for participation in other InvestoVilla initiatives and allied programs, including the InvestoVilla Funds Platform Program and the InvestoVilla Syndicate Program, where applicable. Participation in the program does not guarantee investment, investor introductions, admission into any other InvestoVilla initiative, or access to specific funding opportunities.",
      },
    ],
  },
  {
    title: "Fees & Financial Support",
    items: [
      {
        q: "Is the program free?",
        a: "The Fundraising Accelerator is delivered at no cost. Founders participating in the Venture Readiness Clinic before entering the accelerator are required to pay a Founder Commitment Contribution fee of $299.",
      },
      {
        q: "What Does the Founder Commitment Contribution Fee Cover?",
        a: "The fee covers the Venture Readiness Assessment fee which is a signature and independent offering by InvestoVilla and typically priced at $499. For this program, the standard subsidized pilot fee is $299.",
      },
      {
        q: "Is financial support available?",
        a: "Yes. Founders who apply and onboard well ahead of August 30, 2026 may request need-based fee reduction support. Approved applicants may participate for as little as $119. This is only available on a first-come, first-served basis until all the available slots are filled.",
      },
      {
        q: "Why is there a fee for the Venture Readiness Clinic?",
        a: "The Fundraising Accelerator is delivered entirely free of charge because we believe founders should not have to give up equity or pay significant fees simply to access fundraising support. The Venture Readiness Clinic is also free but different—it includes structured diagnostics, venture reviews, consulting support, personalized feedback, and the InvestoVilla Venture Backability Assessment™ (IVBA). The IVBA is paid for in the form of the Founder Commitment Contribution fee. The commitment fee serves two purposes: first, it helps cover part of the cost of delivering the assessment; second, it acts as a commitment filter. Fundraising is demanding, and experience has shown that founders who invest time, energy, and resources into preparation are more likely to engage fully with the process. This helps us maintain a high-quality founder community and a stronger pipeline for investors. Previously venture-backed startups may be eligible for exemption from parts or all of the Venture Readiness Clinic where prior funding history already provides sufficient validation of venture readiness.",
      },
      {
        q: "Is need-based support guaranteed?",
        a: "No. Support is limited and awarded on a rolling basis. Availability may close before August 30 once allocated slots are filled. Applicants wishing to apply for a fee reduction are advised to apply well ahead of the introductory deadline of August 30, 2026.",
      },
    ],
  },
  {
    title: "Fundraising & Investment",
    items: [
      {
        q: "Why is the program focused on founders raising between US$20,000 and US$1 million?",
        a: "We have intentionally focused the program on founders raising between US$20,000 and US$1 million because this is the range where most of our allied investors, funding partners, syndicates, and capital providers are actively deploying capital. By concentrating on this segment, we are able to provide more relevant fundraising support, stronger investor alignment, and better potential pathways to capital for participants who successfully progress through the program. That said, fundraising needs vary. Founders raising outside this range are still welcome to apply.",
      },
      {
        q: "Is there a guarantee I will raise funding?",
        a: "No. No credible organization can guarantee fundraising outcomes. Our role is to help founders improve readiness, strengthen strategy, avoid mistakes, and engage investors more effectively. Actual fundraising outcomes depend on many factors, including venture quality, execution, market conditions, and founder commitment.",
      },
      {
        q: "Will InvestoVilla invest directly in my startup?",
        a: "No. This program is designed to prepare founders for investment. However, strong-performing startups may receive introductions to investors, syndicates, partner funds, or future InvestoVilla initiatives.",
      },
      {
        q: "What happens if I raise funding during the program?",
        a: "Congratulations. We will continue supporting you through investor discussions, due diligence processes, negotiation preparation, and post-investment planning where appropriate.",
      },
      {
        q: "Is progression from the Venture Readiness Clinic to the Accelerator automatic?",
        a: "No. Participants are expected to meet minimum performance, engagement, and readiness standards before progressing to the Accelerator. This helps maintain the quality of the founder pipeline and ensures a valuable experience for all participants. That said, progression is not designed to be a barrier. Founders who actively participate, complete required assignments, demonstrate coachability, and show meaningful progress throughout the Clinic are highly likely to advance. We are less concerned with where you start and more interested in how far you are willing to go.",
      },
      {
        q: "Do you take equity for participation in the program?",
        a: "No. InvestoVilla does not take equity as a condition of participating in the InvestoVilla Pipeline Development Program for Entrepreneurs (IPDPE). Any funding you raise during or after the program remains subject solely to the terms agreed between you and your investors. Participation in IPDPE does not grant InvestoVilla any ownership interest in your company, nor does it create any obligation for you to participate in any other InvestoVilla program.",
      },
    ],
  },
  {
    title: "Participation & Policies",
    items: [
      {
        q: "Do I retain ownership of my intellectual property (IP) and business materials?",
        a: "Yes. You retain full ownership of your intellectual property, business ideas, products, technologies, trademarks, data, pitch materials, and other proprietary information shared as part of your participation in the program. Participation in IPDPE does not transfer any ownership rights to InvestoVilla, AM-Steve House, mentors, investors, or other participants.",
      },
      {
        q: "Will information about my startup be shared with investors?",
        a: "Only with your consent. A core objective of IPDPE is to help founders become more investor-ready and, where appropriate, facilitate introductions to relevant investors and funding opportunities. However, participation in the program does not entitle participants to investor introductions, deal referrals, or inclusion in any InvestoVilla syndicate, Funds Platform, or allied investment opportunity. Such opportunities may be offered at InvestoVilla's discretion to eligible participants based on readiness, fit, performance, and other relevant considerations. InvestoVilla will not intentionally share confidential business information with third parties without your permission, except where required by law or as otherwise agreed by you.",
      },
      {
        q: "What if I cannot follow the cohort timeline?",
        a: "Contact the program team. In some situations, alternative arrangements may be possible but cannot be guaranteed.",
      },
      {
        q: "How much one-on-one support will I receive?",
        a: "Accepted participants should expect up to two one-on-one consulting or advisory sessions per month during the Accelerator phase, in addition to group coaching, peer learning, reviews, and other program activities.",
      },
      {
        q: "Will participants be monitored?",
        a: "We do not micromanage founders. However, participation standards apply and non-performing participants may be removed from the program.",
      },
      {
        q: "What is the refund policy?",
        a: "Due to the limited and subsidized nature of the need-based support category, participants admitted under the need-based fee reduction category are not eligible for refunds. Participants paying the standard subsidized clinic fee may request: 100% refund up to four (4) weeks before program start, 60% refund up to two (2) weeks before program start. No refunds are available after the clinic begins.",
      },
    ],
  },
];

function Toggle({ open }: { open: boolean }) {
  return (
    <span
      className={`relative mt-1.5 grid h-5 w-5 shrink-0 place-items-center text-emerald transition-transform duration-300 ${open ? "rotate-45" : "group-hover:rotate-90"
        }`}
    >
      <span className="absolute h-[1.5px] w-4 rounded-full bg-current" />
      <span className="absolute h-4 w-[1.5px] rounded-full bg-current" />
    </span>
  );
}

export default function Faq() {
  // Store the active item as a string format of "groupIdx-itemIdx"
  const [openKey, setOpenKey] = useState<string | null>("0-0");

  return (
    <div className="space-y-10">
      {FAQ_GROUPS.map((group, groupIdx) => (
        <div key={groupIdx} className="space-y-4">
          <h3 className="font-display text-2xl font-semibold text-forest-800 border-b border-forest-900/10 pb-2">
            {group.title}
          </h3>
          <div className="border-t border-forest-900/12">
            {group.items.map((item, itemIdx) => {
              const currentKey = `${groupIdx}-${itemIdx}`;
              const isOpen = openKey === currentKey;
              return (
                <div key={itemIdx} className="border-b border-forest-900/12">
                  <button
                    onClick={() => setOpenKey(isOpen ? null : currentKey)}
                    className="group flex w-full items-start gap-4 py-5 text-left sm:gap-6"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`mt-2 font-mono text-xs font-medium tabular-nums transition-colors duration-300 ${isOpen ? "text-emerald" : "text-emerald/55"
                        }`}
                    >
                      {String(itemIdx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 font-display text-lg font-medium leading-snug tracking-tight transition-colors duration-300 sm:text-[1.3rem] ${isOpen ? "text-forest-700" : "text-ink group-hover:text-forest-700"
                        }`}
                    >
                      {item.q}
                    </span>
                    <Toggle open={isOpen} />
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 pl-[1.75rem] pr-8 text-[0.95rem] leading-relaxed text-muted sm:pl-[2.6rem]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
