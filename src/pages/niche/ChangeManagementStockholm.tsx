import NichePage from "@/components/NichePage";

const BOOKINGS_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const ChangeManagementStockholm = () => (
  <NichePage
    seoTitle="Change Management Consultant Stockholm | CLEAR Change Framework"
    seoDescription="Psychology-backed change management consulting in Stockholm and the Nordics. The CLEAR framework brings evidence-based organizational transformation tailored to Nordic consensus culture, scaling startups, and international workforce integration."
    seoPath="/consulting/change-management-stockholm"
    heroTag="Stockholm & Nordics"
    headline="Change Management Consulting in Stockholm"
    subheadline="Psychology-backed organizational transformation for Nordic businesses. The CLEAR framework aligns with Scandinavian leadership values while delivering measurable, lasting change across your organization."
    challengeTitle="The Stockholm Challenge"
    challenges={[
      {
        title: "Consensus Culture Slows Change",
        description:
          "Nordic organizations value consensus and inclusion in decision-making. While this produces better long-term outcomes, it can stall transformation when urgency is high. Traditional top-down change models fail here because they violate deeply held cultural norms around participation and fairness.",
      },
      {
        title: "Scaling Startups in the Tech Hub",
        description:
          "Stockholm's tech ecosystem produces some of Europe's most ambitious startups, but rapid scaling creates organizational growing pains. Structures that worked for 30 people break down at 150. Culture fragments, communication bottlenecks appear, and founding values erode without deliberate change management.",
      },
      {
        title: "International Workforce Integration",
        description:
          "Stockholm attracts global talent, creating diverse teams with different expectations around hierarchy, feedback, and collaboration. Integrating international employees into Swedish work culture requires more than onboarding documents\u2014it requires deliberate behavioral design.",
      },
      {
        title: "Sustainability Mandates and Operational Reality",
        description:
          "Nordic businesses face accelerating sustainability requirements from regulators, investors, and consumers. Translating ambitious ESG commitments into operational changes across departments demands systematic transformation, not just updated policies.",
      },
    ]}
    solutionTitle="How CLEAR Fits the Nordic Context"
    solutions={[
      {
        title: "Built for Consensus Culture",
        description:
          "CLEAR's Clarity phase begins with collaborative objective-setting that naturally aligns with Nordic decision-making norms. Rather than imposing change from above, the framework structures inclusive workshops where stakeholders co-create the definition of success. This isn't just culturally appropriate\u2014it produces better change outcomes because people commit to what they helped design.",
      },
      {
        title: "Systems Mapping for Interconnected Ecosystems",
        description:
          "Stockholm's tech scene thrives on interconnection\u2014between companies, investors, talent pools, and institutions. CLEAR's Leverage phase uses systems mapping to visualize these dynamics within your organization, identifying where small interventions create outsized impact. This is especially powerful for scaling companies where informal networks carry more influence than org charts.",
      },
      {
        title: "Evidence-Based Change Reduces Resistance",
        description:
          "Scandinavian professionals expect data and reasoning, not management rhetoric. CLEAR's Experimentation and Analysis phases deliver exactly that: rapid prototyping of changes, structured measurement of outcomes, and transparent sharing of results. When people can see the evidence, resistance transforms into engagement.",
      },
    ]}
    caseStudy={{
      title: "Case Excerpt: Stockholm SaaS Scaleup",
      context:
        "A Stockholm-based B2B SaaS company had grown from 40 to 180 employees in 18 months. Cross-team collaboration had broken down, engineering and product teams operated in silos, and the founding culture of openness was being replaced by departmental politics.",
      approach:
        "Using CLEAR, we facilitated a systems-mapping exercise with representatives from every team, making the invisible communication patterns visible. The Experimentation phase tested three structural interventions simultaneously: cross-functional squads, shared OKRs, and weekly demo sessions.",
      result:
        "Within one quarter, cross-team collaboration scores improved by 40%, and the cycle time from idea to shipped feature dropped by 30%. The approach succeeded because it was co-designed by the people affected, not imposed from leadership.",
    }}
    ctaPrimary={{ text: "Book a Free Discovery Call", href: BOOKINGS_URL }}
    ctaSecondary={{
      text: "Take the Change Readiness Assessment",
      href: "/assessment",
    }}
    structuredData={{
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Change Management Consulting Stockholm",
      description:
        "Psychology-backed organizational change management consulting in Stockholm and the Nordic region using the CLEAR Change Framework.",
      provider: {
        "@type": "ProfessionalService",
        name: "EB Consulting",
        founder: {
          "@type": "Person",
          name: "Erik Bohjort",
          jobTitle: "Licensed Psychologist",
        },
      },
      areaServed: [
        { "@type": "City", name: "Stockholm" },
        { "@type": "Country", name: "Sweden" },
      ],
      serviceType: "Change Management Consulting",
      url: "https://clear-framework.com/consulting/change-management-stockholm",
    }}
  />
);

export default ChangeManagementStockholm;
