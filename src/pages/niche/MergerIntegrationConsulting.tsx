import NichePage from "@/components/NichePage";

const BOOKINGS_URL =
  "https://outlook.office.com/bookwithme/user/167d92190d9d4c67817f5d3f0b60c1e3@eb-consulting.se/meetingtype/K9Lm6Ith2UyhTSG6sgq4KA2?anonymous&ismsaljsauthenabled&ep=mlink";

const MergerIntegrationConsulting = () => (
  <NichePage
    seoTitle="Post-Merger Integration Consultant | M&A Change Management | CLEAR Framework"
    seoDescription="Psychology-informed post-merger integration consulting. The CLEAR framework addresses culture clash, talent retention, and leadership alignment during M&A transitions with evidence-based change management methodology."
    seoPath="/consulting/merger-integration-consulting"
    heroTag="M&A Integration"
    headline="Post-Merger Integration Consulting"
    subheadline="Navigate the human side of mergers and acquisitions with psychology-informed change management. The financial deal closes in months, but the organizational integration takes years\u2014and most failures happen because the people dimension is treated as an afterthought."
    challengeTitle="The Integration Challenge"
    challenges={[
      {
        title: "Culture Clash Between Merging Organizations",
        description:
          "Every M&A deal looks good on a spreadsheet. The financial synergies are modeled, the market position is mapped, and the strategic rationale is compelling. But culture\u2014the accumulated patterns of behavior, values, and unwritten rules\u2014is rarely part of due diligence. When two organizational cultures collide without deliberate integration, the result is a protracted cold war that destroys the value the merger was supposed to create.",
      },
      {
        title: "Talent Retention During Uncertainty",
        description:
          "The announcement of a merger triggers immediate anxiety about job security, reporting lines, and career trajectories. Your best people\u2014the ones with the most options\u2014start updating their CVs first. The integration period is a talent retention crisis by default, and every week of ambiguity increases the risk of losing the people whose expertise makes the merged entity valuable.",
      },
      {
        title: "Systems Integration Beyond IT",
        description:
          "Post-merger integration planning typically focuses on systems in the technical sense: ERP consolidation, data migration, platform rationalization. But the deeper integration challenge is aligning decision-making systems, performance management systems, and the informal networks through which real work gets done. Technical integration without organizational integration creates a franken-system that serves neither legacy culture.",
      },
      {
        title: "Leadership Alignment Across Legacy Structures",
        description:
          "Merged leadership teams carry competing visions, loyalties, and assumptions about how things should work. Even when leaders intellectually support the merger, their default behaviors reflect their legacy organization. Without structured alignment work, leadership teams perform unity in town halls while operating as parallel structures in practice.",
      },
    ]}
    solutionTitle="How CLEAR Guides Post-Merger Integration"
    solutions={[
      {
        title: "Clarity Phase Resolves Competing Visions",
        description:
          "CLEAR's Clarity phase creates a structured process for the merged leadership team to co-create a shared vision that genuinely integrates both legacy perspectives. This isn't a communication exercise where one side's vision is presented as the combined one. It's a facilitated negotiation where differences are surfaced, acknowledged, and resolved into objectives that both organizations can commit to\u2014because both organizations shaped them.",
      },
      {
        title: "Systems Mapping Reveals Cultural Fault Lines",
        description:
          "Before cultures clash visibly in conflict and turnover, the fault lines are already present in incompatible assumptions about decision-making, communication, and accountability. CLEAR's Leverage phase maps these cultural systems explicitly, making invisible differences visible before they become destructive. When the merged leadership team can see where their organizations actually differ\u2014not where they think they differ\u2014they can address integration proactively.",
      },
      {
        title: "Behavioral Design Reduces Merger Anxiety",
        description:
          "Uncertainty during M&A creates predictable psychological responses: threat perception, in-group/out-group dynamics, and defensive behavior. CLEAR applies behavioral design to reduce these responses\u2014not by providing false reassurance, but by creating structures that give people genuine agency in the integration process. When people have meaningful input into how integration affects their work, anxiety decreases and constructive engagement increases.",
      },
      {
        title: "Listening-Based Approach Surfaces Hidden Resistance",
        description:
          "In merger environments, overt resistance is rare\u2014people know that visible opposition is career-limiting. Instead, resistance goes underground: passive non-compliance, strategic information withholding, and quiet sabotage. CLEAR's foundation in psychological listening techniques creates safe channels for surfacing these concerns, allowing integration planners to address real obstacles rather than pretending they don't exist.",
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
      name: "Post-Merger Integration Consulting",
      description:
        "Psychology-informed post-merger integration and M&A change management consulting using the CLEAR Change Framework.",
      provider: {
        "@type": "ProfessionalService",
        name: "EB Consulting",
        founder: {
          "@type": "Person",
          name: "Erik Bohjort",
          jobTitle: "Licensed Psychologist",
        },
      },
      serviceType: "Post-Merger Integration Consulting",
      url: "https://clear-framework.com/consulting/merger-integration-consulting",
    }}
  />
);

export default MergerIntegrationConsulting;
