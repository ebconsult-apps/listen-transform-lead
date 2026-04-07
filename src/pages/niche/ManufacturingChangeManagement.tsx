import NichePage from "@/components/NichePage";

const BOOKINGS_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

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
      title: "Case Excerpt: Manufacturing SME Reducing Downtime",
      context:
        "A mid-sized manufacturing company producing precision components was implementing a new MES (Manufacturing Execution System) that had already failed one rollout attempt. Production supervisors were openly resistant, and the factory floor had developed workarounds that bypassed the system entirely.",
      approach:
        "Using CLEAR, we began with systems mapping sessions that included line supervisors and operators\u2014not just management and IT. This revealed that the MES implementation had ignored three critical workflow dependencies that made the system impractical for second-shift operations. The Experimentation phase tested a redesigned implementation on a single production line with operator-designed modifications.",
      result:
        "The modified MES implementation achieved 92% operator compliance within six weeks on the pilot line, compared to 35% in the original rollout. Downtime during the transition was reduced by 60%. The approach was then scaled across all production lines with local adaptations for each shift pattern.",
    }}
    ctaPrimary={{ text: "Book a Free Discovery Call", href: BOOKINGS_URL }}
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
