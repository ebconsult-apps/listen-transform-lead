import NichePage from "@/components/NichePage";

const ManufacturingChangeManagement = () => (
  <NichePage
    seoTitle="Manufacturing Change Management | Operational Transformation | CLEAR Framework"
    seoDescription="Change management consulting for manufacturing organizations. The CLEAR framework reduces operational downtime during transitions, addresses shop floor resistance, and supports Industry 4.0 digital transformation with people-centered methodology."
    seoPath="/consulting/manufacturing-change-management"
    heroTag="Manufacturing"
    headline="Change Management for Manufacturing"
    subheadline="Reduce operational downtime through systematic, people-centered transformation. The CLEAR framework brings psychology-backed change management to the production environment, where the stakes of getting transformation wrong are measured in lost output and safety incidents."
    challengeTitle="The Manufacturing Challenge"
    challenges={[
      {
        title: "Operational Downtime During Transitions",
        description:
          "Manufacturing cannot afford the luxury of pausing production while people adapt to new ways of working. Every hour of disruption during a transition has a direct financial cost. Yet most change programs are designed for office environments where a temporary dip in productivity is annoying, not catastrophic. Manufacturing needs change management that accounts for continuous operations.",
      },
      {
        title: "Shop Floor Resistance to New Processes",
        description:
          "Operators who have refined their techniques over years are understandably skeptical when management announces a new system. This isn't stubbornness\u2014it's expertise-based caution. But when change programs dismiss this resistance instead of engaging with it, they lose access to the deep process knowledge that operators carry and that no consultant can replicate.",
      },
      {
        title: "Industry 4.0 and Digital Transformation",
        description:
          "Smart manufacturing, IoT integration, predictive maintenance, digital twins\u2014the technology is available, but adoption rates remain disappointing. The bottleneck isn't technology; it's the organizational capacity to absorb technological change while maintaining quality and safety standards. Digital transformation in manufacturing is fundamentally a people problem.",
      },
      {
        title: "Supply Chain Complexity",
        description:
          "Modern manufacturing supply chains are systems of interdependent relationships. A change in one supplier, one process, or one regulation ripples through the entire network. Managing change in this environment requires systems thinking that sees the whole picture, not just the immediate production line.",
      },
    ]}
    solutionTitle="How CLEAR Transforms Manufacturing"
    solutions={[
      {
        title: "Low-Risk Piloting Through Experimentation",
        description:
          "CLEAR's Experimentation phase is designed for environments where failure is expensive. Instead of rolling out changes across all production lines simultaneously, the framework structures controlled pilots on single lines or shifts. This contains risk while generating real production data on whether the change works. Operators participate in designing these pilots, which converts skeptics into collaborators.",
      },
      {
        title: "Systems Mapping Identifies Production Leverage Points",
        description:
          "Manufacturing processes are deeply interconnected\u2014a change in one area creates effects three steps downstream. CLEAR's Leverage phase maps these connections explicitly, involving both engineers and operators in visualizing how the production system actually works (not how the process documentation says it works). This reveals the highest-impact intervention points where small changes create large improvements.",
      },
      {
        title: "Behavioral Design Reduces Operator Resistance",
        description:
          "Rather than fighting resistance with communication campaigns, CLEAR uses behavioral design to make new processes easier and more intuitive than the old ones. Drawing on principles from ergonomics and behavioral economics, interventions are designed so that the desired behavior becomes the path of least resistance. When the new way genuinely works better on the shop floor, adoption follows naturally.",
      },
    ]}
    caseStudy={{
      illustrative: true,
      title: "Worked example: a system rollout the factory floor has already rejected",
      context:
        "A mid-sized manufacturer introducing a new manufacturing execution system after a first rollout failed. Supervisors are openly resistant and operators have built workarounds that bypass the system entirely. The plan on the table is more training and a firmer mandate.",
      approach:
        "Clarify defines the target behaviour precisely: operators logging each production step in the system, on every shift, without a paper shadow copy. Leverage maps the workflow with line supervisors and operators, not only management and IT; that is where the dependencies the first rollout ignored show up, typically around shift hand-overs and exceptions. Experiment tests a redesigned rollout on one line, with the operators' own modifications, before anything else changes.",
      result:
        "Analyse compares the pilot line with the others on system use, workaround frequency and downtime during the transition, using the system's own logs rather than self-report. Refine scales what worked and adapts it to each shift pattern. Resistance falls not because people were persuaded but because the new process became easier than the workaround.",
    }}
    ctaPrimary={{ text: "Book a Free Discovery Call", href: "/book-call" }}
    ctaSecondary={{
      text: "Take the Change Readiness Assessment",
      href: "/assessment",
    }}
    structuredData={{
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Manufacturing Change Management",
      description:
        "Change management consulting for manufacturing organizations using the CLEAR Change Framework to reduce downtime and drive operational transformation.",
      provider: {
        "@type": "ProfessionalService",
        name: "EB Consulting",
        founder: {
          "@type": "Person",
          name: "Erik Bohjort",
          jobTitle: "Licensed Psychologist",
        },
      },
      serviceType: "Manufacturing Change Management",
      url: "https://clear-framework.com/consulting/manufacturing-change-management",
    }}
  />
);

export default ManufacturingChangeManagement;
