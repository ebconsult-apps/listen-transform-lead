import NichePage from "@/components/NichePage";

const BOOKINGS_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const ChangeManagementEurope = () => (
  <NichePage
    seoTitle="Change Management Consultant Europe | CLEAR Change Framework"
    seoDescription="Cross-cultural organizational change consulting across Europe. The CLEAR framework navigates EU regulatory complexity, distributed workforce transformation, and cultural differences with evidence-based methodology."
    seoPath="/consulting/change-management-europe"
    heroTag="Pan-European"
    headline="Organizational Change Consulting Across Europe"
    subheadline="Navigating cross-cultural transformation with evidence-based methodology. The CLEAR framework adapts to local contexts while maintaining strategic coherence across borders."
    challengeTitle="The European Challenge"
    challenges={[
      {
        title: "Cross-Cultural Change Across EU Markets",
        description:
          "Change that succeeds in Germany may fail in Spain. European organizations operate across cultures with fundamentally different attitudes toward hierarchy, uncertainty, and communication. A one-size-fits-all change program ignores these differences and breeds resentment in local teams who feel their context has been dismissed.",
      },
      {
        title: "Regulatory Complexity at Scale",
        description:
          "GDPR, ESG reporting directives, AI governance, labor law variation across member states\u2014European organizations face a regulatory environment that demands organizational agility. Compliance isn't a one-time project; it requires embedding adaptive capacity into how your organization operates day to day.",
      },
      {
        title: "Distributed and Remote Workforce Transformation",
        description:
          "Post-pandemic Europe has embraced hybrid and remote work, but many organizations are struggling with the second-order effects: eroding culture, reduced mentoring, decision-making bottlenecks, and change fatigue. Transforming a distributed workforce requires different tools than transforming a co-located one.",
      },
      {
        title: "Post-Brexit Organizational Restructuring",
        description:
          "Organizations spanning the UK and EU have faced years of structural disruption. Supply chains, talent pipelines, legal entities, and reporting lines have all been affected. The human side of this restructuring\u2014uncertainty, identity, and loyalty\u2014is often the last thing addressed and the first thing to cause problems.",
      },
    ]}
    solutionTitle="How CLEAR Works Across Borders"
    solutions={[
      {
        title: "CLEAR Bridges Cultural Differences Through Listening",
        description:
          "The framework's foundation in organizational psychology means it starts by understanding how people actually experience change\u2014not how management assumes they do. CLEAR's Clarity phase surfaces cultural assumptions and creates shared language across teams in different countries. When a German engineering team and a French sales team can articulate shared objectives in terms both groups shaped, cross-cultural alignment becomes achievable.",
      },
      {
        title: "Systems Mapping Handles EU Regulatory Complexity",
        description:
          "European regulatory requirements don't exist in isolation\u2014they interact with each other and with your operational reality. CLEAR's Leverage phase uses systems mapping to visualize how regulatory requirements flow through your organization, identifying where compliance investments also create operational improvements. This transforms regulation from a cost center into a source of competitive advantage.",
      },
      {
        title: "Iterative Experimentation Adapts to Local Contexts",
        description:
          "CLEAR doesn't prescribe a single transformation playbook. Its Experimentation phase explicitly tests interventions in specific local contexts before scaling. What works in the Stockholm office gets validated before rolling out to Milan. This reduces the risk of change failure and respects the legitimate differences between markets while maintaining strategic coherence.",
      },
    ]}
    ctaPrimary={{ text: "Book a Free Discovery Call", href: BOOKINGS_URL }}
    ctaSecondary={{
      text: "Take the Change Readiness Assessment",
      href: "/assessment",
    }}
    structuredData={{
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Change Management Consulting Europe",
      description:
        "Cross-cultural organizational change management consulting across Europe using the CLEAR Change Framework.",
      provider: {
        "@type": "ProfessionalService",
        name: "EB Consulting",
        founder: {
          "@type": "Person",
          name: "Erik Bohjort",
          jobTitle: "Licensed Psychologist",
        },
      },
      areaServed: { "@type": "Continent", name: "Europe" },
      serviceType: "Change Management Consulting",
      url: "https://clear-framework.com/consulting/change-management-europe",
    }}
  />
);

export default ChangeManagementEurope;
